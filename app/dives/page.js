"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import Navbar from "../../components/Navbar";

export default function DiveDetailsPage() {
  const params = useParams();

  const [dive, setDive] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    fetchDive();
  }, []);

  async function fetchDive() {
    const { data } = await supabase
      .from("dives")
      .select("*")
      .eq("id", params.id)
      .single();

    setDive(data);

    const { data: participantData } = await supabase
      .from("dive_participants")
      .select("*")
      .eq("dive_id", params.id);

    setParticipants(participantData || []);

    setLoading(false);
  }

  async function joinDive() {
    setJoining(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase
      .from("dive_participants")
      .insert({
        dive_id: params.id,
        user_id: user.id,
      });

    if (!error) {
      alert("Joined dive 🌊");

      fetchDive();
    }

    setJoining(false);
  }

  if (loading || !dive) {
    return (
      <div className="dives-page">
        <Navbar />
      </div>
    );
  }

  const spotsLeft = dive.spots - participants.length;

  return (
    <div className="dives-page">
      <Navbar />

      <div className="dive-details-wrapper">
        <div className="dive-details-card">

          <div className="dive-top-row">
            <span className="dive-type-badge">
              {dive.type || "Reef"}
            </span>

            <span className="dive-spots">
              {spotsLeft} spots left
            </span>
          </div>

          <h1>{dive.title}</h1>

          <div className="dive-location">
            📍 {dive.location}
          </div>

          <div className="dive-date">
            {new Date(dive.date).toLocaleString("en-GB", {
              weekday: "short",
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>

          <button
            className="join-dive-btn"
            onClick={joinDive}
            disabled={joining}
          >
            {joining ? "Joining..." : "Join Dive"}
          </button>

          <div className="participants-list">
            {participants.map((p) => (
              <div key={p.id} className="participant-chip">
                Diver
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
