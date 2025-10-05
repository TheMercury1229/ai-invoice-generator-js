import { Briefcase, LogOut, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { NAVIGATION_MENU } from "../../utils/data";
import { ProfileDropdown } from "./ProfileDropdown";

const NavigationItem = ({ item, isActive, onClick, isCollapsed }) => {
  const Icon = item.icon;
  return (
    <button
      onClick={() => onClick(item.id)}
      className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group ${
        isActive
          ? "bg-blue-50 text-blue-900 shadow-sm shadow-blue-50"
          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
      }`}
    >
      <Icon
        className={`size-5 flex-shrink-0 ${
          isActive ? "text-blue-900" : "text-gray-600"
        }`}
      />
      {!isCollapsed && <span className="ml-3">{item.name}</span>}
    </button>
  );
};

export default function DashboardLayout({ children, activeMenu }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState(activeMenu || "dashboard");
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarOpen(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  //Close dropdown and sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownOpen) {
        setProfileDropdownOpen(false);
      }

      // Close sidebar on mobile when clicking outside
      if (isMobile && sidebarOpen) {
        const sidebar = document.querySelector("[data-sidebar]");
        const mobileToggle = document.querySelector("[data-mobile-toggle]");

        if (
          sidebar &&
          !sidebar.contains(event.target) &&
          mobileToggle &&
          !mobileToggle.contains(event.target)
        ) {
          setSidebarOpen(false);
        }
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [profileDropdownOpen, isMobile, sidebarOpen]);

  const handleNavigation = (itemId) => {
    setActiveNavItem(itemId);
    navigate(`/${itemId}`);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  const sidebarCollapsed = !!isMobile && false;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/10 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        data-sidebar
        className={`fixed inset-y-0 left-0 z-50 transition-transform duration-300 transform ${
          isMobile
            ? sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
            : "translate-x-0"
        } ${
          sidebarCollapsed ? "w-16" : "w-64"
        } bg-white border-r border-gray-200 `}
      >
        <div>
          {/* Company logo */}
          <div className="flex items-center h-16 border-b border-gray-200 px-6">
            <Link className="flex items-center space-x-3" to="/dashboard">
              <div className="size-8 bg-gradient-to-br from-blue-900 to-blue-700 rounded-lg flex items-center justify-center p-2">
                <Briefcase className="size-5 text-white" />
              </div>
              {!sidebarCollapsed && (
                <span className="text-gray-800 font-bold text-lg">
                  AI Invoice App
                </span>
              )}
            </Link>
          </div>
          {/* Navigation items */}
          <nav className="p-4 space-y-2">
            {NAVIGATION_MENU.map((item) => (
              <NavigationItem
                key={item.id}
                item={item}
                isActive={activeNavItem === item.id}
                onClick={handleNavigation}
                isCollapsed={sidebarCollapsed}
              />
            ))}
          </nav>
          {/* Logout */}
          <div className="absolute bottom-4 left-4 right-4">
            <button
              className="w-full flex items-center px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
              onClick={logout}
            >
              <LogOut className="size-5 flex-shrink-0 text-gray-500 " />
              {!sidebarCollapsed && <span className="ml-3">Logout</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isMobile ? "ml-0" : sidebarCollapsed ? "ml-16" : "ml-64"
        }`}
      >
        {/* Top Navbar */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 h-16 flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="flex items-center space-x-4">
            {isMobile && (
              <button
                data-mobile-toggle
                className="p-2 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                onClick={toggleSidebar}
              >
                {sidebarOpen ? (
                  <X className="size-5 text-gray-600" />
                ) : (
                  <Menu className="size-5 text-gray-600" />
                )}
              </button>
            )}
            <div>
              <h1 className="text-base font-semibold text-gray-800">
                Welcome back, {user?.name}!
              </h1>
              <p className="hidden sm:block text-gray-500 text-sm">
                Here's your invoice overview.
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {/* Profile Dropdown */}
            <ProfileDropdown
              isOpen={profileDropdownOpen}
              onToggle={(e) => {
                e.stopPropagation();
                setProfileDropdownOpen(!profileDropdownOpen);
              }}
              avatar={user?.avatar || ""}
              companyName={user?.name || ""}
              email={user?.email || ""}
              onLogout={logout}
            />
          </div>
        </header>
        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
