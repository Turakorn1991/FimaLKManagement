import { ReactNode, useState } from "react";
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
  sortable?: boolean;
  width?: string;
  align?: "left" | "center" | "right";
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyField: keyof T;
  pageSize?: number;
  emptyText?: string;
}

const PAGE_SIZE_OPTIONS = [5, 10, 25, 50];

export function DataTable<T>({
  columns,
  data,
  keyField,
  pageSize = 5,
  emptyText = "ไม่พบข้อมูล",
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [hoverRow, setHoverRow] = useState<string | null>(null);
  const [rowsPerPage, setRowsPerPage] = useState(pageSize);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(1);
  };

  const handleRowsPerPageChange = (n: number) => {
    setRowsPerPage(n);
    setPage(1);
  };

  const sorted = sortKey
    ? [...data].sort((a: any, b: any) => {
        const va = a[sortKey];
        const vb = b[sortKey];
        if (va === undefined || vb === undefined) return 0;
        const cmp = String(va).localeCompare(String(vb), "th");
        return sortDir === "asc" ? cmp : -cmp;
      })
    : data;

  const totalPages = Math.ceil(sorted.length / rowsPerPage);
  const sliced = sorted.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage,
  );

  return (
    <div>
      <div
        style={{
          overflowX: "auto",
          borderRadius: "10px",
          border: "1px solid #E5E7EB",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            tableLayout: "fixed",
            fontFamily: "'Noto Sans Thai', 'Inter', sans-serif",
          }}
        >
          <thead>
            <tr
              style={{
                backgroundColor: "#F9FAFB",
                borderBottom: "1px solid #E5E7EB",
              }}
            >
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={{
                    padding: "11px 16px",
                    textAlign: col.align || "left",
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "#6B7280",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    cursor: col.sortable
                      ? "pointer"
                      : "default",
                    userSelect: "none",
                    whiteSpace: "nowrap",
                    width: col.width,
                  }}
                  onClick={() =>
                    col.sortable && handleSort(col.key)
                  }
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      justifyContent:
                        col.align === "center"
                          ? "center"
                          : col.align === "right"
                            ? "flex-end"
                            : "flex-start",
                    }}
                  >
                    {col.header}
                    {col.sortable && (
                      <span style={{ color: "#D1D5DB" }}>
                        {sortKey === col.key ? (
                          sortDir === "asc" ? (
                            <ChevronUp
                              size={12}
                              color="#003087"
                            />
                          ) : (
                            <ChevronDown
                              size={12}
                              color="#003087"
                            />
                          )
                        ) : (
                          <ChevronsUpDown size={12} />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sliced.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  style={{
                    padding: "48px 16px",
                    textAlign: "center",
                    color: "#9CA3AF",
                    fontSize: "13px",
                    fontFamily:
                      "'Noto Sans Thai', 'Inter', sans-serif",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <div style={{ fontSize: "32px" }}>📭</div>
                    <div>{emptyText}</div>
                  </div>
                </td>
              </tr>
            ) : (
              sliced.map((row: any) => {
                const rowKey = String(row[keyField]);
                return (
                  <tr
                    key={rowKey}
                    onMouseEnter={() => setHoverRow(rowKey)}
                    onMouseLeave={() => setHoverRow(null)}
                    style={{
                      backgroundColor:
                        hoverRow === rowKey
                          ? "#F0F7FF"
                          : "white",
                      borderBottom: "1px solid #F3F4F6",
                      transition: "background-color 0.1s ease",
                    }}
                  >
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        style={{
                          padding: "12px 16px",
                          fontSize: "13px",
                          color: "#374151",
                          textAlign: col.align || "left",
                          verticalAlign: "middle",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {col.render
                          ? col.render(row)
                          : (row as any)[col.key]}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination footer — always visible when there's data */}
      {sorted.length > 0 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "16px",
            padding: "0 4px",
          }}
        >
          {/* Left: row count */}
          <div
            style={{
              fontSize: "12px",
              color: "#6B7280",
              fontFamily:
                "'Noto Sans Thai', 'Inter', sans-serif",
            }}
          >
            แสดง {(page - 1) * rowsPerPage + 1}–
            {Math.min(page * rowsPerPage, sorted.length)}{" "}
            จากทั้งหมด {sorted.length} รายการ
          </div>

          {/* Right: rows-per-page + page buttons */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            {/* Rows per page dropdown */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span
                style={{
                  fontSize: "12px",
                  color: "#6B7280",
                  fontFamily:
                    "'Noto Sans Thai', 'Inter', sans-serif",
                  whiteSpace: "nowrap",
                }}
              >
                แถวต่อหน้า
              </span>
              <select
                value={rowsPerPage}
                onChange={(e) =>
                  handleRowsPerPageChange(
                    Number(e.target.value),
                  )
                }
                style={{
                  padding: "5px 8px",
                  border: "1px solid #E5E7EB",
                  borderRadius: "6px",
                  fontSize: "12px",
                  color: "#374151",
                  backgroundColor: "white",
                  cursor: "pointer",
                  outline: "none",
                  fontFamily:
                    "'Noto Sans Thai', 'Inter', sans-serif",
                }}
              >
                {PAGE_SIZE_OPTIONS.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>

            {/* Page buttons — only when more than 1 page */}
            {totalPages > 1 && (
              <div style={{ display: "flex", gap: "4px" }}>
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  onMouseEnter={(e) => {
                    if (page !== 1)
                      e.currentTarget.style.backgroundColor =
                        "#F3F4F6";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor =
                      "white";
                  }}
                  style={{
                    padding: "6px 10px",
                    backgroundColor: "white",
                    border: "1px solid #E5E7EB",
                    borderRadius: "6px",
                    cursor:
                      page === 1 ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    opacity: page === 1 ? 0.4 : 1,
                    transition: "background-color 0.15s",
                  }}
                >
                  <ChevronLeft size={14} color="#374151" />
                </button>
                {Array.from(
                  { length: Math.min(5, totalPages) },
                  (_, i) => {
                    const p =
                      Math.max(
                        1,
                        Math.min(page - 2, totalPages - 4),
                      ) + i;
                    if (p > totalPages) return null;
                    return (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        onMouseEnter={(e) => {
                          if (page !== p)
                            e.currentTarget.style.backgroundColor =
                              "#EEF2FF";
                        }}
                        onMouseLeave={(e) => {
                          if (page !== p)
                            e.currentTarget.style.backgroundColor =
                              "white";
                        }}
                        style={{
                          padding: "6px 10px",
                          backgroundColor:
                            page === p ? "#003087" : "white",
                          color:
                            page === p ? "white" : "#374151",
                          border: `1px solid ${page === p ? "#003087" : "#E5E7EB"}`,
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontSize: "12px",
                          fontWeight: page === p ? 600 : 400,
                          minWidth: "32px",
                          transition: "background-color 0.15s",
                        }}
                      >
                        {p}
                      </button>
                    );
                  },
                )}
                <button
                  onClick={() =>
                    setPage(Math.min(totalPages, page + 1))
                  }
                  disabled={page === totalPages}
                  onMouseEnter={(e) => {
                    if (page !== totalPages)
                      e.currentTarget.style.backgroundColor =
                        "#F3F4F6";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor =
                      "white";
                  }}
                  style={{
                    padding: "6px 10px",
                    backgroundColor: "white",
                    border: "1px solid #E5E7EB",
                    borderRadius: "6px",
                    cursor:
                      page === totalPages
                        ? "not-allowed"
                        : "pointer",
                    display: "flex",
                    alignItems: "center",
                    opacity: page === totalPages ? 0.4 : 1,
                    transition: "background-color 0.15s",
                  }}
                >
                  <ChevronRight size={14} color="#374151" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}