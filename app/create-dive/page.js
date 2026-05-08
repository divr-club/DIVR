"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function CreateDivePage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [diveType, setDiveType] = useState("");
  const [date, setDate] = useState("");
  const [spots, setSpots] = useState("");

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      router.push("/login");
    }
  }

  async function handleCreateDive(e) {
    e.preventDefault();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase.from("dives").insert([
      {
        host_id: user.id,
        title,
        location,
        dive_type: diveType,
        date,
        spots: Number(spots),
      },
    ]);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Dive created 🌊");
    router.push("/home");
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="logo-text">Create Dive</h1>

        <p className="subtitle">
          Plan your next underwater adventure.
        </p>

        <form onSubmit={handleCreateDive} className="auth-form">
          <input
            type="text"
            placeholder="Dive Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Dive Type (Reef, Wreck, Open Water)"
            value={diveType}
            onChange={(e) => setDiveType(e.target.value)}
            required
          />

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />

          <input
            type="number"
            placeholder="Available Spots"
            value={spots}
            onChange={(e) => setSpots(e.target.value)}
            required
          />

          <button type="submit">
            Create Dive
          </button>
        </form>
      </div>
    </div>
  );
}
