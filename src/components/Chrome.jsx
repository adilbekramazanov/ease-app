// Хром «телефона»: статус-бар с динамическим островом + иконки.
export function StatusBar({ dark = false }) {
  const c = dark ? '#fff' : 'var(--ink)';
  return (
    <div className={`statusbar${dark ? ' on-dark' : ''}`}>
      <div className="dynamic-island" />
      <span>9:41</span>
      <span className="statusbar-icons" style={{ color: c }}>
        {/* signal */}
        <svg width="18" height="12" viewBox="0 0 18 12" fill={c} aria-hidden="true">
          <rect x="0" y="8" width="3" height="4" rx="1" />
          <rect x="5" y="5" width="3" height="7" rx="1" />
          <rect x="10" y="2.5" width="3" height="9.5" rx="1" />
          <rect x="15" y="0" width="3" height="12" rx="1" />
        </svg>
        {/* wifi */}
        <svg width="16" height="12" viewBox="0 0 16 12" fill={c} aria-hidden="true">
          <path d="M8 11.2a1.4 1.4 0 100-2.8 1.4 1.4 0 000 2.8z" />
          <path d="M8 3.2c2.3 0 4.4.9 6 2.4l-1.5 1.6A6.4 6.4 0 008 5.4c-1.7 0-3.3.6-4.5 1.8L2 5.6A8.6 8.6 0 018 3.2z" />
          <path d="M8 .2c3 0 5.8 1.2 7.9 3.1l-1.5 1.6A9.4 9.4 0 008 2.4 9.4 9.4 0 001.6 4.9L.1 3.3A11.4 11.4 0 018 .2z" opacity="0.9" />
        </svg>
        {/* battery */}
        <svg width="26" height="13" viewBox="0 0 26 13" aria-hidden="true">
          <rect x="0.5" y="0.5" width="22" height="12" rx="3.5" fill="none" stroke={c} strokeOpacity="0.4" />
          <rect x="2.2" y="2.2" width="16" height="8.6" rx="2" fill={c} />
          <rect x="24" y="4" width="2" height="5" rx="1" fill={c} fillOpacity="0.4" />
        </svg>
      </span>
    </div>
  );
}

// Универсальная кнопка.
export function Button({ variant = 'primary', className = '', children, ...rest }) {
  return (
    <button className={`btn btn-${variant} ${className}`} {...rest}>
      {children}
    </button>
  );
}
