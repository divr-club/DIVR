"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import Navbar from "../components/Navbar";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function CreateDivePage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [spots, setSpots] = useState("");
  const [depth, setDepth] = useState("");
  const [diveType, setDiveType] = useState("");

  const [selectedDate, setSelectedDate] = useState(new Date());

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

          <p className="create-dive-subtitle">
            Plan your next underwater adventure.
          </p>

          <div className="create-dive-grid">
            <input
              type="text"
              placeholder="Dive Title"
              className="auth-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Location"
              className="auth-input"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />

            <input
              type="number"
              placeholder="Available Spots"
              className="auth-input"
              value={spots}
              onChange={(e) => setSpots(e.target.value)}
              required
            />

            <input
              type="number"
              placeholder="Depth (meters)"
              className="auth-input"
              value={depth}
              onChange={(e) => setDepth(e.target.value)}
            />

            <input
              type="text"
              placeholder="Dive Type (Reef, Wreck, Night...)"
              className="auth-input full-width"
              value={diveType}
              onChange={(e) => setDiveType(e.target.value)}
            />

            <div className="full-width">
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="MMMM d, yyyy h:mm aa"
                className="auth-input"
                placeholderText="Select dive date & time"
              />
            </div>
          </div>

          <button type="submit" className="primary-button">
            Create Dive
          </button>
        </form>
      </div>
    </div>
  );
}
