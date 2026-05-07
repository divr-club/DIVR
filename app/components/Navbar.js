"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function Navbar() {
  const router = useRouter();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "16px 24px",
      background: "#102033",
      borderBottom: "1px solid #1e3a5f"
    }}>
      <div style={{
        display: "flex",
        gap: "16px"
      }}>
        <Link href="/home" style={{ color: "white" }}>
          Home
        </Link>

        <Link href="/dives" style={{ color: "white" }}>
          Dives
        </Link>

        <Link href="/divrdex" style={{ color: "white" }}>
          Divr-dex
        </Link>
      </div>

      <button
        onClick={handleLogout}
        style={{
          background: "#0ea5a4",
          color: "white",
          border: "none",
          padding: "8px 12px",
          borderRadius: "8px"
        }}
      >
        Logout
      </button>
    </div>
  );
}
