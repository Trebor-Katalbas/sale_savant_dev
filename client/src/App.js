import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { themeSettings } from "theme";
import * as scenes from "./scenes/index";
import * as pages from "./pages/index";

function App() {
  const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const isAuth = Boolean(useSelector((state) => state.global.token));

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path="/" element={<pages.Login />} />

            {/* Admin Routes */}
            <Route element={isAuth ? <scenes.Layout /> : <Navigate to="/" />}>
              <Route path="/home" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<scenes.Dashboard />} />

              {/* Menu Management Routes */}
              <Route path="/menu management" element={isAuth ? <scenes.MenuManagement /> : <Navigate to="/" />} />
              <Route path="/menu inventory" element={<scenes.MenuInventory/>} />
              <Route path="/menu loss" element={<scenes.MenuLoss/>} />
              <Route path="/menu promos" element={<scenes.MenuPromos/>} />
              {/* Modules */}
              <Route path="/add inventory" element={<scenes.AddInventory />} />
              <Route path="/add menu" element={<scenes.AddMenu />} />
              <Route path="/add loss" element={<scenes.AddLoss/>} />
              <Route path="/add promo" element={<scenes.AddPromo/>} />
              <Route path="/add category" element={<scenes.AddCategory />} />
              <Route path={`/edit menu/:id`} element={<scenes.EditMenu />} />
              <Route path={`/edit inventory/:id`} element={<scenes.EditInventory />} />
              <Route path={`/edit loss/:id`} element={<scenes.EditMenuLoss/>} />

              {/* Supply and Purchase Management */}
              <Route path="/supply and purchase management/supply-records" element={<scenes.SupplyRecords />} />
              <Route path="/supply and purchase management/supplier-management" element={<scenes.SupplierManagement />} />
              {/* Modules */}
              <Route path="/add supply-record" element={<scenes.AddSupplyRecord />} />
              <Route path="/add supplier" element={<scenes.AddSupplier />} />
              <Route path={`/edit supplier/:id`} element={<scenes.EditSupplier />} />

              {/* Sales Management */}
              <Route path="/sales management" element={<scenes.SalesManagement />} />
              <Route path="/sales management/order-sales" element={<scenes.OrderSales />} />
              <Route path="/sales management/expenses" element={<scenes.Expenses />} />
              <Route path="/sales management/refund-records" element={<scenes.RefundRecords />} />
              {/* Modules */}
              <Route path={`/add eod`}element={<scenes.AddEOD />} />

              {/* Account Management Routes */}
              <Route path="/account management" element={<scenes.AccountManagement/>} />
              <Route path="/void" element={<scenes.Void/>}/>
              <Route path="/manager accounts" element={<scenes.ManagerAcc/>} />
              <Route path="/cashier accounts" element={<scenes.CashierAcc/>} />
              <Route path="/add account" element={<scenes.AddAccount/>} />
              <Route path={`/edit account/:id`} element={<scenes.EditAccount/>} />
              <Route path={`/change password/:id`} element={<scenes.ChangePassword/>} />
              <Route path={`/edit void/:id`} element={<scenes.EditVoid />} />

              {/* Reports Routes */}
              <Route path="/reports/sales-report" element={<scenes.RepSales />} />
              <Route path="/reports/purchase-history" element={<scenes.CustomPurchHistory />} />
              <Route path="/reports/promos-report" element={<scenes.DiscountsPromos/>} />
              <Route path="/reports/deliveries-report" element={<scenes.SalesDeliveries/>} />
            </Route>

            {/* Cashier Routes */}
            <Route element={isAuth ? <pages.CashierLayout/> : <Navigate to="/" />}>
              <Route path="/home-cashier" element={<pages.TakeOrder/>}/>
              <Route path="/take-order" element={<Navigate to="/home-cashier" />}/>

              {/* Customer Order */}
              <Route path="/order-ticket" element={<pages.OrderMenu/>} />
              <Route path={`/order-placed/:OrderNo`} element={<pages.NewOrder />} />
              <Route path="/modify-table" element={<pages.ModifyTable/>}/>

              {/* Checkout Order */}
              <Route path="/checkout-list" element={<pages.CheckoutList />} />
              <Route path={`/checkout-order/:id`} element={<pages.ReceiptSummary />} />

              {/* Refunds */}
              <Route path="/refunds" element={<pages.Refunds />} />

              {/* Reports */}
              <Route path="/cashier-reports" element={<pages.CashierReports />}/>
              <Route path="/add-startcash" element={<pages.AddStartCash /> } />
              
            </Route>
            
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
