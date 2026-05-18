"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import Navbar from "./components/Navbar";
import Link from "next/link";

export default function HomePage() {
  const [profile, setProfile] = useState<any>(null);
  const [upcomingDive, setUpcomingDive] = useState<any>(null);
  const [speciesCount, setSpeciesCount] = useState(0);
  const [loggedDiveCount, setLoggedDiveCount] = useState(0);

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

    // UPCOMING DIVE
    const { data: upcomingDiveData } = await supabase
      .from("dives")
      .select("*")
      .gte("date", new Date().toISOString())
      .order("date", { ascending: true })
      .limit(1)
      .single();

    setUpcomingDive(upcomingDiveData);

    // SPECIES COUNT
    const { count: speciesFound } = await supabase
      .from("user_species")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    setSpeciesCount(speciesFound || 0);

    // LOGGED DIVES COUNT
    const { count: loggedDives } = await supabase
      .from("logged_dives")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    setLoggedDiveCount(loggedDives || 0);
  }

  return (
    <div className="home-page">
      <Navbar />

      <div className="home-wrapper">

        {/* HERO */}
        <div className="home-hero">
          <h1>
            Welcome back, {profile?.username || "Diver"} 🌊
          </h1>

          <p>
            Keep diving. The reef remembers who returns.
          </p>
        </div>

        {/* STATS */}
        <div className="home-stats-grid">

          <div className="home-stat-card">
            <h2>{loggedDiveCount}</h2>
            <p>Total Dives</p>
          </div>

          <div className="home-stat-card">
            <h2>{speciesCount}</h2>
            <p>Species Found</p>
          </div>

          <div className="home-stat-card">
            <h2>
              {profile?.certification || "Hobby"}
            </h2>
            <p>Certification</p>
          </div>

        </div>

        {/* UPCOMING DIVE */}
        <div className="home-section">

          <div className="section-header">
            <h2>Upcoming Dive</h2>

            <Link href="/dives">
              <button className="view-all-btn">
                View All
              </button>
            </Link>
          </div>

          {upcomingDive ? (
            <Link href={`/dives/${upcomingDive.id}`}>

              <div className="upcoming-dive-card">

                <div className="upcoming-dive-top">
                  <span className="dive-type-badge">
                    {upcomingDive.type || "Reef"}
                  </span>
                </div>

                <h3>{upcomingDive.title}</h3>

                <p className="dive-location">
                  📍 {upcomingDive.location}
                </p>

                <p className="dive-date">
                  {new Date(upcomingDive.date).toLocaleString(
                    "en-GB",
                    {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                </p>

              </div>

            </Link>
          ) : (
            <div className="empty-home-card">
              <p>No upcoming dives yet.</p>

              <Link href="/dives">
                <button className="create-dive-btn">
                  Explore Dives
                </button>
              </Link>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
