"use client";

import { useRouter, usePathname } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <div className="navbar">
      <div className="nav-left">
        <div className="logo-circle">≋</div>
        <div className="nav-brand">
          <div className="nav-title">DIVR</div>
          <div className="nav-subtitle">EXPLORE • DIVE • CONNECT</div>
        </div>
      </div>

      <div className="nav-links">
        <a href="/home"    className={`nav-link${pathname === "/home"    ? " active" : ""}`}>Home</a>
        <a href="/dives"   className={`nav-link${pathname === "/dives"   ? " active" : ""}`}>Dives</a>
        <a href="/divrdex" className={`nav-link${pathname === "/divrdex" ? " active" : ""}`}>Divr-dex</a>
      </div>

      <button className="logout-button" onClick={handleLogout}>Logout</button>
    </div>
  );
}
