import {
  Bell,
  Search,
  Menu,
  ChevronDown,
  Shield,
  User,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

const NAVY = "#003087";

interface NavbarProps {
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}

export function Navbar({ onToggleSidebar }: NavbarProps) {
  const [notifications] = useState(3);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    }
    if (showUserMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showUserMenu]);

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "64px",
        backgroundColor: NAVY,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        zIndex: 1000,
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
      }}
    >
      {/* Left: Hamburger + Logo */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <button
          onClick={onToggleSidebar}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor =
              "rgba(255,255,255,0.15)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor =
              "transparent")
          }
          style={{
            background: "none",
            border: "none",
            color: "white",
            cursor: "pointer",
            padding: "6px",
            borderRadius: "6px",
            display: "flex",
            alignItems: "center",
            transition: "background-color 0.15s",
          }}
        >
          <Menu size={20} />
        </button>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              backgroundColor: "#00A8A8",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Shield size={20} color="white" />
          </div>
          <div>
            <div
              style={{
                color: "white",
                fontSize: "14px",
                fontWeight: 600,
                letterSpacing: "0.01em",
                lineHeight: 1.2,
              }}
            >
              Management Linkage Services Center
            </div>
            <div
              style={{
                color: "rgba(255,255,255,0.65)",
                fontSize: "11px",
                lineHeight: 1.2,
              }}
            >
              กรมอุตสาหกรรมทหาร (อท.)
            </div>
          </div>
        </div>
      </div>

      {/* Right: Notifications + User */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <div ref={userMenuRef} style={{ position: "relative" }}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor =
                "rgba(255,255,255,0.2)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor =
                "rgba(255,255,255,0.1)")
            }
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "none",
              color: "white",
              cursor: "pointer",
              padding: "6px 12px",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontFamily:
                "'Noto Sans Thai', 'Inter', sans-serif",
              transition: "background-color 0.15s",
            }}
          >
            <div
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                backgroundColor: "#00A8A8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                fontWeight: 600,
                color: "white",
              }}
            >
              <User size={16} />
            </div>
            <div style={{ textAlign: "left" }}>
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: 500,
                  lineHeight: 1.2,
                }}
              >
                สิบโท ธนพล สุขใจ
              </div>
            </div>
            <ChevronDown
              size={14}
              style={{ color: "rgba(255,255,255,0.6)" }}
            />
          </button>

          {showUserMenu && (
            <div
              style={{
                position: "absolute",
                top: "48px",
                right: 0,
                backgroundColor: "white",
                borderRadius: "10px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
                width: "200px",
                zIndex: 2000,
                overflow: "hidden",
              }}
            >
              {[
                {
                  label: "ออกจากระบบ",
                  sub: "Sign out",
                  danger: false,
                },
              ].map((item) => (
                <button
                  key={item.label}
                  style={{
                    width: "100%",
                    background: "none",
                    border: "none",
                    padding: "10px 16px",
                    textAlign: "left",
                    cursor: "pointer",
                    display: "block",
                    borderBottom: "1px solid #F3F4F6",
                    fontFamily:
                      "'Noto Sans Thai', 'Inter', sans-serif",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      "#F9FAFB")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      "transparent")
                  }
                >
                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: 500,
                      color: item.danger
                        ? "#EF4444"
                        : "#1F2937",
                    }}
                  >
                    {item.label}
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#9CA3AF",
                    }}
                  >
                    {item.sub}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}