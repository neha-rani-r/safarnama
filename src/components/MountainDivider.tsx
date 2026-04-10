export default function MountainDivider({
  animated = true,
  opacity = 0.28,
  marginBottom = 24,
}: {
  animated?: boolean;
  opacity?: number;
  marginBottom?: number;
}) {
  return (
    <div style={{ marginBottom, opacity }}>
      <svg
        width="100%"
        height="28"
        viewBox="0 0 400 28"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,22 Q25,22 35,14 Q45,6 55,14 Q62,19 70,16 Q78,12 85,6 Q93,0 100,6 Q107,12 115,8 Q123,4 130,8 Q140,14 150,10 Q157,7 165,10 Q175,14 185,8 Q192,4 200,8 Q210,12 218,6 Q225,0 233,6 Q240,12 248,16 Q255,19 263,14 Q273,6 283,14 Q293,22 318,22 Q340,22 360,18 Q375,15 400,22"
          fill="none"
          stroke="#2e7d32"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray={animated ? 1200 : undefined}
          style={animated ? { animation: 'drawLine 2.5s ease forwards' } : undefined}
        />
      </svg>
    </div>
  );
}
