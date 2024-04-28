import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Divider,
  InputAdornment,
  InputLabel,
  MenuItem,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import { Header } from "components";
import { Link, useNavigate } from "react-router-dom";
import { baseUrl } from "state/api";
import TaskAltIcon from "@mui/icons-material/TaskAlt";

const AddPromoSchema = Yup.object().shape({
  promoName: Yup.string().required("Promo Name is required"),
  applicability: Yup.string().required("Promo Applicability is required"),
  promoType: Yup.string().required("Promo Type is required"),
  promoDesc: Yup.string(),
  promoValue: Yup.number().required("Promo Value is required").positive("Value must not be a negative number")
  .required("Required")
  .test('is-not-zero', 'Value cannot be zero', value => value > 0),
  validDate: Yup.date().required("Valid Date is required"),
});

const AddPromo = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [menuItems, setMenuItems] = useState([]);
  const [category, setCategory] = useState([]);
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  const fetchCategory = async () => {
    try {
      const response = await fetch(`${baseUrl}menumanagement/getCategory`);
      if (response.ok) {
        const data = await response.json();
        const categoryWithId = data.map((item, index) => ({
          ...item,
          id: index + 1,
        }));
        setCategory(categoryWithId);
      } else {
        console.error("Failed to fetch category:", response.statusText);
      }
    } catch (error) {
      console.error("An error occurred during the fetch:", error);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  const handleChangePromoType = (e, setFieldValue, values) => {
    const { name, value } = e.target;

    const promoType =
      value === "All Menu" || category.includes(value)
        ? "Percentage"
        : "Fixed";

    setFieldValue(name, value);
    setFieldValue("promoType", promoType);
  };

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch(
          `${baseUrl}menumanagement/menu`
        );
        if (response.ok) {
          const data = await response.json();
          setMenuItems(data);
        } else {
          console.error("Failed to fetch menu:", response.statusText);
        }
      } catch (error) {
        console.error("An error occurred during the fetch:", error);
      }
    };

    fetchMenu();
  }, []);

  const groupedMenuItems = category.reduce((acc, cat) => {
    const categoryItems = menuItems
      .filter((menuItem) => menuItem.category === cat.categoryName)
      .sort((a, b) => a.menuItem.localeCompare(b.menuItem));
    return { ...acc, [cat.categoryName]: categoryItems };
  }, {});

  const initialValues = {
    promoName: "",
    applicability: "",
    promoType: "",
    promoDesc: "",
    promoValue: "",
    validDate: "",
    promoStatus: "",
    promoUsage: 0,
  };

  const handleSubmit = async (values) => {
    const currentDate = new Date();
    const validUntilDate = new Date(values.validDate);
    const promoStatus = validUntilDate >= currentDate ? "Active" : "Expired";

    const updatedValues = { ...values, promoStatus };
    try {
      const response = await fetch(
        `${baseUrl}menumanagement/addPromo`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedValues),
        }
      );

      if (response.ok) {
        console.log("Promo added successfully!");
        setSuccessModalOpen(true);
        setTimeout(() => {
          setSuccessModalOpen(false);
          navigate("/menu promos");
        }, 1500);
      } else {
        console.error("Failed to add promo:", response.statusText);
      }
    } catch (error) {
      console.error("An error occurred during the fetch:", error);
    }
  };

  return (
    <>
      <Box>
        <Box>
          <Header title={"Add Promo/Discount"} disp={"none"} />
        </Box>

        <Formik
          initialValues={initialValues}
          validationSchema={AddPromoSchema}
          onSubmit={handleSubmit}
        >
          {({
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            setFieldValue,
          }) => (
            <Form>
              <Box sx={{ margin: "0 2em", width: "60%" }}>
                <InputLabel htmlFor="promoName">Promo/Discount Name</InputLabel>
                <Field
                  name="promoName"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.promoName}
                  as={TextField}
                  fullWidth
                  sx={{
                    background: theme.palette.primary[700],
                    marginBottom: "1em",
                  }}
                  error={
                    Boolean(touched.promoName) && Boolean(errors.promoName)
                  }
                  helperText={touched.promoName && errors.promoName}
                />
                <InputLabel htmlFor="applicability">
                  Promo/Discount Applicability
                </InputLabel>
                <Field
                  name="applicability"
                  onBlur={handleBlur}
                  onChange={(e) =>
                    handleChangePromoType(e, setFieldValue, values)
                  }
                  value={values.applicability}
                  as={TextField}
                  fullWidth
                  select
                  sx={{
                    background: theme.palette.primary[700],
                    marginBottom: "1em",
                    "& .MuiSelect-select": {
                      display:"flex",
                      justifyContent:"space-between",
                    }
                  }}
                  error={Boolean(touched.applicability && errors.applicability)}
                  helperText={touched.applicability && errors.applicability}
                >
                  <MenuItem
                    value="All Menu"
                    sx={{
                      fontSize: "1.5em",
                      background: theme.palette.secondary[600],
                    }}
                  >
                    All Menu
                  </MenuItem>
                  <Divider />
                  {Object.entries(groupedMenuItems).map(([category, items]) => [
                    <MenuItem
                      key={`category-${category.id}`}
                      value={category.categoryName}
                      sx={{
                        background: theme.palette.primary[500],
                        color: theme.palette.secondary[400],
                        fontWeight: "bold",
                      }}
                    >
                      {category.categoryName}
                    </MenuItem>,
                    ...items.map((menuItem) => (
                      <MenuItem
                        key={menuItem.menuItem}
                        value={menuItem.menuItem}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <div>{menuItem.menuItem}</div>
                        <div>Php {menuItem.price}</div>
                      </MenuItem>
                    )),
                  ])}
                </Field>
                <InputLabel htmlFor="promoType">Promo/Discount Type</InputLabel>
                <TextField
                  name="promoType"
                  onBlur={handleBlur}
                  onChange={(e) => {
                    handleChange(e);
                  }}
                  value={values.promoType}
                  fullWidth
                  select
                  sx={{
                    background: theme.palette.primary[700],
                    marginBottom: "1em",
                  }}
                  error={Boolean(touched.promoType && errors.promoType)}
                  helperText={touched.promoType && errors.promoType}
                >
                  <MenuItem value="Percentage">Percentage Discount</MenuItem>
                  <MenuItem value="Fixed">Fixed Amount Discount</MenuItem>
                </TextField>

                <Divider sx={{ margin: "1.5em 0" }} />
                <Typography variant="h4" sx={{ marginBottom: "1em" }}>
                  Validation and Price
                </Typography>

                <Box
                  display="flex"
                  gap="2em"
                  sx={{
                    flexDirection: {
                      xs: "column",
                      sm: "column",
                      md: "column",
                      lg: "row",
                    },
                  }}
                >
                  <Box>
                    <InputLabel htmlFor="validDate">Valid Until</InputLabel>
                    <Field
                      name="validDate"
                      type="date"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.validDate}
                      as={TextField}
                      sx={{
                        background: theme.palette.primary[700],
                        marginBottom: "1em",
                      }}
                      error={
                        Boolean(touched.validDate) && Boolean(errors.validDate)
                      }
                      helperText={touched.validDate && errors.validDate}
                    />
                    <InputLabel htmlFor="promoValue">Promo/Discount Value</InputLabel>
                    {values.promoType !== "Percentage" ? (
                      <TextField
                        name="promoValue"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.promoValue}
                        fullWidth
                        type="number"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              Php
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          background: theme.palette.primary[700],
                          marginBottom: "0.5em",
                        }}
                        error={Boolean(touched.promoValue && errors.promoValue)}
                        helperText={touched.promoValue && errors.promoValue}
                      />
                    ) : (
                      <TextField
                        name="promoValue"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.promoValue}
                        fullWidth
                        type="number"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">%</InputAdornment>
                          ),
                        }}
                        sx={{
                          background: theme.palette.primary[700],
                          marginBottom: "0.5em",
                        }}
                        error={Boolean(touched.promoValue && errors.promoValue)}
                        helperText={touched.promoValue && errors.promoValue}
                      />
                    )}
                  </Box>

                  <Box width="100%">
                    <InputLabel htmlFor="promoDesc">
                      Description
                    </InputLabel>
                    <Field
                      name="promoDesc"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.promoDesc}
                      as={TextField}
                      fullWidth
                      sx={{ background: theme.palette.primary[700] }}
                      error={
                        Boolean(touched.promoDesc) && Boolean(errors.promoDesc)
                      }
                      helperText={touched.promoDesc && errors.promoDesc}
                      multiline
                      rows={5}
                    />
                  </Box>
                </Box>

                <Box mt={2} display="flex" justifyContent="flex-end">
                  <Box display="flex" flexDirection="column" gap="1em">
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      sx={{
                        width: "120px",
                        background: "#35D03B",
                        color: theme.palette.grey[900],
                      }}
                    >
                      Add
                    </Button>
                    <Link to="/menu promos">
                      <Button
                        variant="outlined"
                        color="secondary"
                        sx={{
                          width: "120px",
                          background: theme.palette.secondary[800],
                        }}
                      >
                        Cancel
                      </Button>
                    </Link>
                  </Box>
                </Box>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>

      {successModalOpen && (
        <Box
          sx={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            padding: "1em",
            borderRadius: "10px",
            color:'green',
            border:'solid 1px green'
          }}
        >
          <Typography
            variant="h3"
            display="flex"
            alignItems="center"
            gap="0.5em"
          >
            <TaskAltIcon sx={{ fontSize: "1.5em" }} />
            Successfully Added
          </Typography>
        </Box>
      )}
    </>
  );
};

export default AddPromo;
