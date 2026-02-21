import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import { AdminLayout } from "../layouts/AdminLayout";
import { HomePage } from "../pages/HomePage";
import { SearchResultsPage } from "../pages/SearchResultsPage";
import { MapPage } from "../pages/MapPage";
import { BranchDetailsPage } from "../pages/BranchDetailsPage";
import { BranchLocatorPage } from "../pages/BranchLocatorPage";
import { LoginPage } from "../pages/admin/LoginPage";
import { DashboardPage } from "../pages/admin/DashboardPage";
import { PharmaciesPage } from "../pages/admin/PharmaciesPage";
import { BranchesPage } from "../pages/admin/BranchesPage";
import { MedicinesPage } from "../pages/admin/MedicinesPage";
import { InventoryPage } from "../pages/admin/InventoryPage";

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/search", element: <SearchResultsPage /> },
      { path: "/map", element: <MapPage /> },
      { path: "/branches", element: <BranchLocatorPage /> },
      { path: "/branch/:id", element: <BranchDetailsPage /> },
    ],
  },
  {
    path: "/admin/login",
    element: <LoginPage />,
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "pharmacies", element: <PharmaciesPage /> },
      { path: "branches", element: <BranchesPage /> },
      { path: "medicines", element: <MedicinesPage /> },
      { path: "inventory", element: <InventoryPage /> },
    ],
  },
]);
