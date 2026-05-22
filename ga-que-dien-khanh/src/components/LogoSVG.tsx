interface LogoSVGProps {
  light?: boolean;
  className?: string;
}

export default function LogoSVG({ light = false, className = "" }: LogoSVGProps) {
  const topColor = light ? "#F7F2E8" : "#214830";
  const lineColor = light ? "#F7F2E8" : "#214830";

  return (
    <svg
      viewBox="0 0 280 110"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Gà Quê Diên Khánh"
    >
      <text
        x="140" y="58"
        textAnchor="middle"
        fill={topColor}
        fontSize="58"
        fontFamily="'Cormorant Garamond', Georgia, serif"
        fontWeight="700"
        letterSpacing="-1"
      >
        Gà Quê
      </text>
      <path
        d="M 42 68 Q 140 78 238 68"
        stroke={lineColor}
        strokeWidth="0.7"
        fill="none"
        opacity="0.35"
      />
      <text
        x="140" y="100"
        textAnchor="middle"
        fill="#E98D0C"
        fontSize="34"
        fontFamily="'Cormorant Garamond', Georgia, serif"
        fontWeight="700"
        letterSpacing="-0.5"
      >
        Diên Khánh
      </text>
    </svg>
  );
}
