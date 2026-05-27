import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "./utils";

const MONTHS_TH = [
  "ม.ค.",
  "ก.พ.",
  "มี.ค.",
  "เม.ย.",
  "พ.ค.",
  "มิ.ย.",
  "ก.ค.",
  "ส.ค.",
  "ก.ย.",
  "ต.ค.",
  "พ.ย.",
  "ธ.ค.",
];
const DAYS_TH = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"];

interface DatePickerProps {
  value?: string; // "YYYY-MM-DD"
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  min?: string; // "YYYY-MM-DD"
  disabled?: boolean;
  className?: string;
  placeholder?: string;
}

function DatePicker({
  value,
  onChange,
  min,
  disabled,
  className,
  placeholder = "เลือกวันที่",
}: DatePickerProps) {
  const selectedDate = value
    ? new Date(value + "T00:00:00")
    : null;
  const minDate = min ? new Date(min + "T00:00:00") : null;

  const [open, setOpen] = React.useState(false);
  const [viewYear, setViewYear] = React.useState(
    selectedDate?.getFullYear() ?? new Date().getFullYear(),
  );
  const [viewMonth, setViewMonth] = React.useState(
    selectedDate?.getMonth() ?? new Date().getMonth(),
  );

  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const handle = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handle);
    return () =>
      document.removeEventListener("mousedown", handle);
  }, [open]);

  const displayValue = selectedDate
    ? `${String(selectedDate.getDate()).padStart(2, "0")}/${String(selectedDate.getMonth() + 1).padStart(2, "0")}/${selectedDate.getFullYear() + 543}`
    : "";

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else setViewMonth((m) => m + 1);
  };

  const selectDay = (day: number) => {
    const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    onChange?.({
      target: { value: dateStr },
    } as React.ChangeEvent<HTMLInputElement>);
    setOpen(false);
  };

  const isSelected = (day: number) =>
    !!selectedDate &&
    selectedDate.getFullYear() === viewYear &&
    selectedDate.getMonth() === viewMonth &&
    selectedDate.getDate() === day;

  const isBeforeMin = (day: number) => {
    if (!minDate) return false;
    return new Date(viewYear, viewMonth, day) < minDate;
  };

  const isToday = (day: number) => {
    const t = new Date();
    return (
      t.getFullYear() === viewYear &&
      t.getMonth() === viewMonth &&
      t.getDate() === day
    );
  };

  const daysInMonth = new Date(
    viewYear,
    viewMonth + 1,
    0,
  ).getDate();
  const firstWeekDay = new Date(
    viewYear,
    viewMonth,
    1,
  ).getDay();

  const cells: (number | null)[] = [
    ...Array(firstWeekDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div
      ref={containerRef}
      style={{ position: "relative", width: "100%" }}
      className={cn(className)}
    >
      {/* Trigger button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((o) => !o)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          padding: "8px 12px",
          border: `1px solid ${open ? "#003087" : "#E5E7EB"}`,
          borderRadius: "6px",
          fontSize: "13px",
          cursor: disabled ? "not-allowed" : "pointer",
          backgroundColor: disabled ? "#F9FAFB" : "#fff",
          color: displayValue ? "#111827" : "#9CA3AF",
          fontFamily: "Inter, 'Noto Sans Thai', sans-serif",
          textAlign: "left",
          outline: "none",
          boxSizing: "border-box",
          transition: "border-color 0.15s",
          boxShadow: open
            ? "0 0 0 3px rgba(0,48,135,0.1)"
            : "none",
        }}
      >
        <span>{displayValue || placeholder}</span>
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            color: open ? "#003087" : "#6B7280",
            flexShrink: 0,
            transition: "color 0.15s",
          }}
        >
          <rect
            x="3"
            y="4"
            width="18"
            height="18"
            rx="2"
            ry="2"
          />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      </button>

      {/* Calendar dropdown */}
      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            zIndex: 9999,
            backgroundColor: "white",
            border: "1px solid #E5E7EB",
            borderRadius: "12px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.14)",
            padding: "8px",
            width: "250px",
            fontFamily: "Inter, 'Noto Sans Thai', sans-serif",
          }}
        >
          {/* Month / Year navigation */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "12px",
            }}
          >
            <button
              onClick={prevMonth}
              style={{
                border: "1px solid #E5E7EB",
                background: "white",
                cursor: "pointer",
                padding: "4px 6px",
                borderRadius: "6px",
                color: "#374151",
                display: "flex",
                alignItems: "center",
                transition: "background 0.1s",
              }}
            >
              <ChevronLeft size={14} />
            </button>
            <span
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: "#111827",
              }}
            >
              {MONTHS_TH[viewMonth]} {viewYear + 543}
            </span>
            <button
              onClick={nextMonth}
              style={{
                border: "1px solid #E5E7EB",
                background: "white",
                cursor: "pointer",
                padding: "4px 6px",
                borderRadius: "6px",
                color: "#374151",
                display: "flex",
                alignItems: "center",
                transition: "background 0.1s",
              }}
            >
              <ChevronRight size={14} />
            </button>
          </div>

          {/* Day-of-week headers */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              marginBottom: "4px",
            }}
          >
            {DAYS_TH.map((d) => (
              <div
                key={d}
                style={{
                  textAlign: "center",
                  fontSize: "10px",
                  fontWeight: 600,
                  color: "#9CA3AF",
                  padding: "3px 0",
                }}
              >
                {d}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: "2px",
            }}
          >
            {cells.map((day, i) => {
              const sel = day !== null && isSelected(day);
              const dis = day === null || isBeforeMin(day);
              const tod = day !== null && isToday(day);
              return (
                <button
                  key={i}
                  type="button"
                  disabled={dis}
                  onClick={() =>
                    day !== null && !dis && selectDay(day)
                  }
                  style={{
                    border:
                      tod && !sel
                        ? "1px solid #003087"
                        : "1px solid transparent",
                    borderRadius: "6px",
                    padding: "6px 2px",
                    fontSize: "12px",
                    fontWeight: sel ? 700 : 400,
                    cursor: dis ? "default" : "pointer",
                    backgroundColor: sel
                      ? "#003087"
                      : "transparent",
                    color:
                      day === null
                        ? "transparent"
                        : dis
                          ? "#D1D5DB"
                          : sel
                            ? "white"
                            : tod
                              ? "#003087"
                              : "#374151",
                    transition: "background-color 0.1s",
                    outline: "none",
                  }}
                  onMouseEnter={(e) => {
                    if (!dis && !sel)
                      (
                        e.currentTarget as HTMLButtonElement
                      ).style.backgroundColor = "#EEF2FF";
                  }}
                  onMouseLeave={(e) => {
                    if (!sel)
                      (
                        e.currentTarget as HTMLButtonElement
                      ).style.backgroundColor = "transparent";
                  }}
                >
                  {day ?? ""}
                </button>
              );
            })}
          </div>

          {/* Clear link */}
          {selectedDate && (
            <div
              style={{
                marginTop: "10px",
                borderTop: "1px solid #F3F4F6",
                paddingTop: "8px",
                textAlign: "right",
              }}
            >
              <button
                type="button"
                onClick={() => {
                  onChange?.({
                    target: { value: "" },
                  } as React.ChangeEvent<HTMLInputElement>);
                  setOpen(false);
                }}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "11px",
                  color: "#9CA3AF",
                  fontFamily: "Inter, sans-serif",
                  padding: 0,
                }}
              >
                ล้างค่า
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export { DatePicker };