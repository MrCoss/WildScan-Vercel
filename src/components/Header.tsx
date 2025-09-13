import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ScanLine, History, Info, Menu, X } from 'lucide-react';

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const linkClass =
    "flex items-center gap-2 px-4 py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-green-100 dark:hover:bg-green-900 hover:scale-105 transition-all duration-200";
  const activeLinkClass =
    "bg-gradient-to-r from-green-300 to-green-400 text-white shadow-lg";

  const navLinks = [
    { to: "/", label: "Scan", icon: <ScanLine size={22} /> },
    { to: "/history", label: "History", icon: <History size={22} /> },
    { to: "/about", label: "About", icon: <Info size={22} /> },
  ];

  return (
    <header className="bg-gradient-to-b from-green-50/80 to-white/50 dark:from-green-900/80 dark:to-gray-800/80 backdrop-blur-md sticky top-0 z-30 shadow-md">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <NavLink
          to="/"
          className="flex items-center text-3xl font-extrabold font-sans text-green-700 dark:text-green-300 tracking-wider gap-2"
        >
          <span className="animate-pulse">🐾</span>
          <span className="text-3xl bg-gradient-to-r from-green-400 via-green-500 to-green-600 bg-clip-text text-transparent">
            WildScan
          </span>
        </NavLink>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `${linkClass} ${isActive ? activeLinkClass : ''}`
              }
            >
              <span className="bg-green-200/40 dark:bg-green-700/40 p-1 rounded-full">
                {link.icon}
              </span>
              <span className="hidden md:inline font-semibold">{link.label}</span>
            </NavLink>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-green-100 dark:hover:bg-green-900 transition-all duration-200"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* Mobile Links */}
      {mobileOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 shadow-lg border-t border-gray-200 dark:border-gray-700">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `${linkClass} ${isActive ? activeLinkClass : ''} w-full justify-start`
              }
            >
              <span className="bg-green-200/40 dark:bg-green-700/40 p-1 rounded-full">
                {link.icon}
              </span>
              <span className="font-semibold">{link.label}</span>
            </NavLink>
          ))}
        </div>
      )}
    </header>
  );
};

export default Header;
