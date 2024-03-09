import React, { useEffect, useState } from "react";
import { FlexBetween, Header } from "components";
import {
  Box,
  Container,
  InputBase,
  Toolbar,
  Button,
} from "@mui/material";
import { useTheme } from "@emotion/react";
import { Search } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import DescriptionIcon from '@mui/icons-material/Description';

const DiscountsPromos = () => {
  const theme = useTheme();
  const [account, setAccount] = useState([]);
  const [filteredAccount, setFilteredAccount] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchAccounts = async () => {
    try {
      const response = await fetch("");
      if (response.ok) {
        const data = await response.json();
        const accountWithId = data.map((item, index) => ({
          ...item,
          id: index + 1,
        }));
        setAccount(accountWithId);
      } else {
        console.error("Failed to fetch account:", response.statusText);
      }
    } catch (error) {
      console.error("An error occurred during the fetch:", error);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  useEffect(() => {
    const filtered = account.filter(
      (acc) =>
        acc.role === "Manager" &&
        acc.userName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredAccount(filtered);
  }, [account, searchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  /* aj */

  const columns = [
    { field: "_id", headerName: "Name", width: 250 },
    { field: "userName", headerName: "ID No.", width: 200 },
    { field: "role", headerName: "Discount Applied", width: 300 },
    { field: "createdAt", headerName: "Discount %", width: 200 },
    { field: "userNumber", headerName: "Amount Discounted", width: 200 },
  ];

  return (
    <>
    
      <Box>
        <Header title={"Discount and Promos"} disp={"none"} />
      </Box>

      <Box display="flex" flexDirection="column" width="100%" maxWidth="70vw">
        <Box>
          <Toolbar sx={{ justifyContent: "flex-end", flexWrap: "wrap" }}>
            <FlexBetween
              sx={{
                flexDirection: {
                  xs: "column-reverse",
                  lg: "row",
                },
              }}
            >
              <Button variant="contained" startIcon={<DescriptionIcon color="success"/>} sx={{ fontSize: "1em" }}>
                Export to Excel
              </Button>
            </FlexBetween>
          </Toolbar>
        </Box>

        <Box
          m="1.5rem 2.5rem"
          height="47vh"
          width="100%"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: theme.palette.secondary[700],
            "& .MuiDataGrid-root": {
              border: "none",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "none",
            },
            "& .MuiDataGrid-columnHeaders": {
              color: "black",
            },
            "& .MuiDataGrid-virtualScroller": {
              color: "black",
            },
            "& .MuiDataGrid-footerContainer": {
              color: "black",
            },
            "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
              color: `${theme.palette.grey[200]} !important`,
            },
          }}
        >
          <DataGrid
            rows={filteredAccount}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                },
              },
            }}
            pageSizeOptions={[10]}
            disableRowSelectionOnClick
          />
        </Box>
      </Box>

      {/* aj */}
    </>
  );
};

export default DiscountsPromos;
