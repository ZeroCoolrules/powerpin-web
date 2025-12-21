import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-black text-green-400 transition-colors duration-300">
        {children}
      </body>
    </html>
  );
}
