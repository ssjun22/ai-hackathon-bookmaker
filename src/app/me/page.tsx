export default function MePage() {
  return (
    <main
      style={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--color-beige)",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <p style={{ fontSize: 40 }}>🐰</p>
        <p
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: "var(--color-brown)",
            marginTop: 12,
          }}
        >
          내 정보
        </p>
        <p
          style={{
            fontSize: 14,
            color: "var(--color-brown-soft)",
            marginTop: 6,
          }}
        >
          준비 중이에요!
        </p>
      </div>
    </main>
  );
}
