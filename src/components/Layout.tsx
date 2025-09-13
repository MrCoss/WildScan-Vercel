import React from 'react';
import Header from './Header'; // Use your improved Header component

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-300">
      {/* Sticky Header */}
      <Header />

      {/* Main content area */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Optional Footer */}
      <footer className="text-center py-4 text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 mt-8">
        &copy; {new Date().getFullYear()} WildScan. All rights reserved.
      </footer>
    </div>
  );
};

export default Layout;
