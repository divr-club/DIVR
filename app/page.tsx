"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabase";
import Navbar from "./components/Navbar";

export default function HomePage() {
  const [profile, setProfile] = useState<any>(null);
  const [latestDive, setLatestDive] = useState<any>(null);

  const [totalDives, setTotalDives] = useState(0);
  const [speciesCount, setSpeciesCount] = useState(0);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHome();
  }, []);

  async function loadHome() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    // PROFILE
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    setProfile(profileData);

    // TOTAL LOGGED DIVES
    const { count: divesCount } = await supabase
      .from("logged_dives")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("user_id", user.id);

    setTotalDives(divesCount || 0);

    // TOTAL SPECIES
    const { count: speciesFound } = await supabase
      .from("user_species")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("user_id", user.id);

    setSpeciesCount(speciesFound || 0);

    // MOST RECENT DIVE
    const { data: latestDiveData } = await supabase
      .from("logged_dives")
      .select("*")
      .eq("user_id", user.id)
      .order("date", { ascending: false })
      .limit(1)
      .single();

    setLatestDive(latestDiveData);

    setLoading(false);
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

      <div className="home-wrapper">

        <div className="hero-section">

          <h1>
            Welcome back, {profile?.username || "Diver"} 🌊
          </h1>

          <p>
            Keep diving. The reef remembers who returns.
          </p>

          <Link href="/log-dive">
            <button className="create-dive-btn">
              + Log Dive
            </button>
          </Link>

        </div>

        <div className="stats-grid">

          <div className="stat-card">
            <h2>{totalDives}</h2>
            <p>Total Logged Dives</p>
          </div>

          <div className="stat-card">
            <h2>{speciesCount}</h2>
            <p>Species Found</p>
          </div>

          <div className="stat-card">
            <h2>
              {profile?.certification || "Hobby"}
            </h2>
            <p>Certification</p>
          </div>

        </div>

        <div className="recent-dive-section">

          <h2>Most Recent Dive</h2>

          {latestDive ? (

            <div className="dive-card">

              <h3>{latestDive.title}</h3>

              <p>
                📍 {latestDive.location}
              </p>

              <p>
                {new Date(latestDive.date).toLocaleDateString(
                  "en-GB",
                  {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  }
                )}
              </p>

              {latestDive.notes && (
                <p>{latestDive.notes}</p>
              )}

            </div>

          ) : (

            <div className="empty-state">
              No dives logged yet.
            </div>

          )}

        </div>

      </div>
    </div>
  );
}
