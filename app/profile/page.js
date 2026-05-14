"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import Navbar from "../components/Navbar";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
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
      </div>
    );
  }

  return (
    <div className="dives-page">

      <Navbar />

      <div className="profile-wrapper">

        <div className="profile-card">

          <div className="profile-header">

            <div className="profile-avatar">
              {profile.username?.charAt(0).toUpperCase()}
            </div>

            <div>

              <h1>{profile.username}</h1>

              <p>{profile.home_location || "Unknown waters"}</p>

            </div>

          </div>

          <p className="profile-bio">
            {profile.bio || "No bio added yet."}
          </p>

          <div className="profile-details">

            <div className="profile-stat-card">
              <h2>{profile.total_logged_dives || 0}</h2>
              <span>Dives</span>
            </div>

            <div className="profile-stat-card">
              <h2>{profile.species_count || 0}</h2>
              <span>Species</span>
            </div>

            <div className="profile-stat-card">
              <h2>{profile.certification || "Hobby"}</h2>
              <span>Certification</span>
            </div>

          </div>

          <div className="profile-extra">

            <p>
              <strong>WhatsApp:</strong>{" "}
              {profile.whatsapp || "Not added"}
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}
