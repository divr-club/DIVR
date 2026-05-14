"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [username, setUsername] = useState("Diver");

  useEffect(() => {
    getUser();
  }, []);

  async function getUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data: profile } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", user.id)
      .single();

    if (profile?.username) {
      setUsername(profile.username);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();

    router.push("/login");
  }

  return (
    <nav className="navbar">
      {/* LEFT */}
     <div className="nav-left">
  <div className="text-logo">
    DIVR
  </div>
</div>
      </div>

      {/* CENTER */}
      <div className="nav-links">
        <button
          className={`nav-link ${
            pathname === "/home" ? "active" : ""
          }`}
          onClick={() => router.push("/home")}
        >
          Home
        </button>

        <button
          className={`nav-link ${
            pathname === "/dives" ? "active" : ""
          }`}
          onClick={() => router.push("/dives")}
        >
          Dives
        </button>

        <button
          className={`nav-link ${
            pathname === "/profile" ? "active" : ""
          }`}
          onClick={() => router.push("/profile")}
        >
          Profile
        </button>

        <button
          className={`nav-link ${
            pathname === "/divrdex" ? "active" : ""
          }`}
          onClick={() => router.push("/divrdex")}
        >
          Divr-dex
        </button>
      </div>

      {/* RIGHT */}
      <div className="nav-right">
        <div
          className="navbar-profile"
          onClick={() => router.push("/profile")}
        >
          <div className="navbar-avatar">
            {username.charAt(0).toUpperCase()}
          </div>

          <div className="navbar-user-info">
            <span>{username}</span>
            <small>View Profile</small>
          </div>
        </div>

        <button
          className="logout-link"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
