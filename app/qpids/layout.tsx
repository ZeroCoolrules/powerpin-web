import type { Metadata } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import "./qpids.css";
import Shell from "./Shell";

const body = DM_Sans({ subsets: ["latin"], variable: "--qp-font-body" });
const display = Fraunces({ subsets: ["latin"], variable: "--qp-font-display" });

export const metadata: Metadata = {
  title: "Qpids Place: meet someone worth meeting",
  description: "Qpids Place is a dating site for real connections: thoughtful matches, verified profiles, and chat that feels like talking.",
};

export default function QpidsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`qp ${body.variable} ${display.variable}`}>
      <Shell>{children}</Shell>
    </div>
  );
}
