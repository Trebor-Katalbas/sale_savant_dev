import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  useTheme,
  Dialog,
  DialogContent,
  DialogActions,
  Skeleton,
  Stack,
  IconButton,
  Divider,
} from "@mui/material";
import { FlexBetween } from "components";
import { Add, Remove } from "@mui/icons-material";
import { baseUrl } from "state/api";

const OrderCard = ({
  img,
  menuName,
  price,
  salesTarget,
  menuId,
  category,
  onAddDish,
}) => {
  const theme = useTheme();
  const isAvailable = salesTarget !== 0 && salesTarget !== "0";
  // eslint-disable-next-line
  const [menuData, setMenuData] = useState([]);
  const [imageLoading, setImageLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [menuPromo, setMenuPromo] = useState([]);

  const currentDate = new Date();
  const total = quantity * price;

  const handleAddDish = () => {
    const dish = {
      img,
      menuName,
      price,
      quantity,
      total,
      category,
      menuId,
    };
    onAddDish(dish);
    setIsModalOpen(false);
  };

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

  const specificPromo = menuPromo.find((promo) => {
    return (
      (promo.applicability === category || promo.applicability === menuName) &&
      new Date(promo.validDate) >= currentDate
    );
  });

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

  const handleCardClick = () => {
    if (isAvailable) {
      setIsModalOpen(true);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleAddQuantity = () => {
    if (salesTarget !== quantity) {
      setQuantity(quantity + 1);
    }
  };

  const handleRemoveQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <>
      <Card
        variant="outlined"
        sx={{
          width: 280,
          height: 320,
          position: "relative",
          background: theme.palette.primary[400],
          color: theme.palette.grey[900],
          cursor: isAvailable ? "pointer" : "not-allowed",
          borderRadius: "15px",
        }}
        onClick={handleCardClick}
      >
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
          <Skeleton
            animation="wave"
            variant="rectangular"
            width={280}
            height={180}
          />
        ) : (
          <CardMedia
            component="img"
            sx={{ height: 210 }}
            alt={menuName}
            src={`${baseUrl}assets/${img}`}
            loading="lazy"
          />
        )}
        <CardContent>
          <div style={{ display: "flex", marginBottom: "1em" }}>
            <Typography variant="h5">{menuName}</Typography>
          </div>
          <FlexBetween>
            <div>
              <Typography variant="subtitle1">{`Php ${price}`}</Typography>
            </div>
            {specificPromo && (
              <div>
                {specificPromo.promoType === "Fixed" ? (
                  <>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        background: "#5EFF6E",
                        padding: "0.5em",
                        borderRadius: "5px",
                      }}
                    >
                      Promo: Php {specificPromo.promoValue} only
                    </Typography>
                  </>
                ) : (
                  <>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        background: "#5EFF6E",
                        padding: "0.5em",
                        borderRadius: "5px",
                      }}
                    >
                      Promo: -{specificPromo.promoValue}%
                    </Typography>
                  </>
                )}
              </div>
            )}
          </FlexBetween>
        </CardContent>
      </Card>

      {/* Modal */}
      <Dialog open={isModalOpen} onClose={handleModalClose}>
        <DialogContent
          sx={{
            padding: "0 !important",
            background: theme.palette.primary[800],
          }}
        >
          <Stack direction="column" spacing={2}>
            <CardMedia
              component="img"
              sx={{ width: 270, height: 180 }}
              alt={menuName}
              src={`${baseUrl}assets/${img}`}
              loading="lazy"
            />
            <div
              style={{
                padding: "0 1em",
                display: "flex",
                flexDirection: "column",
                gap: "1em",
              }}
            >
              <Typography variant="h5" fontWeight="bold">
                {menuName}
              </Typography>
              <Typography variant="subtitle1">{`Php ${price}`}</Typography>

              <FlexBetween>
                <div
                  style={{
                    border: "1px solid black",
                    padding: "0.2em 0.8em",
                    borderRadius: "8px",
                    whiteSpace: "nowrap",
                  }}
                >
                  Available:{" "}
                  <span style={{ fontWeight: "700", color: "#218951" }}>
                    {salesTarget}
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1em",
                  }}
                >
                  <IconButton
                    sx={{
                      background: theme.palette.secondary[700],
                      fontSize: "0.8em",
                      "&:hover": {
                        background: theme.palette.secondary[500],
                      },
                    }}
                    onClick={handleRemoveQuantity}
                  >
                    <Remove fontSize="0.8em" />
                  </IconButton>
                  <Typography>{quantity}</Typography>
                  <IconButton
                    sx={{
                      background: theme.palette.secondary[700],
                      fontSize: "0.8em",
                      "&:hover": {
                        background: theme.palette.secondary[500],
                      },
                    }}
                    onClick={handleAddQuantity}
                  >
                    <Add fontSize="0.8em" />
                  </IconButton>
                </div>
              </FlexBetween>
              <Divider />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  paddingBottom: "1em",
                }}
              >
                <Typography variant="subtitle1">Total</Typography>
                <Typography variant="subtitle1">{`Php ${total}`}</Typography>
              </div>
            </div>
          </Stack>
        </DialogContent>
        <DialogActions
          sx={{ padding: "1em", background: theme.palette.primary[500] }}
        >
          <Button variant="contained" onClick={handleModalClose}>
            Cancel
          </Button>
          <Button variant="contained" color="success" onClick={handleAddDish}>
            Add Dish
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default OrderCard;
