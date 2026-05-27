import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'teal' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const variants = {
  primary: { bg: '#003087', color: 'white', border: '#003087', hoverBg: '#002470' },
  teal: { bg: '#00A8A8', color: 'white', border: '#00A8A8', hoverBg: '#00898A' },
  secondary: { bg: '#F3F4F6', color: '#374151', border: '#E5E7EB', hoverBg: '#E5E7EB' },
  danger: { bg: '#FEF2F2', color: '#DC2626', border: '#FECACA', hoverBg: '#FEE2E2' },
  ghost: { bg: 'transparent', color: '#374151', border: 'transparent', hoverBg: '#F9FAFB' },
  outline: { bg: 'transparent', color: '#003087', border: '#003087', hoverBg: '#EEF2FF' },
};

const sizes = {
  sm: { padding: '6px 12px', fontSize: '12px', gap: '5px', iconSize: 13 },
  md: { padding: '8px 16px', fontSize: '13px', gap: '6px', iconSize: 15 },
  lg: { padding: '10px 20px', fontSize: '14px', gap: '8px', iconSize: 16 },
};

export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  disabled,
  type = 'button',
}: ButtonProps) {
  const v = variants[variant];
  const s = sizes[size];

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: s.gap,
        padding: s.padding,
        backgroundColor: v.bg,
        color: v.color,
        border: `1px solid ${v.border}`,
        borderRadius: '8px',
        fontSize: s.fontSize,
        fontWeight: 500,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        fontFamily: "'Noto Sans Thai', 'Inter', sans-serif",
        transition: 'all 0.15s ease',
        whiteSpace: 'nowrap',
        flexDirection: iconPosition === 'right' ? 'row-reverse' : 'row',
      }}
      onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.backgroundColor = v.hoverBg; }}
      onMouseLeave={(e) => { if (!disabled) e.currentTarget.style.backgroundColor = v.bg; }}
    >
      {Icon && <Icon size={s.iconSize} />}
      {children}
    </button>
  );
}
