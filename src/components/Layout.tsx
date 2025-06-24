import React, { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Container,
  RefreshCw,
  Home,
  Package,
  Info,
  Sun,
  Moon,
} from "lucide-react";
import { useRegistry } from "../contexts/RegistryContext";
import { useTheme } from "../contexts/ThemeContext";
import { cn } from "../utils/cn";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { isConnected, loading, refreshRepositories } = useRegistry();
  const { theme, toggleTheme } = useTheme();

  const registryUrl =
    import.meta.env.VITE_DOCKER_REGISTRY_URL || "http://localhost:5000";
  const registryName =
    import.meta.env.VITE_DOCKER_REGISTRY_NAME || "Docker Registry";

  const handleRefresh = () => {
    refreshRepositories();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and title */}
            <div className="flex items-center space-x-3">
              <Container className="h-8 w-8 text-docker-blue" />
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  {registryName}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {registryUrl.replace("http://", "").replace("https://", "")}
                </p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex items-center space-x-4">
              <Link
                to="/"
                className={cn(
                  "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  location.pathname === "/"
                    ? "bg-docker-blue text-white"
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                )}
              >
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>

              <Link
                to="/about"
                className={cn(
                  "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  location.pathname === "/about"
                    ? "bg-docker-blue text-white"
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                )}
              >
                <Info className="h-4 w-4" />
                <span>About</span>
              </Link>

              {/* Connection status */}
              <div className="flex items-center space-x-2">
                <div
                  className={cn(
                    "w-2 h-2 rounded-full",
                    isConnected ? "bg-green-500" : "bg-red-500"
                  )}
                />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {isConnected ? "Connected" : "Disconnected"}
                </span>
              </div>

              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
              >
                {theme === "light" ? (
                  <Moon className="h-4 w-4" />
                ) : (
                  <Sun className="h-4 w-4" />
                )}
              </button>

              {/* Refresh button */}
              <button
                onClick={handleRefresh}
                disabled={loading}
                className={cn(
                  "p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors",
                  loading && "animate-spin"
                )}
                title="Refresh repositories"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <Package className="h-4 w-4" />
              <span>{registryName}</span>
              <span>•</span>
              <span>Modern interface for Docker registries</span>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Registry: {registryUrl}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
