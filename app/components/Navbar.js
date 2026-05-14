"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [username, setUsername] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", user.id)
      .single();

    if (data) {
      setUsername(data.username);
    }
  }

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
          <div className="nav-subtitle">
            EXPLORE • DIVE • CONNECT
          </div>
        </div>
      </div>

      <div className="nav-links">
        <a
          href="/home"
          className={`nav-link${pathname === "/home" ? " active" : ""}`}
        >
          Home
        </a>

        <a
          href="/dives"
          className={`nav-link${pathname === "/dives" ? " active" : ""}`}
        >
          Dives
        </a>
<button
  className="nav-link"
  onClick={() => router.push("/profile")}
>
  Profile
</button>
        <a
          href="/divrdex"
          className={`nav-link${pathname === "/divrdex" ? " active" : ""}`}
        >
          Divr-dex
        </a>
      </div>

      <div className="nav-profile">
        <div className="profile-avatar">
          {username?.charAt(0)?.toUpperCase() || "D"}
        </div>

        <div className="profile-meta">
          <div className="profile-name">
            {username || "Diver"}
          </div>

          <button
            className="logout-link"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
