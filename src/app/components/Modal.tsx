import { X } from "lucide-react";
import { ReactNode } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeMap = {
  sm: "400px",
  md: "560px",
  lg: "720px",
  xl: "900px",
};

export function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  size = "md",
}: ModalProps) {
  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        zIndex: 3000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        backdropFilter: "blur(2px)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "white",
          borderRadius: "14px",
          width: "100%",
          maxWidth: sizeMap[size],
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid #F3F4F6",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "12px",
          }}
        >
          <div>
            <h2
              style={{
                fontSize: "16px",
                fontWeight: 600,
                color: "#111827",
                margin: 0,
                fontFamily:
                  "'Noto Sans Thai', 'Inter', sans-serif",
              }}
            >
              {title}
            </h2>
            {subtitle && (
              <p
                style={{
                  fontSize: "13px",
                  color: "#6B7280",
                  margin: "2px 0 0",
                  fontFamily:
                    "'Noto Sans Thai', 'Inter', sans-serif",
                }}
              >
                {subtitle}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor =
                "#E5E7EB")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor =
                "#F3F4F6")
            }
            style={{
              background: "#F3F4F6",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              padding: "6px",
              display: "flex",
              alignItems: "center",
              color: "#6B7280",
              flexShrink: 0,
              transition: "background-color 0.15s",
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "20px 24px",
          }}
        >
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div
            style={{
              padding: "16px 24px",
              borderTop: "1px solid #F3F4F6",
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}