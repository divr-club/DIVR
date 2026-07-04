"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import Navbar from "../components/Navbar";

export default function LogDivePage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);

  async function handleLogDive(e) {
    e.preventDefault();

    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from("logged_dives")
      .insert({
        user_id: user.id,
        title,
        location,
        date,
        notes,
      })
      .select()
      .single();

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    router.push(`/dives/${data.id}`);
  }

  return (
    <div className="dives-page">
      <Navbar />

      <div className="auth-wrapper">
        <div className="auth-card">

          <h1>Log Dive</h1>

          <form onSubmit={handleLogDive}>

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
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />

            <textarea
              placeholder="Dive Notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={5}
            />

            <button type="submit">
              {loading ? "Logging..." : "Log Dive"}
            </button>

          </form>

        </div>
      </div>
    </div>
  );
}
