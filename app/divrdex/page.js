"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import Navbar from "../components/Navbar";

export default function DivrDexPage() {
  const [species, setSpecies] = useState([]);
  const [userSpecies, setUserSpecies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDex();
  }, []);

  async function loadDex() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data: speciesData } = await supabase
      .from("species")
      .select("*")
      .order("rarity", { ascending: true });

    const { data: unlockedData } = await supabase
      .from("user_species")
      .select("*")
      .eq("user_id", user.id);

    setSpecies(speciesData || []);
    setUserSpecies(unlockedData || []);

    setLoading(false);
  }

  function isUnlocked(speciesId) {
    return userSpecies.some((s) => s.species_id === speciesId);
  }

  if (loading) {
    return (
      <div className="dives-page">
        <Navbar />
      </div>
    );
  }

  return (
    <div className="dives-page">
      <Navbar />

      <div className="divrdex-wrapper">

        <div className="divrdex-header">
          <h1>Divr-Dex</h1>
          <p>
            Discover species. Log dives. Unlock the ocean.
          </p>
        </div>

        <div className="species-grid">

          {species.map((fish) => {
            const unlocked = isUnlocked(fish.id);

            return (
              <div
                key={fish.id}
                className={`species-card ${
                  unlocked ? "unlocked" : "locked"
                }`}
              >
                <div className="species-image">
                  {unlocked ? "🐠" : "❓"}
                </div>

                <h2>
                  {unlocked ? fish.name : "Unknown Species"}
                </h2>

                <p>
                  {unlocked
                    ? fish.description
                    : "Log more dives to unlock"}
                </p>

                <span className="species-rarity">
                  {fish.rarity}
                </span>
              </div>
            );
          })}

        </div>
      </div>
    </div>
  );
}
