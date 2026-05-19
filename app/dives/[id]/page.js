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
  const [user, setUser] = useState(null);

  const [species, setSpecies] = useState([]);
  const [selectedSpecies, setSelectedSpecies] = useState("");

  useEffect(() => {
    loadPage();
  }, []);

  async function loadPage() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    setUser(user);

    await fetchDive();

    const { data: speciesData } = await supabase
      .from("species")
      .select("*");

    setSpecies(speciesData || []);
  }

  async function fetchDive() {
    const { data } = await supabase
      .from("dives")
      .select("*")
      .eq("id", params.id)
      .single();

    setDive(data);

    const { data: participantData } = await supabase
      .from("dive_participants")
      .select(`
        *,
        profiles (
          username
        )
      `)
      .eq("dive_id", params.id);

    setParticipants(participantData || []);

    setLoading(false);
  }

  async function joinDive() {
    setJoining(true);

    const { error } = await supabase
      .from("dive_participants")
      .insert({
        dive_id: params.id,
        user_id: user.id,
      });

    if (!error) {
      const currentProfile = await supabase
        .from("profiles")
        .select("dives_count")
        .eq("id", user.id)
        .single();

      const currentCount =
        currentProfile.data?.dives_count || 0;

      await supabase
        .from("profiles")
        .update({
          dives_count: currentCount + 1,
        })
        .eq("id", user.id);

      await fetchDive();
    }

    setJoining(false);
  }

  async function logSpecies() {
    if (!selectedSpecies) return;

    const { error } = await supabase
      .from("user_species")
      .insert({
        user_id: user.id,
        species_id: selectedSpecies,
      });

    if (error) {
      alert(error.message);
      return;
    }

    const currentProfile = await supabase
      .from("profiles")
      .select("species_count")
      .eq("id", user.id)
      .single();

    const currentCount =
      currentProfile.data?.species_count || 0;

    await supabase
      .from("profiles")
      .update({
        species_count: currentCount + 1,
      })
      .eq("id", user.id);

    alert("Species logged 🐠");
  }

  if (loading || !dive) {
    return (
      <div className="dives-page">
        <Navbar />
      </div>
    );
  }

  const spotsLeft = dive.spots - participants.length;

  const alreadyJoined = participants.some(
    (p) => p.user_id === user?.id
  );

  return (
  <div className="dive-detail-page">

    <Navbar />

    <div className="dive-detail-container">

      {/* MAIN DIVE CARD */}
      <div className="dive-detail-card">

        <div className="dive-detail-top">

          <span className="dive-type-badge">
            {dive.type || "Reef"}
          </span>

          <span className="spots-left">
            {spotsLeft} spots left
          </span>

        </div>

        <h1>{dive.title}</h1>

        <div className="dive-meta">
          📍 {dive.location}
        </div>

        <div className="dive-meta">
          📅 {new Date(dive.date).toLocaleString(
            "en-GB",
            {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }
          )}
        </div>

        <button
          className="join-dive-btn"
          onClick={joinDive}
          disabled={joining || alreadyJoined}
        >
          {alreadyJoined
            ? "Joined ✓"
            : joining
            ? "Joining..."
            : "Join Dive"}
        </button>

      </div>

      {/* SPECIES LOGGER */}
      <div className="dive-sub-card">

        <h2>Log Species</h2>

        <div className="species-logger">

          <select
            value={selectedSpecies}
            onChange={(e) =>
              setSelectedSpecies(e.target.value)
            }
            className="species-select"
          >

            <option value="">
              Select species
            </option>

            {species.map((fish) => (

              <option
                key={fish.id}
                value={fish.id}
              >
                {fish.name}
              </option>

            ))}

          </select>

          <button
            className="save-species-btn"
            onClick={logSpecies}
          >
            Log Species
          </button>

        </div>

      </div>

      {/* PARTICIPANTS */}
      <div className="dive-sub-card">

        <h2>Divers Joining</h2>

        {participants.length === 0 ? (

          <p className="empty-participants">
            No divers joined yet.
          </p>

        ) : (

          <div className="participants-grid">

            {participants.map((p) => (

              <div
                key={p.id}
                className="participant-card"
              >

                <div className="participant-avatar">
                  {p.profiles?.username?.charAt(0)?.toUpperCase() || "D"}
                </div>

                <span>
                  {p.profiles?.username || "Diver"}
                </span>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>

  </div>
);
}
