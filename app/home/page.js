"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import Navbar from "../components/Navbar";

export default function HomePage() {
  const router = useRouter();

  const [profile, setProfile] = useState(null);
  const [nextDive, setNextDive] = useState(null);

  useEffect(() => {
    loadHome();
  }, []);

  async function loadHome() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    setProfile(profileData);

    const { data: diveData } = await supabase
      .from("dives")
      .select("*")
      .order("date", { ascending: true })
      .limit(1)
      .single();

    setNextDive(diveData);
  }

  return (
    <div className="dives-page">

      <Navbar />

      <div className="home-wrapper">

        <div className="home-hero">

          <h1>
            Welcome back, {profile?.username || "Diver"} 🌊
          </h1>

          <p className="home-subtext">
            Keep diving. The reef remembers who returns.
          </p>

        </div>

        <div className="home-stats">

          <div className="profile-stat-card">
            <h2>{profile?.total_logged_dives || 0}</h2>
            <span>Total Dives</span>
          </div>

          <div className="profile-stat-card">
            <h2>{profile?.species_count || 0}</h2>
            <span>Species Found</span>
          </div>

          <div className="profile-stat-card">
            <h2>{profile?.certification || "Hobby"}</h2>
            <span>Certification</span>
          </div>

        </div>

        {nextDive && (
          <div
            className="next-dive-card"
            onClick={() => router.push(`/dives/${nextDive.id}`)}
          >

            <h2>Upcoming Dive</h2>

            <h1>{nextDive.title}</h1>

            <p>📍 {nextDive.location}</p>

            <span>
              {new Date(nextDive.date).toLocaleDateString("en-GB", {
                weekday: "short",
                day: "numeric",
                month: "short",
              })}
            </span>

          </div>
        )}

      </div>

    </div>
  );
}
