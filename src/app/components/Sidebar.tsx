import { NavLink, useLocation } from "react-router";
import {
  LayoutDashboard,
  Building2,
  MonitorSmartphone,
  Layers,
  ShieldCheck,
  GitBranch,
  FileSearch,
  ClipboardList,
  ChevronRight,
} from "lucide-react";

interface SidebarProps {
  collapsed: boolean;
}

const navItems = [
  {
    path: "/",
    icon: LayoutDashboard,
    label: "หน้าหลัก",
    sub: "Dashboard",
  },
  {
    path: "/clients",
    icon: Building2,
    label: "แอปพลิเคชัน",
    sub: "Clients",
  },
  {
    path: "/providers",
    icon: Building2,
    label: "ผู้ให้บริการ",
    sub: "Providers",
  },
  {
    path: "/permissions",
    icon: ShieldCheck,
    label: "จัดการสิทธิ์",
    sub: "Permissions",
  },
  {
    path: "/services",
    icon: Layers,
    label: "บริการ",
    sub: "Services",
  },
  {
    path: "/log-linkage",
    icon: GitBranch,
    label: "Log Linkage2",
    sub: "Logs",
  },
  {
    path: "/log-license",
    icon: FileSearch,
    label: "Log หนังสือ อท.",
    sub: "Logs",
  },
  {
    path: "/audit",
    icon: ClipboardList,
    label: "Audit Log ระบบ",
    sub: "Audit",
  },
];

export function Sidebar({ collapsed }: SidebarProps) {
  const location = useLocation();

  const isActive = (path: string) =>
    path === "/"
      ? location.pathname === "/"
      : location.pathname.startsWith(path);

  return (
    <aside
      style={{
        position: "fixed",
        top: "64px",
        left: 0,
        bottom: 0,
        width: collapsed ? "72px" : "256px",
        backgroundColor: "#111827",
        transition: "width 0.3s ease",
        overflow: "hidden",
        zIndex: 900,
        display: "flex",
        flexDirection: "column",
        boxShadow: "2px 0 8px rgba(0,0,0,0.12)",
      }}
    >
      <nav
        style={{
          flex: 1,
          padding: "12px 0",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {navItems.map((item) => {
          const active = isActive(item.path);
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              style={{
                textDecoration: "none",
                display: "block",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: collapsed
                    ? "12px 20px"
                    : "10px 16px",
                  margin: "2px 8px",
                  borderRadius: "8px",
                  backgroundColor: active
                    ? "rgba(255,255,255,0.12)"
                    : "transparent",
                  cursor: "pointer",
                  transition: "background-color 0.15s ease",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  if (!active)
                    e.currentTarget.style.backgroundColor =
                      "rgba(255,255,255,0.07)";
                }}
                onMouseLeave={(e) => {
                  if (!active)
                    e.currentTarget.style.backgroundColor =
                      "transparent";
                }}
              >
                <div
                  style={{
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Icon
                    size={17}
                    color={
                      active
                        ? "rgba(255,255,255,0.95)"
                        : "rgba(255,255,255,0.5)"
                    }
                  />
                </div>
                {!collapsed && (
                  <div style={{ flex: 1, overflow: "hidden" }}>
                    <div
                      style={{
                        fontSize: "13px",
                        fontWeight: active ? 600 : 400,
                        color: active
                          ? "rgba(255,255,255,0.95)"
                          : "rgba(255,255,255,0.65)",
                        lineHeight: 1.3,
                        fontFamily:
                          "'Noto Sans Thai', 'Inter', sans-serif",
                      }}
                    >
                      {item.label}
                    </div>
                    <div
                      style={{
                        fontSize: "10px",
                        color: "rgba(255,255,255,0.28)",
                        lineHeight: 1.2,
                      }}
                    >
                      {item.sub}
                    </div>
                  </div>
                )}
                {!collapsed && active && (
                  <ChevronRight
                    size={13}
                    color="rgba(255,255,255,0.35)"
                    style={{ flexShrink: 0 }}
                  />
                )}
              </div>
            </NavLink>
          );
        })}
      </nav>

      {!collapsed && (
        <div
          style={{
            padding: "14px 20px",
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div
            style={{
              fontSize: "10px",
              color: "rgba(255,255,255,0.25)",
              lineHeight: 1.6,
            }}
          >
            <div>Management Services Center</div>
            <div>v2.1.0 · กรมอุตสาหกรรมทหาร (อท.)</div>
          </div>
        </div>
      )}
    </aside>
  );
}