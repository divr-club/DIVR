"use client";

import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function Navbar() {
  const router = useRouter();

  async function handleLogout() {
    await supabase.auth.signOut();

    router.push("/login");
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px",
        background: "#102033",
        borderRadius: "12px",
        marginBottom: "24px",
      }}
    >
      <h2>DIVR 🌊</h2>

      <button
        onClick={handleLogout}
        style={{
          padding: "10px 16px",
          background: "#ef4444",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        Logout
      </button>
    </div>
  );
}
