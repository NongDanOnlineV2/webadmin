import { Routes, Route, Outlet } from "react-router-dom";
import { useState } from "react";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { IconButton } from "@material-tailwind/react";

import {
  Sidenav,
  DashboardNavbar,
  Configurator,
  Footer,
} from "@/widgets/layout";

import routes from "@/routes";
import { useMaterialTailwindController, setOpenConfigurator } from "@/context";

export function Dashboard() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavType } = controller;
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-blue-gray-50/50 flex">
      <Sidenav
        routes={routes}
        brandImg={
          sidenavType === "dark"
            ? "/img/logo-ct.png"
            : "/img/logo-ct-dark.png"
        }
        onCollapse={(value) => setCollapsed(value)}
      />
      <div
        className={`p-4 transition-all duration-300 w-full ${
          collapsed ? "xl:ml-24" : "xl:ml-64"
        }`}
      >
        <DashboardNavbar />
        <Configurator />
        <IconButton
          size="lg"
          color="white"
          className="fixed bottom-8 right-8 z-40 rounded-full shadow-blue-gray-900/10"
          ripple={false}
          onClick={() => setOpenConfigurator(dispatch, true)}
        >
          <Cog6ToothIcon className="h-5 w-5" />
        </IconButton>

        <Routes>
          {routes.map(
            ({ layout, pages }) =>
              layout === "dashboard" &&
              pages.flatMap((route) =>
                route.collapse
                  ? route.collapse.map(({ path, element }) => (
                      <Route key={path} path={path} element={element} />
                    ))
                  : [
                      <Route
                        key={route.path}
                        path={route.path}
                        element={route.element}
                      />,
                    ]
              )
          )}
        </Routes>

        {/* This renders nested routes like /users/:id */}
        <Outlet />

        <div className="text-blue-gray-600">
          <Footer />
        </div>
      </div>
    </div>
  );
}

Dashboard.displayName = "/src/layouts/dashboard.jsx";
export default Dashboard;
