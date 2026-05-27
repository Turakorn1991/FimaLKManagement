interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'pending' | 'error' | 'warning' | 'permanent' | 'temporary' | 'revoked';
  label?: string;
}

const statusConfig = {
  active: { bg: '#ECFDF5', color: '#059669', border: '#A7F3D0', label: 'เปิดใช้งาน' },
  inactive: { bg: '#F9FAFB', color: '#6B7280', border: '#E5E7EB', label: 'ปิดใช้งาน' },
  pending: { bg: '#FFFBEB', color: '#D97706', border: '#FDE68A', label: 'รอดำเนินการ' },
  error: { bg: '#FEF2F2', color: '#DC2626', border: '#FECACA', label: 'ผิดพลาด' },
  warning: { bg: '#FFFBEB', color: '#D97706', border: '#FDE68A', label: 'คำเตือน' },
  permanent: { bg: '#EEF2FF', color: '#4338CA', border: '#C7D2FE', label: 'ถาวร' },
  temporary: { bg: '#FFF7ED', color: '#C2410C', border: '#FDBA74', label: 'ชั่วคราว' },
  revoked: { bg: '#FEF2F2', color: '#DC2626', border: '#FECACA', label: 'เพิกถอนแล้ว' },
};

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const cfg = statusConfig[status];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '3px 10px',
        borderRadius: '20px',
        backgroundColor: cfg.bg,
        color: cfg.color,
        border: `1px solid ${cfg.border}`,
        fontSize: '11px',
        fontWeight: 600,
        fontFamily: "'Noto Sans Thai', 'Inter', sans-serif",
        whiteSpace: 'nowrap',
      }}
    >
      <span
        style={{
          width: '5px',
          height: '5px',
          borderRadius: '50%',
          backgroundColor: cfg.color,
          display: 'inline-block',
        }}
      />
      {label || cfg.label}
    </span>
  );
}
