"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import Navbar from "../components/Navbar";

export default function CreateDivePage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [spots, setSpots] = useState("");
  const [depth, setDepth] = useState("");
  const [diveType, setDiveType] = useState("");

  const [selectedDate, setSelectedDate] = useState("");

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
        date: selectedDate,
        spots: Number(spots),
        depth: Number(depth),
        dive_type: diveType,
      },
    ]);

    if (error) {
      alert(error.message);
      return;
    }

    router.push("/dives");
  }

  return (
    <div className="create-dive-page">
      <Navbar />

      <div className="create-dive-wrapper">
        <form className="create-dive-card" onSubmit={handleCreateDive}>
          <h1>Create Dive</h1>

          <p className="create-subtext">
            Plan your next underwater adventure.
          </p>

          <input
            className="auth-input"
            type="text"
            placeholder="Dive Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <input
            className="auth-input"
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />

          <input
            className="auth-input"
            type="datetime-local"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            required
          />

          <input
            className="auth-input"
            type="number"
            placeholder="Available Spots"
            value={spots}
            onChange={(e) => setSpots(e.target.value)}
            required
          />

          <input
            className="auth-input"
            type="number"
            placeholder="Depth (meters)"
            value={depth}
            onChange={(e) => setDepth(e.target.value)}
          />

          <input
            className="auth-input"
            type="text"
            placeholder="Dive Type (Reef, Wreck, Night...)"
            value={diveType}
            onChange={(e) => setDiveType(e.target.value)}
          />

          <button type="submit" className="auth-button">
            Create Dive
          </button>
        </form>
      </div>
    </div>
  );
}
