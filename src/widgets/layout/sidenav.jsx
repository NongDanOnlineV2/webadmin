import PropTypes from "prop-types";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import {
  Button,
  IconButton,
  Typography,
} from "@material-tailwind/react";
import {
  useMaterialTailwindController,
  setOpenSidenav,
  setAuthStatus,
} from "@/context";

export function Sidenav({ brandImg, brandName, routes, onCollapse }) {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavColor, sidenavType, openSidenav, isAuthenticated } = controller;
  const [collapsed, setCollapsed] = useState(false);
  const [openCollapse, setOpenCollapse] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (onCollapse) onCollapse(collapsed);
  }, [collapsed]);

  const handleLogout = () => {
    const confirmLogout = window.confirm("Bạn có chắc muốn đăng xuất?");
    if (confirmLogout) {
      localStorage.removeItem("token");
      setAuthStatus(dispatch, false);
      navigate("/auth/sign-in");
    }
  };

  const sidenavTypes = {
    dark: "bg-gradient-to-br from-gray-800 to-gray-900",
    white: "bg-white shadow-sm",
    transparent: "bg-transparent",
  };

  const visibleRoutes = isAuthenticated
  ? routes
      .filter((section) => section.layout !== "auth")
      .map((section) => ({
        ...section,
        pages: section.pages.filter(
          (page) => page.name?.toLowerCase() !== "sign in"
        ),
      }))
  : routes;

  return (
    <aside
      className={`${sidenavTypes[sidenavType]} ${
        openSidenav ? "translate-x-0" : "-translate-x-80"
      } fixed inset-y-0 z-50 my-4 ml-4 h-[calc(100vh-32px)] ${
        collapsed ? "w-20" : "w-60"
      } rounded-xl transition-all duration-300 xl:translate-x-0 border border-blue-gray-100`}
    >
      <div className="relative">
        <Link to="/" className="py-6 px-4 text-center block">
          <Typography
            color="inherit"
            className={`font-medium text-lg transition-all duration-300 ${
              collapsed ? "hidden" : "block"
            }`}
          >
            Admin Farm
          </Typography>
        </Link>

        <IconButton
          variant="text"
          color="blue-gray"
          size="sm"
          ripple={false}
          className="absolute right-0 top-0 m-2"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ChevronRightIcon className="h-5 w-5 text-blue-gray-700" />
          ) : (
            <ChevronLeftIcon className="h-5 w-5 text-blue-gray-700" />
          )}
        </IconButton>
      </div>

      <div className="m-4 overflow-y-auto max-h-[calc(100vh-200px)] pr-2">
        {visibleRoutes.map(({ layout, title, pages }, key) => (
          <ul key={key} className="mb-4 flex flex-col gap-1">
            {title && !collapsed && (
              <li className="mx-3.5 mt-4 mb-2">
                <Typography
                  variant="small"
                  color={sidenavType === "dark" ? "white" : "blue-gray"}
                  className="font-black uppercase opacity-75"
                >
                  {title}
                </Typography>
              </li>
            )}

            {pages.map((route) => {
              if (route.collapse) {
                const isOpen = openCollapse === route.name;
                return (
                  <li key={route.name}>
                    <button
                      className={`w-full text-left px-4 py-2 font-semibold uppercase ${
                        collapsed ? "hidden" : ""
                      }`}
                      onClick={() => setOpenCollapse(isOpen ? null : route.name)}
                    >
                      {route.name}
                    </button>

                    {isOpen && (
                      <ul className="ml-4 space-y-1">
                        {route.collapse.map((subRoute) => (
                          <li key={subRoute.name}>
                            <NavLink to={`/${layout}${subRoute.path}`}>
                              {({ isActive }) => (
                                <Button
                                  variant={isActive ? "gradient" : "text"}
                                  color={
                                    isActive
                                      ? sidenavColor
                                      : sidenavType === "dark"
                                      ? "white"
                                      : "blue-gray"
                                  }
                                  className={`flex items-center gap-4 transition-all duration-200 text-sm ${
                                    collapsed ? "justify-center p-3" : "px-4"
                                  }`}
                                  fullWidth
                                >
                                  {!collapsed && (
                                    <Typography
                                      color="inherit"
                                      className="font-normal"
                                    >
                                      {subRoute.name}
                                    </Typography>
                                  )}
                                </Button>
                              )}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              }

              return (
                <li key={route.name}>
                  <NavLink to={layout === 'public'? `${route.path}`: `/${layout}${route.path}`}>
                    {({ isActive }) => (
                      <Button
                        variant={isActive ? "gradient" : "text"}
                        color={
                          isActive
                            ? sidenavColor
                            : sidenavType === "dark"
                            ? "white"
                            : "blue-gray"
                        }
                        className={`flex items-center gap-4 capitalize transition-all duration-200 ${
                          collapsed ? "justify-center p-3" : "px-4"
                        }`}
                        fullWidth
                      >
                        {route.icon}
                        {!collapsed && (
                          <Typography
                            color="inherit"
                            className="font-medium capitalize"
                          >
                            {route.name}
                          </Typography>
                        )}
                      </Button>
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        ))}
      </div>

      {isAuthenticated && (
        <div className="m-4">
          <Button
            variant="text"
            color={sidenavType === "dark" ? "white" : "blue-gray"}
            className={`w-full flex items-center gap-4 capitalize ${
              collapsed ? "justify-center p-3" : "px-4"
            }`}
            fullWidth
            onClick={handleLogout}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18.75 12H9m0 0l3-3m-3 3l3 3"
              />
            </svg>
            {!collapsed && (
              <Typography color="inherit" className="font-medium">
                Log out
              </Typography>
            )}
          </Button>
        </div>
      )}
    </aside>
  );
}

Sidenav.defaultProps = {
  brandImg: "/img/logo.svg",
  brandName: "webadmin-nông trang V3",
};

Sidenav.propTypes = {
  brandImg: PropTypes.string,
  brandName: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
  onCollapse: PropTypes.func,
};

Sidenav.displayName = "/src/widgets/layout/sidnave.jsx";

export default Sidenav;
