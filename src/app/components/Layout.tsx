import { useState } from 'react';
import { Outlet } from 'react-router';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

export function Layout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div
      style={{
        fontFamily: "'Noto Sans Thai', 'Inter', sans-serif",
        backgroundColor: '#F0F4F8',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Navbar sidebarCollapsed={sidebarCollapsed} onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar collapsed={sidebarCollapsed} />
        <main
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px',
            marginTop: '64px',
            marginLeft: sidebarCollapsed ? '72px' : '260px',
            transition: 'margin-left 0.3s ease',
            minHeight: 'calc(100vh - 64px)',
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
