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
      <div className="nav-logo">
        DIVR 🌊
      </div>

      <button
        className="button"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
}
