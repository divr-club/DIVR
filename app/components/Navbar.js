"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState(null);

  useEffect(() => {
    getUser();
  }, []);

  async function getUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    setUser(user);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <nav className="navbar">
      <div
        className="navbar-left"
        onClick={() => router.push("/home")}
        style={{ cursor: "pointer" }}
      >
        <img
          src="/divr-logo.png"
          alt="DIVR"
          className="navbar-logo"
        />
      </div>

      <div className="navbar-center">
        <button
          className={`nav-link ${
            pathname === "/home" ? "active-nav" : ""
          }`}
          onClick={() => router.push("/home")}
        >
          Home
        </button>

        <button
          className={`nav-link ${
            pathname === "/dives" ? "active-nav" : ""
          }`}
          onClick={() => router.push("/dives")}
        >
          Dives
        </button>

        <button
          className={`nav-link ${
            pathname === "/profile" ? "active-nav" : ""
          }`}
          onClick={() => router.push("/profile")}
        >
          Profile
        </button>

        <button
          className={`nav-link ${
            pathname === "/divrdex" ? "active-nav" : ""
          }`}
          onClick={() => router.push("/divrdex")}
        >
          Divr-dex
        </button>
      </div>

      <div className="navbar-right">
        <div
          className="navbar-profile"
          onClick={() => router.push("/profile")}
        >
          <div className="navbar-avatar">
            {user?.email?.charAt(0).toUpperCase() || "D"}
          </div>

          <div className="navbar-user-info">
            <span>
              {user?.email?.split("@")[0] || "Diver"}
            </span>

            <small>View Profile</small>
          </div>
        </div>

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
