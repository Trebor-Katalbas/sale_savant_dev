import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  InputAdornment,
  InputLabel,
  ListSubheader,
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

const AddInventorySchema = Yup.object().shape({
  dateTime: Yup.date().required("Required"),
  menuItem: Yup.string().required("Required"),
  category: Yup.string().required("Required"),
  price: Yup.number()
  .positive("Price must not be a negative number")
  .required("Required")
  .test('is-not-zero', 'Price cannot be zero', value => value > 0),
  salesTarget: Yup.number()
    .min(0, 'Sales target must not be a negative number')
    .required("Required"),
  noSold: Yup.number()
    .min(0, 'Number of sold items must not be a negative number')
    .required("Required"),
  description: Yup.string(),
});

const AddInventory = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [menuItems, setMenuItems] = useState([]);
  const [category, setCategory] = useState([]);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  // eslint-disable-next-line
  const [selectedMenuItem, setSelectedMenuItem] = useState("");

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch(
          `${baseUrl}menumanagement/menu`
        );
        if (response.ok) {
          const data = await response.json();
          setMenuItems(data);
        } else {
          console.error("Failed to fetch menu items:", response.statusText);
        }
      } catch (error) {
        console.error("An error occurred during the fetch:", error);
      }
    };

    fetchMenuItems();
  }, []);

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

  const handleMenuItemChange = async (value, setValues) => {
    const selectedMenu = menuItems.find((menu) => menu.menuItem === value);

    if (selectedMenu) {
      setValues({
        ...selectedMenu,
        dateTime: new Date().toISOString().substring(0, 16),
        noSold: 0,
      });
    }

    setSelectedMenuItem(value);
  };

  const groupedMenuItems = category.reduce((acc, cat) => {
    const categoryItems = menuItems
      .filter((menuItem) => menuItem.category === cat.categoryName)
      .sort((a, b) => a.menuItem.localeCompare(b.menuItem));
    return { ...acc, [cat.categoryName]: categoryItems };
  }, {});

  const initialValues = {
    dateTime: new Date().toISOString().substring(0, 16),
    menuItem: "",
    category: "",
    price: "",
    salesTarget: "",
    noSold: "",
    description: "",
  };

  const handleSubmit = async (values) => {
    try {
      const response = await fetch(
        `${baseUrl}menumanagement/addinventory`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );

      if (response.ok) {
        console.log("Inventory added successfully!");
        setSuccessModalOpen(true);
        setTimeout(() => {
          setSuccessModalOpen(false);
          navigate("/menu inventory");
        }, 1500);
      } else {
        console.error("Failed to add inventory:", response.statusText);
      }
    } catch (error) {
      console.error("An error occurred during the fetch:", error);
    }
  };

  return (
    <>
      <Box>
        <Box>
          <Header title={"Add Menu Inventory"} disp={"none"} />
        </Box>

        <Formik
          initialValues={initialValues}
          validationSchema={AddInventorySchema}
          onSubmit={handleSubmit}
        >
          {({
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            setValues,
          }) => (
            <Form>
              <Box sx={{ margin: "2em", width: "60%" }}>
                <InputLabel htmlFor="dateTime">Date and Time</InputLabel>
                <Field
                  name="dateTime"
                  type="datetime-local"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.dateTime}
                  as={TextField}
                  sx={{
                    background: theme.palette.primary[700],
                    marginBottom: "1em",
                  }}
                  error={Boolean(touched.dateTime) && Boolean(errors.dateTime)}
                  helperText={touched.dateTime && errors.dateTime}
                />
                <InputLabel htmlFor="menuItem">Menu Item</InputLabel>
                <Field
                  name="menuItem"
                  onBlur={handleBlur}
                  onChange={(e) => {
                    handleChange(e);
                    handleMenuItemChange(e.target.value, setValues);
                  }}
                  value={values.menuItem}
                  as={TextField}
                  fullWidth
                  select
                  sx={{
                    background: theme.palette.primary[700],
                    marginBottom: "1em",
                  }}
                  error={Boolean(touched.menuItem) && Boolean(errors.menuItem)}
                  helperText={touched.menuItem && errors.menuItem}
                >
                  {Object.entries(groupedMenuItems).map(([category, items]) => [
                    <ListSubheader
                      key={`category-${category}`}
                      sx={{
                        background: theme.palette.primary[500],
                        color: theme.palette.secondary[400],
                        fontWeight: "bold",
                      }}
                    >
                      {category}
                    </ListSubheader>,
                    ...items.map((menuItem) => (
                      <MenuItem
                        key={menuItem.menuItem}
                        value={menuItem.menuItem}
                      >
                        {menuItem.menuItem}
                      </MenuItem>
                    )),
                  ])}
                </Field>
                <InputLabel htmlFor="category">Category</InputLabel>
                <Field
                  disabled
                  name="category"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.category}
                  select
                  as={TextField}
                  fullWidth
                  sx={{
                    background: theme.palette.primary[700],
                    marginBottom: "1em",
                  }}
                  error={Boolean(touched.category) && Boolean(errors.category)}
                  helperText={touched.category && errors.category}
                >
                  {category.map((cat) => (
                    <MenuItem key={cat.id} value={cat.categoryName}>
                      {cat.categoryName}
                    </MenuItem>
                  ))}
                </Field>
                <Box display="flex" gap="1.5em">
                  <Field
                    name="price"
                    label="Price"
                    type="number"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.price}
                    as={TextField}
                    fullWidth
                    margin="normal"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          Php
                        </InputAdornment>
                      ),
                    }}
                    sx={{ background: theme.palette.primary[700] }}
                    error={Boolean(touched.price) && Boolean(errors.price)}
                    helperText={touched.price && errors.price}
                  />
                  <Field
                    name="noSold"
                    label="No. of Sold"
                    type="number"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.noSold}
                    as={TextField}
                    fullWidth
                    margin="normal"
                    sx={{ background: theme.palette.primary[700] }}
                    error={Boolean(touched.noSold) && Boolean(errors.noSold)}
                    helperText={touched.noSold && errors.noSold}
                  />
                  <Field
                    name="salesTarget"
                    label="Sales Target"
                    type="number"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.salesTarget}
                    as={TextField}
                    fullWidth
                    margin="normal"
                    sx={{ background: theme.palette.primary[700] }}
                    error={
                      Boolean(touched.salesTarget) &&
                      Boolean(errors.salesTarget)
                    }
                    helperText={touched.salesTarget && errors.salesTarget}
                  />
                </Box>
                <InputLabel htmlFor="description" sx={{ marginTop: "1em" }}>
                  Description
                </InputLabel>
                <Field
                  disabled
                  name="description"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.description}
                  as={TextField}
                  fullWidth
                  sx={{ background: theme.palette.primary[700] }}
                  error={
                    Boolean(touched.description) && Boolean(errors.description)
                  }
                  helperText={touched.description && errors.description}
                  multiline
                  rows={4}
                />

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
                    <Link to="/menu inventory">
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

export default AddInventory;
