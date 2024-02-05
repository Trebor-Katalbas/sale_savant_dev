import React, { useState, useEffect } from "react";
import { Card, FlexBetween, Header } from "components";
import { Box, Button, Container, Toolbar, Typography } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Link } from "react-router-dom";
import { useTheme } from "@emotion/react";

const MenuManagement = () => {
  const theme = useTheme();
  const [menuData, setMenuData] = useState([]);

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const response = await fetch(
          "http://localhost:3001/menumanagement/menu"
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

  return (
    <>
      <Box>
        <Header title={"Menu Management"} disp={"none"}/>
      </Box>

      <Box>
        <Toolbar sx={{ justifyContent: "space-between", flexWrap: "wrap" }}>
          <FlexBetween>
            <Link
              style={{
                textDecoration: "none",
                color: theme.palette.primary[100],
                marginBottom:'1em',
              }}
              to="/add menu"
            >
              <Container
                sx={{
                  display: "flex",
                  gap: "0.5em",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <AddCircleIcon sx={{ color: "#35D03B", fontSize: "3em" }} />
                <Typography sx={{ fontSize: "1.5em" }}>Add Menu</Typography>
              </Container>
            </Link>
          </FlexBetween>

          <FlexBetween sx={{ gap: "1em" }}>
            <Link to="/menu inventory">
              <Button
                variant="contained"
                sx={{ background: theme.palette.primary[400], fontSize:'1.2em' }}
              >
                Menu Inventory
              </Button>
            </Link>

            <Link to="/menu loss">
              <Button
                variant="contained"
                sx={{ background: theme.palette.primary[400], fontSize:'1.2em' }}
              >
                Menu Loss
              </Button>
            </Link>

            <Link to="/menu loss">
              <Button
                variant="contained"
                sx={{ background: theme.palette.primary[400], fontSize:'1.2em' }}
              >
                Promos
              </Button>
            </Link>
          </FlexBetween>
        </Toolbar>
      </Box>

      <Box
        sx={{ display: "flex", flexWrap: "wrap", gap: "1em", margin: "1.5em" }}
      >
        {menuData.map((menu) => (
          <Card
            key={menu._id}
            img={menu.picturePath}
            menuName={menu.menuItem}
            price={menu.price}
            salesTarget={menu.salesTarget}
            menuId={menu._id}
          />
        ))}
      </Box>

      <Box></Box>
    </>
  );
};

export default MenuManagement;
