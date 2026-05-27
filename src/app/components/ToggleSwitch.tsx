import { useState } from 'react';

interface ToggleSwitchProps {
  checked: boolean;
  onChange?: (val: boolean) => void;
  disabled?: boolean;
}

export function ToggleSwitch({ checked, onChange, disabled }: ToggleSwitchProps) {
  const [hover, setHover] = useState(false);

  return (
    <button
      onClick={() => !disabled && onChange?.(!checked)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: '40px',
        height: '22px',
        borderRadius: '11px',
        backgroundColor: checked ? '#00A8A8' : '#D1D5DB',
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        position: 'relative',
        transition: 'background-color 0.2s ease',
        outline: hover && !disabled ? '2px solid rgba(0,168,168,0.3)' : 'none',
        opacity: disabled ? 0.5 : 1,
        flexShrink: 0,
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: '3px',
          left: checked ? '21px' : '3px',
          width: '16px',
          height: '16px',
          borderRadius: '50%',
          backgroundColor: 'white',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          transition: 'left 0.2s ease',
          display: 'block',
        }}
      />
    </button>
  );
}
