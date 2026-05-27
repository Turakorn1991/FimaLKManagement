import {
  X,
  AlertTriangle,
  Trash2,
  Info,
  CheckCircle,
} from "lucide-react";
import { Button } from "./Button";

type ConfirmVariant = "danger" | "warning" | "info" | "success";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message?: string;
  variant?: ConfirmVariant;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
}

const variantConfig: Record<
  ConfirmVariant,
  {
    icon: typeof AlertTriangle;
    iconBg: string;
    iconColor: string;
    confirmVariant: "danger" | "primary" | "teal";
  }
> = {
  danger: {
    icon: Trash2,
    iconBg: "#FEF2F2",
    iconColor: "#DC2626",
    confirmVariant: "danger",
  },
  warning: {
    icon: AlertTriangle,
    iconBg: "#FFFBEB",
    iconColor: "#D97706",
    confirmVariant: "primary",
  },
  info: {
    icon: Info,
    iconBg: "#EEF2FF",
    iconColor: "#4338CA",
    confirmVariant: "primary",
  },
  success: {
    icon: CheckCircle,
    iconBg: "#F0FDF4",
    iconColor: "#16A34A",
    confirmVariant: "teal",
  },
};

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  variant = "danger",
  confirmLabel,
  cancelLabel = "ยกเลิก",
  loading = false,
}: ConfirmDialogProps) {
  if (!open) return null;

  const cfg = variantConfig[variant];
  const Icon = cfg.icon;

  const defaultConfirmLabel =
    variant === "danger" ? "ลบ" : "ยืนยัน";

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.45)",
        zIndex: 4000,
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
          maxWidth: "420px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 24px 0",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
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
              transition: "background-color 0.15s",
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div
          style={{
            padding: "8px 32px 28px",
            textAlign: "center",
          }}
        >
          {/* Icon */}
          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              backgroundColor: cfg.iconBg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <Icon size={28} color={cfg.iconColor} />
          </div>

          <h2
            style={{
              fontSize: "16px",
              fontWeight: 700,
              color: "#111827",
              margin: "0 0 8px",
              fontFamily:
                "'Noto Sans Thai', 'Inter', sans-serif",
            }}
          >
            {title}
          </h2>

          {message && (
            <p
              style={{
                fontSize: "13px",
                color: "#6B7280",
                margin: 0,
                lineHeight: 1.6,
                fontFamily:
                  "'Noto Sans Thai', 'Inter', sans-serif",
              }}
            >
              {message}
            </p>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "16px 24px",
            borderTop: "1px solid #F3F4F6",
            display: "flex",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            {cancelLabel}
          </Button>
          <Button
            variant={cfg.confirmVariant}
            onClick={() => {
              onConfirm();
            }}
            disabled={loading}
          >
            {loading
              ? "กำลังดำเนินการ..."
              : (confirmLabel ?? defaultConfirmLabel)}
          </Button>
        </div>
      </div>
    </div>
  );
}