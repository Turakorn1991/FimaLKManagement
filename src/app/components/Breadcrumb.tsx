import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '20px' }}>
      <Home size={14} color="#9CA3AF" />
      {items.map((item, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ChevronRight size={12} color="#D1D5DB" />
          <span
            style={{
              fontSize: '13px',
              color: i === items.length - 1 ? '#1F2937' : '#6B7280',
              fontWeight: i === items.length - 1 ? 500 : 400,
              fontFamily: "'Noto Sans Thai', 'Inter', sans-serif",
            }}
          >
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}
