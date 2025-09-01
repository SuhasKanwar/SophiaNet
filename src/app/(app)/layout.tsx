import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <main className="antialiased text-white min-h-screen flex flex-col bg-gradient-to-b from-black via-black to-[#0f0f17]">
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
      </main>
  );
}