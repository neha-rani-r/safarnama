interface CompassLogoProps {
  size?: number;
  spin?: boolean;
}

export default function CompassLogo({ size = 36, spin = false }: CompassLogoProps) {
  const needleClass = spin ? 'compass-needle-spin' : 'compass-needle';

  return (
    <svg width={size} height={size} viewBox="0 0 72 72" xmlns="http://www.w3.org/2000/svg">
      <circle cx="36" cy="36" r="32" fill="none" stroke="#1a1a1a" strokeWidth="2.5" />
      <circle cx="36" cy="36" r="28" fill="none" stroke="#1a1a1a" strokeWidth="0.6" opacity="0.2" />
      <line x1="36" y1="4" x2="36" y2="10" stroke="#1a1a1a" strokeWidth="2" />
      <line x1="36" y1="62" x2="36" y2="68" stroke="#1a1a1a" strokeWidth="2" />
      <line x1="4" y1="36" x2="10" y2="36" stroke="#1a1a1a" strokeWidth="2" />
      <line x1="62" y1="36" x2="68" y2="36" stroke="#1a1a1a" strokeWidth="2" />
      <line x1="11" y1="15" x2="15" y2="19" stroke="#1a1a1a" strokeWidth="1" opacity="0.3" />
      <line x1="57" y1="15" x2="53" y2="19" stroke="#1a1a1a" strokeWidth="1" opacity="0.3" />
      <line x1="11" y1="57" x2="15" y2="53" stroke="#1a1a1a" strokeWidth="1" opacity="0.3" />
      <line x1="57" y1="57" x2="53" y2="53" stroke="#1a1a1a" strokeWidth="1" opacity="0.3" />
      <text
        x="36"
        y="9"
        fontFamily="'Nunito',sans-serif"
        fontSize="7"
        fontWeight="700"
        fill="#1a1a1a"
        textAnchor="middle"
      >
        N
      </text>
      <g className={needleClass}>
        <path d="M36,12 L30,33 L36,28 L42,33 Z" fill="#2e7d32" />
        <line x1="36" y1="16" x2="36" y2="28" stroke="#1a1a1a" strokeWidth="0.8" />
        <circle cx="36" cy="14" r="2.5" fill="#2e7d32" />
        <path d="M36,60 L30,39 L36,44 L42,39 Z" fill="#1a1a1a" opacity="0.5" />
      </g>
      <circle cx="36" cy="36" r="4.5" fill="#1a1a1a" />
      <circle cx="36" cy="36" r="2.2" fill="#2e7d32" />
    </svg>
  );
}
