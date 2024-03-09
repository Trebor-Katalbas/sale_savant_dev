import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
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

const AddLossSchema = Yup.object().shape({
  dateTime: Yup.date().required("Required"),
  menuItem: Yup.string().required("Required"),
  category: Yup.string().required("Required"),
  salesTarget: Yup.number().required("Required"),
  noSold: Yup.number().required("Required"),
  totalPrice: Yup.number().required("Required"),
  lossQuantity: Yup.number().required("Required"),
  lossPrice: Yup.number().required("Required"),
});

const categories = ["Main Dish", "Tausug Dish", "Dessert", "Tausug Dessert", "Drinks"];

const AddLoss = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [menuItems, setMenuItems] = useState([]);
  // eslint-disable-next-line
  const [selectedMenuItem, setSelectedMenuItem] = useState("");

  useEffect(() => {
    const fetchMenuInventory = async () => {
      try {
        const response = await fetch(
          "http://localhost:3001/menumanagement/menuInventory"
        );
        if (response.ok) {
          const data = await response.json();
          setMenuItems(data);
        } else {
          console.error("Failed to fetch menu inventory:", response.statusText);
        }
      } catch (error) {
        console.error("An error occurred during the fetch:", error);
      }
    };

    fetchMenuInventory();
  }, []);

  const handleMenuItemChange = async (value, setValues) => {
    const selectedMenu = menuItems.find((menu) => menu.menuItem === value);

    if (selectedMenu) {
      setValues({
        ...selectedMenu,
        totalPrice: selectedMenu.noSold * selectedMenu.price,
        lossQuantity: selectedMenu.salesTarget - selectedMenu.noSold,
        lossPrice:
          (selectedMenu.salesTarget - selectedMenu.noSold) * selectedMenu.price,
        dateTime: new Date().toISOString().substring(0, 16),
      });
    }

    setSelectedMenuItem(value);
  };

  const groupedMenuItems = categories.reduce((acc, category) => {
    const categoryItems = menuItems
      .filter((menuItem) => menuItem.category === category)
      .sort((a, b) => a.menuItem.localeCompare(b.menuItem));
    return { ...acc, [category]: categoryItems };
  }, {});

  const initialValues = {
    dateTime: new Date().toISOString().substring(0, 16),
    menuItem: "",
    category: "",
    salesTarget: "",
    noSold: "",
    totalPrice: "",
    lossQuantity: "",
    lossPrice: "",
  };

  const handleSubmit = async (values) => {
    try {
      const response = await fetch(
        "http://localhost:3001/menumanagement/addLoss",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );

      if (response.ok) {
        console.log("Dishes Loss added successfully!");
        navigate("/menu loss");
      } else {
        console.error("Failed to add dishes loss:", response.statusText);
      }
    } catch (error) {
      console.error("An error occurred during the fetch:", error);
    }
  };

  return (
    <>
      <Box>
        <Box>
          <Header title={"Add Dishes Loss"} disp={"none"} />
        </Box>

        <Formik
          initialValues={initialValues}
          validationSchema={AddLossSchema}
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
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Field>
                <Box display="flex" justifyContent="flex-end" paddingRight="10px">
                  <Typography>Price: Php {values.price}</Typography>
                </Box>
                <Box display="flex" gap="1.5em">
                  <Field
                    disabled
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
                  <Field
                    disabled
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
                    name="totalPrice"
                    label="Total Price (in Php)"
                    type="number"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.totalPrice}
                    as={TextField}
                    fullWidth
                    margin="normal"
                    sx={{ background: theme.palette.primary[700] }}
                    error={
                      Boolean(touched.totalPrice) && Boolean(errors.totalPrice)
                    }
                    helperText={touched.totalPrice && errors.totalPrice}
                  />
                </Box>
                <Box display="flex" gap="1.5em">
                  <Field
                    name="lossQuantity"
                    label="Loss Quantity"
                    type="number"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.lossQuantity}
                    as={TextField}
                    fullWidth
                    margin="normal"
                    sx={{ background: theme.palette.primary[700] }}
                    error={
                      Boolean(touched.lossQuantity) &&
                      Boolean(errors.lossQuantity)
                    }
                    helperText={touched.lossQuantity && errors.lossQuantity}
                  />
                  <Field
                    name="lossPrice"
                    label="Loss Price (in Php)"
                    type="number"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.lossPrice}
                    as={TextField}
                    fullWidth
                    margin="normal"
                    sx={{ background: theme.palette.primary[700] }}
                    error={
                      Boolean(touched.lossPrice) && Boolean(errors.lossPrice)
                    }
                    helperText={touched.lossPrice && errors.lossPrice}
                  />
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
                    <Link to="/menu loss">
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
    </>
  );
};

export default AddLoss;
