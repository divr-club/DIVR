"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import Navbar from "../../components/Navbar";

export default function DiveDetailPage() {
  const params = useParams();

  const [dive, setDive] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    fetchDive();
  }, []);

  async function fetchDive() {
    const { data, error } = await supabase
      .from("dives")
      .select("*")
      .eq("id", params.id)
      .single();

    if (error) {
      console.log(error);
      return;
    }

    setDive(data);
    setLoading(false);
  }

  async function joinDive() {
    if (!dive) return;

    setJoining(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Please log in.");
      setJoining(false);
      return;
    }

    const { error } = await supabase
      .from("dive_participants")
      .insert({
        dive_id: dive.id,
        user_id: user.id,
      });

    if (error) {
      console.log(error);

      alert("Could not join dive.");

      setJoining(false);

      return;
    }

    alert("Joined dive 🌊");

    setJoining(false);
  }

  if (loading) {
    return (
      <div className="dives-page">
        <Navbar />

        <div className="dives-content">
          <p>Loading dive...</p>
        </div>
      </div>
    );
  }

  if (!dive) {
    return (
      <div className="dives-page">
        <Navbar />

        <div className="dives-content">
          <p>Dive not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dives-page">
      <Navbar />

      <div className="dive-detail-wrapper">
        <div className="dive-detail-card">
          <div className="dive-detail-top">
            <span className="dive-badge">
              {dive.dive_type || "Dive"}
            </span>

            <span className="spots-left">
              {dive.spots} spots
            </span>
          </div>

          <h1>{dive.title}</h1>

          <p className="dive-detail-location">
            📍 {dive.location}
          </p>

          <p className="dive-detail-date">
            {new Date(dive.date).toLocaleString()}
          </p>

          {dive.depth && (
            <div className="detail-row">
              <strong>Depth:</strong> {dive.depth}m
            </div>
          )}

          <button
            className="primary-button"
            onClick={joinDive}
            disabled={joining}
          >
            {joining ? "Joining..." : "Join Dive"}
          </button>
        </div>
      </div>
    </div>
  );
}
