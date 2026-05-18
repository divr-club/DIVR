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
            disabled={joining || alreadyJoined}
          >
            {alreadyJoined
              ? "Joined ✓"
              : joining
              ? "Joining..."
              : "Join Dive"}
          </button>

          <div className="species-logger">

            <h3>Log Species</h3>

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
              className="join-dive-btn"
              onClick={logSpecies}
            >
              Log Species
            </button>

          </div>

          <div className="participants-list">
            {participants.map((p) => (
              <div
                key={p.id}
                className="participant-chip"
              >
                {p.profiles?.username || "Diver"}
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
