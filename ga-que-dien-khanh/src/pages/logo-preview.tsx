export default function LogoPreview() {
  const variants = [
    { id: "xanh",  bg: "#214830", topColor: "#F7F2E8", lineColor: "#F7F2E8" },
    { id: "trang", bg: "#FFFFFF", topColor: "#214830", lineColor: "#214830" },
    { id: "toi",   bg: "#1A1A1A", topColor: "#F7F2E8", lineColor: "#F7F2E8" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {variants.map((v) => (
        <div
          key={v.id}
          id={`logo-${v.id}`}
          style={{
            width: 1200,
            height: 500,
            background: v.bg,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 0,
            overflow: "visible",
          }}
        >
          <div
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontWeight: 700,
              fontSize: 196,
              letterSpacing: "-3px",
              lineHeight: 1.1,
              color: v.topColor,
              overflow: "visible",
              textRendering: "optimizeLegibility",
            }}
          >
            Gà Quê
          </div>
          <div
            style={{
              width: 660,
              height: 2,
              background: v.lineColor,
              opacity: 0.28,
              borderRadius: 999,
              margin: "10px 0 14px",
            }}
          />
          <div
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontWeight: 700,
              fontSize: 108,
              letterSpacing: "-1px",
              lineHeight: 1,
              color: "#E98D0C",
            }}
          >
            Diên Khánh
          </div>
        </div>
      ))}
    </div>
  );
}
