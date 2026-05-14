"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import Navbar from "../../components/Navbar";

export default function DiveDetailsPage() {
  const params = useParams();

  const [dive, setDive] = useState(null);

  const [participants, setParticipants] = useState([]);

  const [species, setSpecies] = useState([]);

  const [selectedSpecies, setSelectedSpecies] = useState([]);

  const [loading, setLoading] = useState(true);

  const [joining, setJoining] = useState(false);

  const [savingSpecies, setSavingSpecies] = useState(false);

  const [user, setUser] = useState(null);

  useEffect(() => {
    loadPage();
  }, []);

  async function loadPage() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    setUser(user);

    await fetchDive();

    await fetchSpecies();
  }

  async function fetchDive() {
    const { data } = await supabase
      .from("dives")
      .select(`
  *,
  profiles (
    username
  )
`)
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

  async function fetchSpecies() {
    const { data } = await supabase
      .from("species")
      .select("*")
      .order("name");

    setSpecies(data || []);
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
      await fetchDive();
    }

    setJoining(false);
  }

  function toggleSpecies(speciesId) {
    if (selectedSpecies.includes(speciesId)) {
      setSelectedSpecies(
        selectedSpecies.filter((id) => id !== speciesId)
      );
    } else {
      setSelectedSpecies([
        ...selectedSpecies,
        speciesId,
      ]);
    }
  }

  async function saveSpecies() {
    if (!user) return;

    setSavingSpecies(true);

    const inserts = selectedSpecies.map((speciesId) => ({
      user_id: user.id,
      species_id: speciesId,
      dive_id: params.id,
    }));

    const { error } = await supabase
      .from("user_species")
      .insert(inserts);

    if (!error) {
      alert("Species logged successfully.");
    }

    setSavingSpecies(false);
  }

  if (loading || !dive) {
    return (
      <div className="dives-page">
        <Navbar />
      </div>
    );
  }

  const spotsLeft =
    dive.spots - participants.length;

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
            {new Date(dive.date).toLocaleString(
              "en-GB",
              {
                weekday: "short",
                day: "numeric",
                month: "short",
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

          <div className="participants-list">
            {participants.map((p) => (
              <div
                key={p.id}
                className="participant-chip"
              >
                Diver
              </div>
            ))}
          </div>

          {/* SPECIES LOGGING */}

          <div className="species-log-section">

            <h2>Species Spotted</h2>

            <div className="species-grid">

              {species.map((item) => (

                <button
                  key={item.id}
                  className={`species-pill ${
                    selectedSpecies.includes(item.id)
                      ? "selected-species"
                      : ""
                  }`}
                  onClick={() =>
                    toggleSpecies(item.id)
                  }
                >
                  {item.name}
                </button>

              ))}

            </div>

            <button
              className="save-species-btn"
              onClick={saveSpecies}
              disabled={
                savingSpecies ||
                selectedSpecies.length === 0
              }
            >
              {savingSpecies
                ? "Saving..."
                : "Log Species"}
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}
