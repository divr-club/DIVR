"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";
import Navbar from "./components/Navbar";

export default function HomePage() {
  const router = useRouter();

  const [profile, setProfile] = useState<any>(null);
  const [latestDive, setLatestDive] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHome();
  }, []);

  async function loadHome() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    // PROFILE
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    setProfile(profileData);

    // LATEST UPCOMING DIVE
    const today = new Date().toISOString();

    const { data: diveData } = await supabase
      .from("dives")
      .select("*")
      .gte("date", today)
      .order("date", { ascending: true })
      .limit(1)
      .single();

    setLatestDive(diveData);

    setLoading(false);
  }

  if (loading) {
    return (
      <div className="home-page">
        <Navbar />
      </div>
    );
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
            <h2>{profile?.dives_logged || 0}</h2>
            <p>Total Dives</p>
          </div>

          <div className="home-stat-card">
            <h2>{profile?.species_count || 0}</h2>
            <p>Species Found</p>
          </div>

          <div className="home-stat-card">
            <h2>{profile?.certification || "Hobby"}</h2>
            <p>Certification</p>
          </div>

        </div>

        {/* UPCOMING DIVE */}
        <div className="home-section">

          <div className="section-header">
            <h2>Upcoming Dive</h2>

            <button
              className="view-all-btn"
              onClick={() => router.push("/dives")}
            >
              View All
            </button>
          </div>

          {latestDive ? (
            <div
              className="upcoming-dive-card"
              onClick={() => router.push(`/dives/${latestDive.id}`)}
            >

              <div className="upcoming-dive-top">

                <span className="dive-type-badge">
                  {latestDive.type || "Reef"}
                </span>

                <span>
                  {latestDive.spots} spots
                </span>

              </div>

              <h3>{latestDive.title}</h3>

              <div className="dive-location">
                📍 {latestDive.location}
              </div>

              <div className="dive-date">
                {new Date(latestDive.date).toLocaleString("en-GB", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>

            </div>
          ) : (
            <div className="empty-home-card">

              <p>
                No upcoming dives yet.
              </p>

              <button
                className="create-dive-btn"
                onClick={() => router.push("/dives")}
              >
                Create a Dive
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
