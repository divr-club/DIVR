"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import Navbar from "../components/Navbar";

export default function HomePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkUser() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
      } else {
        setLoading(false);
      }
    }

    checkUser();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#07111f",
          color: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "Arial",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#07111f",
        color: "white",
        padding: "24px",
        fontFamily: "Arial",
      }}
    >
      <Navbar />

      <h1>Welcome to DIVR 🌊</h1>

      <p>Your dives will appear here.</p>

      <div
        style={{
          marginTop: "24px",
          padding: "20px",
          background: "#102033",
          borderRadius: "16px",
        }}
      >
        <h2>Upcoming Dives</h2>

        <p>No dives yet.</p>
      </div>
    </div>
  );
}
