import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Skeleton,
} from "@mui/material";
import { FlexBetween } from "components";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "state/api";

const CustomCardComponent = ({ img, menuName, price, salesTarget, menuId }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isAvailable = salesTarget !== 0 && salesTarget !== "0";
  const [openDialog, setOpenDialog] = useState(false);
  // eslint-disable-next-line
  const [menuData, setMenuData] = useState([]);
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    const imageElement = new Image();
    imageElement.src = `${baseUrl}assets/${img}`;
    imageElement.onload = () => setImageLoading(false);
    imageElement.onerror = () => setImageLoading(false);
  }, [img]);

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

  useEffect(() => {
    fetchMenuData();
  }, []);

  const handleConfirmRemove = () => {
    fetch(`${baseUrl}menumanagement/menu/${menuId}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        fetchMenuData();
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error deleting menu:", error);
      })
      .finally(() => {
        setOpenDialog(false);
      });
  };

  const handleEditClick = () =>{
    navigate(`/edit menu/${menuId}`);
  };

  const handleRemoveClick = () => {
    setOpenDialog(true);
  };

  const handleCancelRemove = () => {
    setOpenDialog(false);
  };

  return (
    <Card variant="outlined" sx={{ width: 280, position: "relative", background:theme.palette.primary[400], color:theme.palette.grey[900] }}>
      {!isAvailable && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
            zIndex: "1",
          }}
        >
          <Typography
            variant="h3"
            sx={{
              background: "#FF1B00",
              padding: "0.2em 0.5em",
              marginTop: "2em",
              borderRadius: "5px",
            }}
          >
            Not Available
          </Typography>
        </div>
      )}
      {imageLoading ? (
        <Skeleton animation="wave" variant="rectangular" width={280} height={180} />
      ) : (
        <CardMedia
          component="img"
          sx={{ height: 180 }}
          alt={menuName}
          src={`${baseUrl}assets/${img}`}
          loading="lazy"
        />
      )}
      <CardContent>
        <FlexBetween>
          <div style={{ display: "flex", flexDirection: "column", gap: "1em" }}>
            <Typography variant="h6">{menuName}</Typography>
            <Typography variant="subtitle1">{`Php ${price}`}</Typography>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1em", zIndex: "2" }}>
              <Button
                variant="contained"
                sx={{background:'#fff', '&:hover': {background:theme.palette.primary[600]}}}
                onClick={handleEditClick}
              >
                Edit
              </Button>
            <div style={{ zIndex: "2", position: "relative" }}>
              <Button
                variant="contained"
                color="error"
                onClick={handleRemoveClick}
              >
                Remove
              </Button>
            </div>
          </div>
        </FlexBetween>
      </CardContent>

      <Dialog open={openDialog} onClose={handleCancelRemove}>
        <DialogTitle>Confirm Removal</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to remove this menu?
          </DialogContentText>
          <DialogContentText sx={{color:theme.palette.secondary[400], marginTop:'1em'}}>
            (This action will also delete associated inventory, dish loss, and promo items.)
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelRemove} sx={{ color: "#000" }}>
            Cancel
          </Button>

          <Button onClick={handleConfirmRemove} sx={{ color: "#26B02B" }}>
            Remove
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default CustomCardComponent;
