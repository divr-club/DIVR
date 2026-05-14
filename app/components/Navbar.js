"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [username, setUsername] = useState("Diver");

  useEffect(() => {
    getProfile();
  }, []);

  async function getProfile() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", user.id)
      .single();

    if (data?.username) {
      setUsername(data.username);
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
        <div
          className="text-logo"
          onClick={() => router.push("/home")}
        >
          DIVR
        </div>
      </div>

      {/* CENTER */}
      <div className="nav-links">
        <Link
          href="/home"
          className={pathname === "/home" ? "active-nav" : ""}
        >
          Home
        </Link>

        <Link
          href="/dives"
          className={pathname === "/dives" ? "active-nav" : ""}
        >
          Dives
        </Link>

        <Link
          href="/profile"
          className={pathname === "/profile" ? "active-nav" : ""}
        >
          Profile
        </Link>

        <Link
          href="/divrdex"
          className={pathname === "/divrdex" ? "active-nav" : ""}
        >
          Divr-dex
        </Link>
      </div>

      {/* RIGHT */}
      <div
        className="nav-profile"
        onClick={() => router.push("/profile")}
      >
        <div className="nav-avatar">
          {username.charAt(0).toUpperCase()}
        </div>

        <div className="nav-user-info">
          <span className="nav-username">
            {username}
          </span>

          <span className="nav-profile-link">
            View Profile
          </span>
        </div>

        <button
          className="logout-btn"
          onClick={(e) => {
            e.stopPropagation();
            handleLogout();
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
