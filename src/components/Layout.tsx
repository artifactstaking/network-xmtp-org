import React from 'react';
import { Outlet } from 'react-router-dom';

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-center">
          <div className="flex items-center gap-3">
            <img src="/xmtp-logo.svg" alt="XMTP" className="h-8" />
            <div className="h-6 w-px bg-gray-300" />
            <span className="text-lg font-medium text-gray-600">Network Status</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t bg-white mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-4">
              <a href="https://xmtp.org" target="_blank" rel="noopener noreferrer" className="hover:text-gray-700">
                About XMTP
              </a>
              <a href="https://docs.xmtp.org" target="_blank" rel="noopener noreferrer" className="hover:text-gray-700">
                Documentation
              </a>
            </div>
            <div className="text-gray-400">
              © 2026 XMTP. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
