"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import Navbar from "../components/Navbar";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    console.log("PROFILE:", data);
    console.log("ERROR:", error);

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    setProfile(data);
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="dives-page">
        <Navbar />

        <div className="dives-content">
          <p
            style={{
              color: "#22d3ee",
              fontSize: "15px",
              letterSpacing: "0.08em",
            }}
          >
            Surfacing diver profile...
          </p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="dives-page">
        <Navbar />

        <div className="dives-content">
          <p style={{ color: "white" }}>
            No profile found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="dives-page">
      <Navbar />

      <div className="dives-content">
        <div className="glass-card profile-card">
          <div className="profile-header">
            <div className="profile-avatar">
              {profile.username?.charAt(0).toUpperCase()}
            </div>

            <div>
              <h1>
                {profile.username || "Unknown Diver"}
              </h1>

              <p className="profile-location">
                {profile.home_location || "Unknown waters"}
              </p>
            </div>
          </div>

          <p className="profile-bio">
            {profile.bio || "No bio added yet."}
          </p>

          <div className="profile-stats">
            <div className="profile-stat">
              <span>
                {profile.dives_completed || 0}
              </span>
              <p>Dives</p>
            </div>

            <div className="profile-stat">
              <span>
                {profile.species_unlocked || 0}
              </span>
              <p>Species</p>
            </div>

            <div className="profile-stat">
              <span>
                {profile.certifications?.length || 0}
              </span>
              <p>Certifications</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
