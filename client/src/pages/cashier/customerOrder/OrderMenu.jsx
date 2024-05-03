import { Search } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Checkbox,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Drawer,
  FormControl,
  FormControlLabel,
  IconButton,
  InputBase,
  InputLabel,
  MenuItem,
  Select,
  Skeleton,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { Add, Remove } from "@mui/icons-material";
import ClearIcon from "@mui/icons-material/Clear";
import CircleIcon from "@mui/icons-material/Circle";
import { OrderCard as ItemCard, FlexBetween, Receipt } from "components";
import React, { useEffect, useState } from "react";
import { getOrderNo, getOrderType } from "../TakeOrder";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "state/api";

const OrderMenu = (props) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [tables, setTables] = useState([]);
  const [menuData, setMenuData] = useState([]);
  const [menuPromo, setMenuPromo] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchValue, setSearchValue] = useState("");
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [addedDishes, setAddedDishes] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTables, setSelectedTables] = useState([]);
  const [isPromoDialogOpen, setIsPromoDialogOpen] = useState(false);
  const [savedPromos, setSavedPromos] = useState(false);
  const [selectedPromos, setSelectedPromos] = useState([]);
  const [discountedAmount, setDiscountedAmount] = useState([]);
  const [category, setCategory] = useState([]);
  const { window } = props;
  const OrderType = getOrderType();
  const OrderNo = getOrderNo();

  useEffect(() => {
    if (OrderType === "Take-out") {
      setSelectedTables(["Take-out"]);
    }
  }, [OrderType]);

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

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const response = await fetch(`${baseUrl}menumanagement/menu`);
        if (response.ok) {
          const data = await response.json();
          setMenuData(data);
        } else {
          console.error("Failed to fetch menu data:", response.statusText);
        }
      } catch (error) {
        console.error("An error occurred during the fetch:", error);
      }
    };

    fetchMenuData();
  }, []);

  useEffect(() => {
    const fetchMenuPromos = async () => {
      try {
        const response = await fetch(`${baseUrl}menumanagement/menuPromo`);
        if (response.ok) {
          const data = await response.json();
          const menuPromoWithId = data.map((item, index) => ({
            ...item,
            id: index + 1,
          }));
          setMenuPromo(menuPromoWithId);
        } else {
          console.error("Failed to fetch menu promo:", response.statusText);
        }
      } catch (error) {
        console.error("An error occurred during the fetch:", error);
      }
    };

    fetchMenuPromos();
  }, []);

  useEffect(() => {
    const fetchTableData = async () => {
      try {
        const response = await fetch(`${baseUrl}cashier/get-table`);
        if (response.ok) {
          const data = await response.json();
          setTables(data);
        } else {
          console.error("Failed to fetch table data:", response.statusText);
        }
      } catch (error) {
        console.error("An error occurred during the fetch:", error);
      }
    };

    fetchTableData();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Promo Dialog
  const handleAddSelectedPromo = (promo) => {
    if (
      !selectedPromos.some((selectedPromo) => selectedPromo.id === promo.id)
    ) {
      setSelectedPromos([...selectedPromos, promo]);
    }
  };

  const handleRemoveSelectedPromo = (promo) => {
    setSelectedPromos(
      selectedPromos.filter((selectedPromo) => selectedPromo.id !== promo.id)
    );
  };

  const handleOpenPromoDialog = () => {
    setIsPromoDialogOpen(true);
  };

  const handleSavePromo = () => {
    setSavedPromos(true);
  };

  const handleClosePromoDialog = () => {
    setIsPromoDialogOpen(false);
  };

  const resetOriginalPrices = () => {
    const updatedDishes = addedDishes.map((dish) => {
      const originalMenu = menuData.find(
        (menu) => menu.menuItem === dish.menuName
      );
      console.log(originalMenu);
      const originalPrice = originalMenu.price;
      return {
        ...dish,
        total: originalPrice * dish.quantity,
      };
    });
    setDiscountedAmount([]);
    setAddedDishes(updatedDishes);
  };

  const handleCancelPromoDialog = () => {
    setSavedPromos(false);
    setSelectedPromos([]);
    resetOriginalPrices();
    setIsPromoDialogOpen(false);
  };

  const handleApplyPromo = () => {
    handleSavePromo();
    handleClosePromoDialog();
    let totalDiscountedPrice = 0;

    selectedPromos.forEach((promo) => {
      if (promo.promoType === "Percentage") {
        const isApplicable = addedDishes.some(
          (dish) =>
            promo.applicability === "All Menu" ||
            promo.applicability.includes(dish.menuName) ||
            promo.applicability.includes(dish.category)
        );

        if (isApplicable) {
          const discountedPrice =
            calculateTotalAmount().subTotal * (promo.promoValue / 100);

          totalDiscountedPrice += discountedPrice;
        }
        setDiscountedAmount([totalDiscountedPrice]);
      } else if (promo.promoType === "Fixed") {
        addedDishes.map((dish) => {
          if (
            promo.applicability === "All Menu" ||
            promo.applicability.includes(dish.menuName) ||
            promo.applicability.includes(dish.category)
          ) {
            const discountedPrice = promo.promoValue;
            const discountAmount =
              (dish.price - discountedPrice) * dish.quantity;
            totalDiscountedPrice += discountAmount;
          }
          return dish;
        });
        setDiscountedAmount([totalDiscountedPrice]);
      }
    });
  };

  // Table Dialog
  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleConfirm = () => {
    setIsDialogOpen(false);
  };

  const handleCloseDialog = () => {
    setSelectedTables([]);
    setIsDialogOpen(false);
  };

  // Cancel Order
  const handleCancelOrder = () => {
    navigate("/take-order");
  };

  const handleCheckboxChange = (tableName) => {
    if (selectedTables.includes(tableName)) {
      setSelectedTables(selectedTables.filter((table) => table !== tableName));
    } else {
      if (selectedTables.length < 2) {
        setSelectedTables([...selectedTables, tableName]);
      } else {
        console.log("You can only select two tables.");
      }
    }
  };

  const handleConfirmTables = async () => {
    try {
      const updatedTables = tables.map((table) => {
        if (selectedTables.includes(table.tableNo)) {
          return { ...table, status: "Occupied" };
        }
        return table;
      });

      const response = await fetch(`${baseUrl}cashier/update-table-status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTables),
      });

      if (response.ok) {
        console.log("Table status updated successfully");
        console.log("Selected Tables:", selectedTables);
        handleCloseDialog();
      } else {
        console.error("Failed to update table status:", response.statusText);
      }
    } catch (error) {
      console.error("An error occurred during table status update:", error);
    }
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleAddDish = (dish) => {
    setAddedDishes([...addedDishes, { ...dish, _id: dish.menuId }]);
  };

  const handleQuantityChange = (index, action) => {
    const updatedDishes = [...addedDishes];
    const dish = updatedDishes[index];

    if (action === "increment") {
      dish.quantity++;
    } else if (action === "decrement") {
      if (dish.quantity > 1) {
        dish.quantity--;
      }
    }

    dish.total = dish.price * dish.quantity;
    setAddedDishes(updatedDishes);
  };

  const handleRemoveDish = (index) => {
    const updatedDishes = [...addedDishes];
    updatedDishes.splice(index, 1);
    setAddedDishes(updatedDishes);
  };

  const filteredMenuData =
    selectedCategory === "All"
      ? menuData.filter((menu) =>
          menu.menuItem.toLowerCase().includes(searchValue.toLowerCase())
        )
      : menuData.filter(
          (menu) =>
            menu.category === selectedCategory &&
            menu.menuItem.toLowerCase().includes(searchValue.toLowerCase())
        );

  const toggleReceiptDrawer = (open) => {
    setIsReceiptOpen(open);
  };

  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const handleSubmitOrder = async () => {
    const orderDetails = {
      items: addedDishes.map((dish) => ({
        menuItemId: dish._id,
        menuItem: dish.menuName,
        quantity: dish.quantity,
        price: dish.price,
        totalPrice: dish.total,
      })),
      promoUsed: selectedPromos.map((promo) => ({
        promoName: promo.promoName,
        promoUsage: addedDishes.reduce((acc, dish) => {
          if (
            promo.applicability === "All Menu" ||
            promo.applicability.includes(dish.menuName) ||
            promo.applicability.includes(dish.category)
          ) {
            return acc + dish.quantity;
          }
          return acc;
        }, 0),
      })),
      orderType: OrderType,
      tableNo: selectedTables.join(", "),
      orderNo: OrderNo,
      status: "Unpaid",
      kitchenStatus: "Pending",
      subTotal: calculateTotalAmount().subTotal.toFixed(2),
      amountDiscounted: calculateTotalAmount().amountDiscounted.toFixed(2),
      totalAmount: calculateTotalAmount().total.toFixed(2),
    };
    console.log(orderDetails);

    try {
      const response = await fetch(`${baseUrl}cashier/create-receipt`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderDetails),
      });

      if (response.ok) {
        console.log("Order submitted successfully");

        handleConfirmTables();
        navigate(`/order-placed/${OrderNo}`);
      } else {
        console.error("Failed to create receipt:", response.statusText);
      }
    } catch (error) {
      console.error("An error occurred during receipt creation:", error);
    }
  };

  const calculateTotalAmount = () => {
    if (addedDishes.length === 0) {
      return {
        total: 0,
        vatable: 0,
        vat: 0,
        amountDiscounted: 0,
        subTotal: 0,
      };
    }

    const totalAmount = addedDishes.reduce(
      (acc, dish) => {
        acc.total += dish.price * dish.quantity;
        return acc;
      },
      { total: 0, vatable: 0, vat: 0, amountDiscounted: 0, subTotal: 0 }
    );

    totalAmount.vatable = totalAmount.total / 1.12;
    totalAmount.vat = totalAmount.total - totalAmount.vatable;
    totalAmount.amountDiscounted = discountedAmount.reduce(
      (acc, num) => acc + num,
      0
    );
    totalAmount.subTotal = totalAmount.vatable + totalAmount.vat;
    totalAmount.total =
      totalAmount.vatable + totalAmount.vat - totalAmount.amountDiscounted;

    return totalAmount;
  };

  return (
    <>
      <Box
        display="flex"
        flexDirection={{ xs: "column", md: "row" }}
        width="100%"
      >
        {isDesktop ? (
          <>
            <Typography
              sx={{
                position: "fixed",
                top: "2%",
                left: "2%",
                fontSize: "2em",
                fontWeight: "500",
                zIndex: -1,
              }}
            >
              Order Receipt
            </Typography>
            <Box
              position="fixed"
              margin="1em"
              sx={{
                display: "flex",
                flexDirection: "column",
                width: { xs: "95vw", md: "24vw" },
                height: "87vh",
                zIndex: 2,
                boxShadow: { xs: "none", md: "0px 4px 6px rgba(0, 0, 0, 0.2)" },
                borderRadius: "6px",
                background: "#fff",
              }}
            >
              <Box
                sx={{
                  background: theme.palette.grey[800],
                  borderRadius: "6px 6px 0 0",
                  color: "#fff",
                  padding: "1em",
                }}
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Typography>
                    Table No.{" "}
                    {selectedTables.length === 0 ? (
                      <span
                        style={{
                          background: theme.palette.primary[800],
                          color: theme.palette.secondary[300],
                          fontWeight: "600",
                          padding: "0 1em",
                          borderRadius: "2px",
                        }}
                      >
                        0
                      </span>
                    ) : (
                      <span
                        style={{
                          background: theme.palette.primary[800],
                          color: theme.palette.secondary[300],
                          fontWeight: "600",
                          padding: "0 0.2em",
                          borderRadius: "2px",
                          marginRight: "0.5em",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {selectedTables.join(", ")}
                      </span>
                    )}
                  </Typography>
                  <Typography>
                    Order No.{" "}
                    <span
                      style={{
                        background: theme.palette.primary[800],
                        color: theme.palette.secondary[300],
                        fontWeight: "600",
                        padding: "0 0.5em",
                        borderRadius: "2px",
                      }}
                    >
                      {OrderNo}
                    </span>
                  </Typography>
                </div>
                <Typography sx={{ color: "#1CDE75", marginTop: "0.5em" }}>
                  {OrderType}
                </Typography>
              </Box>
              <Box
                sx={{
                  maxHeight: "60vh",
                  overflowY: "auto",
                  "&::-webkit-scrollbar": {
                    width: "0.2em",
                  },
                  "&::-webkit-scrollbar-track": {
                    background: "#f1f1f1",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    background: "#888",
                    borderRadius: "0.5em",
                  },
                }}
              >
                {addedDishes.map((dish, index) => (
                  <Card
                    key={index}
                    variant="outlined"
                    sx={{
                      borderRadius: "0",
                      background: "#fff",
                      color: "#000",
                    }}
                  >
                    <CardContent sx={{ padding: "0 !important" }}>
                      <FlexBetween position="relative">
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <CardMedia
                            component="img"
                            sx={{ width: 60, height: 80 }}
                            alt={dish.menuName}
                            src={`${baseUrl}assets/${dish.img}`}
                            loading="lazy"
                          />
                          <div
                            style={{
                              width: "9vw",
                              margin: "0.5em",
                              display: "flex",
                              flexDirection: "column",
                              gap: "0.5em",
                            }}
                          >
                            <Typography variant="body1" fontWeight={600}>
                              {dish.menuName}
                            </Typography>
                            <Typography variant="body1">{`Php ${dish.price.toFixed(
                              2
                            )}`}</Typography>
                          </div>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            marginRight: "0.7em",
                            marginTop: "0.7em",
                            gap: "0.4em",
                          }}
                        >
                          <Typography
                            variant="body1"
                            style={{
                              fontWeight: "600",
                              color: theme.palette.secondary[400],
                            }}
                          >{`Php ${dish.total.toFixed(2)}`}</Typography>

                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.5em",
                            }}
                          >
                            <IconButton
                              sx={{
                                background: theme.palette.secondary[700],
                                fontSize: "0.8em",
                                padding: "5px",
                                "&:hover": {
                                  background: theme.palette.secondary[500],
                                },
                              }}
                              onClick={() =>
                                handleQuantityChange(index, "decrement")
                              }
                            >
                              <Remove fontSize="0.8em" />
                            </IconButton>
                            <Typography variant="body1">
                              {dish.quantity}
                            </Typography>
                            <IconButton
                              sx={{
                                background: theme.palette.secondary[700],
                                fontSize: "0.8em",
                                padding: "5px",
                                "&:hover": {
                                  background: theme.palette.secondary[500],
                                },
                              }}
                              onClick={() =>
                                handleQuantityChange(index, "increment")
                              }
                            >
                              <Add fontSize="0.8em" />
                            </IconButton>
                          </div>
                        </div>
                        <IconButton
                          sx={{
                            position: "absolute",
                            top: "0.1px",
                            right: "0.1px",
                            padding: "1px",
                            fontSize: "1em",
                          }}
                          onClick={() => handleRemoveDish(index)}
                        >
                          <ClearIcon fontSize="1em" />
                        </IconButton>
                      </FlexBetween>
                    </CardContent>
                  </Card>
                ))}
              </Box>
              <Box
                sx={{
                  background: theme.palette.grey[800],
                  borderRadius: "0 0 6px 6px",
                  color: "#fff",
                  padding: "1em",
                  marginTop: "auto",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.2em",
                    padding: "0 0.5em",
                    marginBottom: "0.5em",
                  }}
                >
                  <FlexBetween>
                    <Typography sx={{ fontWeight: "200" }}>
                      Includes VAT
                    </Typography>
                    <Typography sx={{ fontWeight: "200" }}>
                      ---------
                    </Typography>
                  </FlexBetween>
                  <FlexBetween>
                    <Typography sx={{ fontWeight: "200" }}>Subtotal</Typography>
                    <Typography sx={{ fontWeight: "200" }}>
                      {calculateTotalAmount().subTotal.toFixed(2)}
                    </Typography>
                  </FlexBetween>
                  <FlexBetween>
                    <Typography sx={{ fontWeight: "200" }}>
                      Amount Discounted
                    </Typography>
                    <Typography sx={{ fontWeight: "200" }}>
                      {calculateTotalAmount().amountDiscounted.toFixed(2)}
                    </Typography>
                  </FlexBetween>
                  <FlexBetween>
                    <Typography sx={{ fontWeight: "600" }}>Total</Typography>
                    <Typography sx={{ fontWeight: "600" }}>
                      {calculateTotalAmount().total.toFixed(2)}
                    </Typography>
                  </FlexBetween>
                </div>
                <Divider />

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "0.5em",
                    margin: "1em",
                  }}
                >
                  <Button
                    variant="contained"
                    size="small"
                    onClick={handleOpenPromoDialog}
                  >
                    Apply Promo / Discount
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={handleOpenDialog}
                    disabled={OrderType === "Take-out"}
                  >
                    Select Table
                  </Button>
                  <Button
                    variant="contained"
                    color="success"
                    size="small"
                    onClick={() => {
                      handleSubmitOrder();
                      handleConfirmTables();
                    }}
                  >
                    Submit Order
                  </Button>
                </Box>
              </Box>
            </Box>
          </>
        ) : (
          <>
            <Box sx={{ textAlign: "center", pt: 3 }}>
              <Button
                variant="outlined"
                onClick={() => toggleReceiptDrawer(true)}
                color="success"
              >
                Show Order Receipt
              </Button>
            </Box>

            <Drawer
              container={
                window !== undefined ? () => window.document.body : undefined
              }
              anchor="left"
              open={isReceiptOpen}
              onClose={() => toggleReceiptDrawer(false)}
              ModalProps={{
                keepMounted: true,
              }}
            >
              <IconButton
                sx={{ position: "absolute", top: 5, right: 5, zIndex: 1 }}
                onClick={() => toggleReceiptDrawer(false)}
              >
                <ChevronLeftIcon />
              </IconButton>
              <Receipt
                OrderType={OrderType}
                OrderNo={OrderNo}
                addedDishes={addedDishes}
                setAddedDishes={setAddedDishes}
                menuData={menuData}
                menuPromo={menuPromo}
              />
            </Drawer>
          </>
        )}

        <Box flex="1" margin="3em" marginLeft={{ xs: 0, md: "24vw" }}>
          <Box>
            <Toolbar
              sx={{
                display: "flex",
                width: "100%",
                justifyContent: "space-between",
                alignItems: { xs: "flex-start", md: "center" },
                flexWrap: "wrap",
                flexDirection: { xs: "column", sm: "row", lg: "row" },
              }}
            >
              <FlexBetween>
                <Button
                  variant="contained"
                  sx={{
                    background: theme.palette.secondary[600],
                    fontSize: "1.2em",
                    color: theme.palette.primary[100],
                  }}
                  onClick={handleCancelOrder}
                >
                  Cancel Order
                </Button>
              </FlexBetween>

              <FlexBetween
                sx={{
                  gap: "1em",
                  marginTop: { xs: "2em", sm: "0", lg: "0" },
                  flexWrap: { xs: "wrap", sm: "wrap", lg: "nowrap" },
                  whiteSpace: "nowrap",
                }}
              >
                {/* Sorting Category Select */}
                <Box>
                  <FormControl color="secondary">
                    <InputLabel
                      id="category-label"
                      sx={{ color: theme.palette.primary[200] }}
                    >
                      Category
                    </InputLabel>
                    <Select
                      label="Category"
                      value={selectedCategory}
                      onChange={handleCategoryChange}
                      sx={{
                        width: "180px",
                        border: theme.palette.secondary[300],
                        color: theme.palette.primary[200],
                      }}
                    >
                      <MenuItem value="All">All</MenuItem>
                      {category.map((cat) => (
                        <MenuItem key={cat.id} value={cat.categoryName}>
                          {cat.categoryName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                <Container sx={{ padding: "0 !important" }}>
                  <FlexBetween
                    backgroundColor={theme.palette.secondary[700]}
                    borderRadius="9px"
                    gap="3rem"
                    minWidth="300px"
                    width="100%"
                    p="0.5rem 1.5rem"
                  >
                    <InputBase
                      placeholder="Search Menu Item..."
                      value={searchValue}
                      onChange={handleSearchChange}
                    />
                    <Search />
                  </FlexBetween>
                </Container>
              </FlexBetween>
            </Toolbar>
          </Box>

          {isLoading || !menuData.length ? (
            <Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  flexWrap: "wrap",
                  gap: "1em",
                  margin: "1.5em",
                }}
              >
                {[...Array(16).keys()].map((index) => (
                  <Card
                    key={index}
                    sx={{
                      width: 280,
                      height: 320,
                      background: theme.palette.primary[400],
                      borderRadius: "15px",
                    }}
                  >
                    <Skeleton
                      sx={{ height: 180 }}
                      animation="wave"
                      variant="rectangular"
                    />
                    <CardContent>
                      <FlexBetween>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.2em",
                            width: "100%",
                          }}
                        >
                          <Skeleton
                            animation="wave"
                            variant="text"
                            height={30}
                            width="80%"
                          />
                          <Skeleton
                            animation="wave"
                            variant="text"
                            height={30}
                            width="50%"
                          />
                        </div>
                      </FlexBetween>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                flexWrap: "wrap",
                gap: "1em",
                margin: "1.5em",
              }}
            >
              {filteredMenuData.map((menu, index) => (
                <ItemCard
                  key={index}
                  img={menu.picturePath}
                  menuName={menu.menuItem}
                  price={menu.price}
                  salesTarget={menu.salesTarget}
                  menuId={menu._id}
                  category={menu.category}
                  onAddDish={handleAddDish}
                />
              ))}
            </Box>
          )}
        </Box>
      </Box>

      <Dialog open={isDialogOpen}>
        <DialogTitle
          sx={{
            background: theme.palette.primary[800],
            borderBottom: "solid black 1px",
          }}
        >
          <FlexBetween>
            <Typography>Select Tables (Maximum Tables: 2)</Typography>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "0.3em",
              }}
            >
              <div
                style={{
                  width: "15px",
                  height: "15px",
                  border: "#B03021 solid 2px",
                  borderRadius: "2px",
                }}
              ></div>
              <Typography> Occupied</Typography>
            </div>
          </FlexBetween>
        </DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column" }}>
          <div>
            {tables.map((table, index) => (
              <FormControlLabel
                key={index}
                control={
                  <Checkbox
                    checked={selectedTables.includes(table.tableNo)}
                    onChange={() => handleCheckboxChange(table.tableNo)}
                    color={
                      table.status === "Occupied" ? "default" : "secondary"
                    }
                    disabled={table.status === "Occupied"}
                    sx={{
                      color:
                        table.status === "Occupied" ? "#B03021" : undefined,
                    }}
                  />
                }
                label={`Table ${table.tableNo} (Pax: ${table.pax})`}
              />
            ))}
          </div>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="error" onClick={handleCloseDialog}>
            Cancel
          </Button>
          <Button variant="contained" color="success" onClick={handleConfirm}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={isPromoDialogOpen}
        sx={{ "& .MuiPaper-root": { background: theme.palette.grey[400] } }}
        fullWidth
      >
        <DialogTitle sx={{ color: "#000" }}>
          <FlexBetween>
            <div>Apply Promo/Discount</div>
            <div style={{ display: "flex", gap: "1em" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.2em",
                }}
              >
                <CircleIcon sx={{ color: "#BFF9FF" }} />
                <Typography> Discount</Typography>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.2em",
                }}
              >
                <CircleIcon sx={{ color: "#93DD9A" }} />
                <Typography> Promo</Typography>
              </div>
            </div>
          </FlexBetween>
        </DialogTitle>
        <DialogContent>
          <FormControl>
            <Box marginBottom="2em">
              <Typography color="#000"> Applicable Promo/Discount</Typography>
              {menuPromo.map(
                (promo) =>
                  (addedDishes.some(
                    (dish) =>
                      promo.applicability.includes(dish.menuName) ||
                      promo.applicability.includes(dish.category)
                  ) ||
                    promo.applicability === "All Menu") && (
                    <Chip
                      key={promo.id}
                      label={
                        <Typography variant="caption" sx={{ color: "#000" }}>
                          {promo.promoType === "Fixed" ? (
                            <>
                              Starts at Php {promo.promoValue} <br /> Promo:{" "}
                              {promo.promoName}
                            </>
                          ) : (
                            <>
                              {promo.promoValue}% off Discount:{" "}
                              {promo.promoName}
                            </>
                          )}
                        </Typography>
                      }
                      clickable
                      onClick={() => {
                        if (promo.promoStatus !== "Expired") {
                          handleAddSelectedPromo(promo);
                        }
                      }}
                      color={
                        promo.promoStatus === "Expired" ? "error" : "primary"
                      }
                      sx={{
                        margin: "0.5em",
                        padding: "1.5em 0.2em",
                        border: "1px #9D9D9D solid",
                        background:
                          promo.promoStatus === "Expired"
                            ? "#F5786A"
                            : promo.promoType === "Percentage"
                            ? "#BFF9FF"
                            : "#93DD9A",
                        cursor:
                          promo.promoStatus === "Expired"
                            ? "not-allowed"
                            : "pointer",
                        opacity: promo.promoStatus === "Expired" ? 0.5 : 1,
                      }}
                    />
                  )
              )}
            </Box>
            <Box>
              <Typography color="#000"> Selected Promo/Discount</Typography>
              {selectedPromos.map((selectedPromo) => (
                <Chip
                  key={selectedPromo.id}
                  label={selectedPromo.promoName}
                  onDelete={() => handleRemoveSelectedPromo(selectedPromo)}
                  color="success"
                  sx={{ margin: "0.5em" }}
                />
              ))}
            </Box>
          </FormControl>
          <FormControl fullWidth></FormControl>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            color="error"
            onClick={handleCancelPromoDialog}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={handleApplyPromo}
            disabled={savedPromos === true}
          >
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default OrderMenu;
