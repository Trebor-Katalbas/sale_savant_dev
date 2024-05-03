import { Search } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  InputBase,
  List,
  ListItem,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { FlexBetween } from "components";
import React, { useEffect, useState } from "react";
import CircleIcon from "@mui/icons-material/Circle";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import { baseUrl } from "state/api";

const Kitchen = () => {
  const theme = useTheme();
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const [receipt, setReceipt] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  const handleCloseDialog = () => setOpenDialog(false);
  const handleOpenDialog = (orderId) => {
    setOpenDialog(true);
    setOrderId(orderId);
  };

  const fetchReceiptData = async () => {
    try {
      const response = await fetch(`${baseUrl}cashier/get-receipt`);
      if (response.ok) {
        const data = await response.json();
        setReceipt(data.reverse());
      } else {
        console.error("Failed to fetch receipt data:", response.statusText);
      }
    } catch (error) {
      console.error("An error occurred during the fetch:", error);
    }
  };

  useEffect(() => {
    fetchReceiptData();
  }, []);

  const handleConfirmServed = async () => {
    try {
      const response = await fetch(
        `${baseUrl}cashier/update-kitchen-status/${orderId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ kitchenStatus: "Served" }),
        }
      );
      if (response.ok) {
        handleCloseDialog();
        setSuccessModalOpen(true);
        setTimeout(() => {
          setSuccessModalOpen(false);
          fetchReceiptData();
        }, 1500);
      } else {
        console.error("Failed to update receipt status:", response.statusText);
      }
    } catch (error) {
      console.error("An error occurred while updating receipt status:", error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredReceipt = receipt.filter(
    (item) =>
      item.tableNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.orderNo.toString().includes(searchTerm)
  );

  return (
    <Box
      display={isNonMobile ? "flex" : "block"}
      flexDirection="column"
      height="100%"
      width="100%"
    >
      <Box
        display="flex"
        justifyContent="space-between"
        flexDirection={{ xs: "column", sm: "column", md: "row" }}
        alignItems="center"
        margin="2em"
        gap="1em"
      >
        <Typography variant="h2" fontWeight={700}>
          Customer Order{" "}
        </Typography>

        <Box
          display="flex"
          alignItems="center"
          gap="1em"
          flexDirection={{ xs: "column", sm: "column", md: "row" }}
        >
          <Container>
            <FlexBetween
              backgroundColor={theme.palette.secondary[700]}
              borderRadius="20px"
              gap="1rem"
              minWidth="300px"
              p="0.3rem 1.5rem"
            >
              <InputBase
                placeholder="Search Name..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <Search />
            </FlexBetween>
          </Container>

          <Box
            sx={{
              border: "black 1px solid",
              borderRadius: "5px",
              display: "flex",
              gap: "2em",
              padding: " 0.5em 1em",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.2em",
              }}
            >
              <CircleIcon sx={{ color: "#FF5A5A", fontSize: "2em" }} />
              <Typography variant="h3"> Pending</Typography>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.2em",
              }}
            >
              <CircleIcon sx={{ color: "#1CDE75", fontSize: "2em" }} />
              <Typography variant="h3"> Served</Typography>
            </div>
          </Box>
        </Box>
      </Box>

      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        height="100%"
        margin="0.5em 2em"
      >
        <Grid container spacing={2}>
          {/* Display items with 'Pending' status first */}
          {filteredReceipt
            .filter((item) => item.kitchenStatus === "Pending")
            .map((item) => (
              <Grid item xs={12} md={6} lg={4} key={item._id}>
                <Card style={{ marginBottom: "1rem", height: "100%", background: theme.palette.grey[700] }}>
                  <CardContent sx={{color: theme.palette.grey[100]}}>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      width="100%"
                      marginBottom="1em"
                    >
                      <Typography variant="h4">
                        {item.tableNo === "Take-out"
                          ? item.tableNo
                          : "Table No. " + item.tableNo}
                      </Typography>
                      <Typography variant="h4">
                        Order No: {item.orderNo}
                      </Typography>
                    </Box>
                    <Divider />
                    <List>
                      {item.items.map((menuItem) => (
                        <ListItem key={menuItem.menuItemId}>
                          <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between"
                            width="100%"
                            borderBottom="dashed 1px"
                            borderColor={theme.palette.grey[100]}
                          >
                            <Typography variant="h5">
                              {menuItem.menuItem}
                            </Typography>
                            <Typography variant="h5">
                              {menuItem.quantity}
                            </Typography>
                          </Box>
                        </ListItem>
                      ))}
                    </List>
                    <Divider />
                  </CardContent>
                  <CardActions
                    sx={{
                      padding: "0 1em !important",
                      justifyContent: "space-between",
                    }}
                  >
                    {item.kitchenStatus === "Pending" ? (
                      <Button
                        size="small"
                        variant="contained"
                        color="success"
                        onClick={() => handleOpenDialog(item._id)}
                      >
                        Mark as Served
                      </Button>
                    ) : (
                      <Box></Box>
                    )}
                    <CircleIcon
                      sx={{
                        color:
                          item.kitchenStatus === "Pending"
                            ? "#FF5A5A"
                            : "#1CDE75",
                        fontSize: "2.5em",
                      }}
                    />
                  </CardActions>
                </Card>
              </Grid>
            ))}
          {/* Then, display items with statuses other than 'Pending' */}
          {filteredReceipt
            .filter((item) => item.kitchenStatus !== "Pending")
            .map((item) => (
              <Grid item xs={12} md={6} lg={4} key={item._id}>
                <Card style={{ marginBottom: "1rem", height: "100%", background: theme.palette.grey[700] }}>
                  <CardContent sx={{color: theme.palette.grey[100]}}>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      width="100%"
                      marginBottom="1em"
                    >
                      <Typography variant="h4">
                        {item.tableNo === "Take-out"
                          ? item.tableNo
                          : "Table No. " + item.tableNo}
                      </Typography>
                      <Typography variant="h4">
                        Order No: {item.orderNo}
                      </Typography>
                    </Box>
                    <Divider />
                    <List>
                      {item.items.map((menuItem) => (
                        <ListItem key={menuItem.menuItemId}>
                          <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between"
                            width="100%"
                            borderBottom="dashed 1px"
                            borderColor={theme.palette.grey[100]}
                          >
                            <Typography variant="h5">
                              {menuItem.menuItem}
                            </Typography>
                            <Typography variant="h5">
                              {menuItem.quantity}
                            </Typography>
                          </Box>
                        </ListItem>
                      ))}
                    </List>
                    <Divider />
                  </CardContent>
                  <CardActions
                    sx={{
                      margin: "0 1em !important",
                      justifyContent: "space-between",
                    }}
                  >
                    {item.kitchenStatus === "Pending" ? (
                      <Button
                        size="small"
                        variant="contained"
                        color="success"
                        onClick={() => handleOpenDialog(item._id)}
                      >
                        Mark as Served
                      </Button>
                    ) : (
                      <Box></Box>
                    )}
                    <CircleIcon
                      sx={{
                        color:
                          item.kitchenStatus === "Pending"
                            ? "#FF5A5A"
                            : "#1CDE75",
                        fontSize: "2.5em",
                      }}
                    />
                  </CardActions>
                </Card>
              </Grid>
            ))}
        </Grid>
      </Box>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to mark this order as served?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} variant="outlined" color="error">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmServed}
            variant="contained"
            color="success"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

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
            color: "green",
            border: "solid 1px green",
            zIndex:"999",
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
    </Box>
  );
};

export default Kitchen;
