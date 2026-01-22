export default function AEinboxLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{
      backgroundColor: "#0b0f14",
      color: "#e6eaf0",
      minHeight: "100vh"
    }}>
      {children}
    </div>
  );
}
