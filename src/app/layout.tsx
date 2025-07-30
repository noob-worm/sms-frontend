"use client";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        // style={{
        //   minHeight: "100vh",
        //   margin: 0,
        //   padding: 0,
        //   backgroundImage:
        //     "url('https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=1500&q=80')",
        //   backgroundSize: "cover",
        //   backgroundPosition: "center",
        //   backgroundRepeat: "no-repeat",
        //   fontFamily: "Segoe UI, Arial, sans-serif",
        // }}
      >
        
        <div
          style={{
            minHeight: "100vh",
            width: "100vw",
            background: "rgba(255,255,255,0.25)",
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 0,
            pointerEvents: "none",
          }}
        />
        <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
      </body>
    </html>
  );
}