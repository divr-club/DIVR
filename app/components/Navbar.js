"use client";

import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

export default function Navbar() {

  const router = useRouter();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",

        padding: "18px 28px",

        background: "rgba(4, 18, 32, 0.72)",

        backdropFilter: "blur(18px)",

        border: "1px solid rgba(255,255,255,0.06)",

        borderRadius: "24px",

        marginBottom: "32px",

        boxShadow: "0 0 40px rgba(0,255,200,0.08)",
      }}
    >

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <div
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "50%",
            background: "#22d3ee",

            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            color: "#02131f",
            fontWeight: "bold",

            boxShadow: "0 0 18px rgba(34,211,238,0.45)"
          }}
        >
          ≋
        </div>

        <div>
          <div
            style={{
              fontSize: "28px",
              fontWeight: "800",
              letterSpacing: "0.08em",
            }}
          >
            DIVR
          </div>

          <div
            style={{
              fontSize: "11px",
              opacity: 0.55,
              marginTop: "-2px",
              letterSpacing: "0.18em",
            }}
          >
            EXPLORE • DIVE • CONNECT
          </div>
        </div>
      </div>

      <button
        onClick={handleLogout}
        style={{
          padding: "12px 22px",

          background: "rgba(34,211,238,0.12)",

          color: "#67e8f9",

          border: "1px solid rgba(34,211,238,0.25)",

          borderRadius: "14px",

          fontWeight: "600",

          cursor: "pointer",

          transition: "all 0.25s ease",

          boxShadow: "0 0 0 rgba(34,211,238,0)",
        }}

        onMouseEnter={(e) => {
          e.target.style.transform = "translateY(-2px)";
          e.target.style.boxShadow =
            "0 0 24px rgba(34,211,238,0.28)";
          e.target.style.background =
            "rgba(34,211,238,0.18)";
        }}

        onMouseLeave={(e) => {
          e.target.style.transform = "translateY(0px)";
          e.target.style.boxShadow =
            "0 0 0 rgba(34,211,238,0)";
          e.target.style.background =
            "rgba(34,211,238,0.12)";
        }}
      >
        Logout
      </button>
    </nav>
  );
}
