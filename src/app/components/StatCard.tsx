import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  sub?: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  trend?: number;
  trendLabel?: string;
}

export function StatCard({ title, value, sub, icon: Icon, iconColor = '#003087', iconBg = '#EEF2FF', trend, trendLabel }: StatCardProps) {
  const isPositive = trend !== undefined && trend >= 0;

  return (
    <div
      style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '20px 24px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06), 0 2px 12px rgba(0,0,0,0.04)',
        border: '1px solid rgba(0,0,0,0.05)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        flex: 1,
        minWidth: 0,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <div
            style={{
              fontSize: '12px',
              color: '#6B7280',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '4px',
              fontFamily: "'Noto Sans Thai', 'Inter', sans-serif",
            }}
          >
            {title}
          </div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#111827', lineHeight: 1.2 }}>
            {value}
          </div>
          {sub && <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '2px', fontFamily: "'Noto Sans Thai', 'Inter', sans-serif" }}>{sub}</div>}
        </div>
        <div
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '10px',
            backgroundColor: iconBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Icon size={20} color={iconColor} />
        </div>
      </div>
      {trend !== undefined && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {isPositive ? <TrendingUp size={14} color="#10B981" /> : <TrendingDown size={14} color="#EF4444" />}
          <span style={{ fontSize: '12px', color: isPositive ? '#10B981' : '#EF4444', fontWeight: 500 }}>
            {isPositive ? '+' : ''}{trend}%
          </span>
          <span style={{ fontSize: '12px', color: '#9CA3AF', fontFamily: "'Noto Sans Thai', 'Inter', sans-serif" }}>
            {trendLabel || 'จากเดือนที่แล้ว'}
          </span>
        </div>
      )}
    </div>
  );
}
