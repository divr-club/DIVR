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
    <div className="navbar">

      <div className="nav-left">

        <div className="logo-circle">
          ≋
        </div>

        <div className="nav-brand">
          <div className="nav-title">
            DIVR
          </div>

          <div className="nav-subtitle">
            EXPLORE • DIVE • CONNECT
          </div>
        </div>

      </div>

      <button
        className="logout-button"
        onClick={handleLogout}
      >
        Logout
      </button>

    </div>
  );
}
