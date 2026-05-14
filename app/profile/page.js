"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import Navbar from "../components/Navbar";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    setProfile(data);
  }

  if (!profile) {
    return (
      <div className="dives-page">
        <Navbar />
        <div className="dives-content">
          <p>Loading profile...</p>
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
              <h1>{profile.username}</h1>

              <p className="profile-location">
                {profile.home_location || "Unknown waters"}
              </p>
            </div>
          </div>

          <p className="profile-bio">
            {profile.bio || "No bio yet."}
          </p>

          <div className="profile-stats">
            <div className="profile-stat">
              <span>{profile.dives_completed}</span>
              <p>Dives</p>
            </div>

            <div className="profile-stat">
              <span>{profile.species_unlocked}</span>
              <p>Species</p>
            </div>

            <div className="profile-stat">
              <span>
                {profile.certifications?.length || 0}
              </span>
              <p>Certs</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
