import { Link, useLocation, Outlet } from "react-router-dom";
import { HomeIcon, ChartBarIcon, CloudIcon, Cog6ToothIcon as SettingsIcon, CircleStackIcon as DatabaseIcon, UserIcon, ArrowRightStartOnRectangleIcon as LogoutIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../features/auth/AuthProvider";

const MainLayout = () => {
  const location = useLocation();
  const { logout, user } = useAuth();

  const navigationItems = [
    { name: "Dashboard", path: "/dashboard", icon: HomeIcon },
    { name: "Weather Data", path: "/weather", icon: CloudIcon },
    { name: "Analysis", path: "/analysis", icon: ChartBarIcon },
    { name: "Data Management", path: "/data", icon: DatabaseIcon },
    { name: "Settings", path: "/settings", icon: SettingsIcon },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      // Pas besoin de navigate ici car le logout dans AuthProvider gère déjà la redirection
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow">
        {/* Logo */}
        <div className="flex h-16 items-center justify-center border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">NOAA Analytics</h1>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.name} to={item.path} className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${isActive ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}>
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User section */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200">
          <div className="flex items-center px-4 py-3">
            <div className="flex-shrink-0">
              <UserIcon className="h-8 w-8 rounded-full bg-gray-200 p-1" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">{user?.name || "Admin User"}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
              <button onClick={handleLogout} className="flex items-center text-xs text-gray-500 hover:text-gray-700 mt-1">
                <LogoutIcon className="mr-1 h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="pl-64">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="px-4 py-4 sm:px-6">
            <h2 className="text-lg font-semibold text-gray-900">{navigationItems.find((item) => item.path === location.pathname)?.name || "NOAA Weather Analysis"}</h2>
          </div>
        </header>

        {/* Page content */}
        <main className="px-4 py-6 sm:px-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
