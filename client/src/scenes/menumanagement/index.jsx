import React, { useState, useEffect } from "react";
import { Card as ItemCard, FlexBetween, Header } from "components";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Skeleton,
  Toolbar,
  Typography,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Link } from "react-router-dom";
import { useTheme } from "@emotion/react";
import { baseUrl } from "state/api";

const MenuManagement = () => {
  const theme = useTheme();
  const [menuData, setMenuData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const response = await fetch(
          `${baseUrl}menumanagement/menu`
        );
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
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const filteredMenuData =
    selectedCategory === "All"
      ? menuData
      : menuData.filter((menu) => menu.category === selectedCategory);

  return (
    <>
      <Box>
        <Header title={"Menu Management"} disp={"none"} />
      </Box>

      <Box>
        <Toolbar
          sx={{
            justifyContent: "space-between",
            flexWrap: "wrap",
            flexDirection: { xs: "column-reverse", sm: "row", lg: "row" },
          }}
        >
          <FlexBetween
            sx={{
              gap: "1em",
              marginTop: { xs: "2em", sm: "0", lg: "0" },
              marginBottom: { xs: "0", sm: "2em", lg: "0" },
              flexWrap: { xs: "wrap", sm: "wrap", lg: "nowrap" },
              whiteSpace: "nowrap",
            }}
          >
            <Link
              style={{
                textDecoration: "none",
                color: theme.palette.primary[100],
              }}
              to="/add menu"
            >
              <Container
                sx={{
                  display: "flex",
                  gap: "0.5em",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "0",
                }}
              >
                <AddCircleIcon sx={{ color: "#35D03B", fontSize: "3em" }} />
                <Typography sx={{ fontSize: "1.5em" }}>Add Menu</Typography>
              </Container>
            </Link>

            {/* Sorting Category Select */}
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
                <MenuItem value="Main Dish">Main Dish</MenuItem>
                <MenuItem value="Tausug Dish">Tausug Dish</MenuItem>
                <MenuItem value="Dessert">Dessert</MenuItem>
                <MenuItem value="Tausug Dessert">Tausug Dessert</MenuItem>
                <MenuItem value="Drinks">Drinks</MenuItem>
              </Select>
            </FormControl>
          </FlexBetween>

          <Box
            sx={{
              display: "flex",
              gap: "1em",
              flexDirection: { xs: "column", sm: "row", lg: "row" },
              justifyContent: "flex-start",
              whiteSpace: "nowrap",
              width: { xs: "100%", sm: "inherit", lg: "inherit" },
            }}
            gap="1em"
          >
            <Link to="/menu inventory">
              <Button
                variant="contained"
                sx={{
                  background: theme.palette.primary[400],
                  fontSize: "1.2em",
                }}
              >
                Menu Inventory
              </Button>
            </Link>

            <Link to="/menu loss">
              <Button
                variant="contained"
                sx={{
                  background: theme.palette.primary[400],
                  fontSize: "1.2em",
                }}
              >
                Menu Loss
              </Button>
            </Link>

            <Link to="/menu promos">
              <Button
                variant="contained"
                sx={{
                  background: theme.palette.primary[400],
                  fontSize: "1.2em",
                }}
              >
                Promos & Discounts
              </Button>
            </Link>
          </Box>
        </Toolbar>
      </Box>
      {isLoading || !menuData.length ? (
        <Box>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: "1em",
              margin: "1.5em",
            }}
          >
            {[...Array(15).keys()].map((index) => (
              <Card key={index} sx={{ width: 280, background: theme.palette.primary[400] }}>
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
                        gap: "1em",
                        width: "100%",
                      }}
                    >
                      <Skeleton
                        animation="wave"
                        variant="text"
                        height={40}
                        width="80%"
                      />
                      <Skeleton
                        animation="wave"
                        variant="text"
                        height={40}
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
            justifyContent:{xs:"center", sm:"center", md:"normal", lg:"normal", xl:"normal"},
            flexWrap: "wrap",
            gap: "1em",
            margin: "1.5em",
          }}
        >
          {filteredMenuData.map((menu) => (
            <ItemCard
              key={menu._id}
              img={menu.picturePath}
              menuName={menu.menuItem}
              price={menu.price}
              salesTarget={menu.salesTarget}
              menuId={menu._id}
            />
          ))}
        </Box>
      )}
    </>
  );
};

export default MenuManagement;
