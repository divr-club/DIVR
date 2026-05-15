"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import Navbar from "../components/Navbar";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
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

    setProfile(data);
    setLoading(false);
  }

  return (
    <div className="dives-page">

      <Navbar />

      <div className="profile-wrapper">

        {loading ? (
          <h2 style={{ color: "white" }}>
            Loading profile...
          </h2>
        ) : !profile ? (
          <h2 style={{ color: "white" }}>
            No profile found.
          </h2>
        ) : (
          <div className="profile-card">

            <div className="profile-header">

              <div className="profile-avatar">
                {profile.username?.charAt(0).toUpperCase() || "D"}
              </div>

              <div>

                <h1>
                  {profile.username || "Diver"}
                </h1>

                <p>
                  {profile.home_location || "Unknown waters"}
                </p>

              </div>

            </div>

            <p className="profile-bio">
              {profile.bio || "No bio added yet."}
            </p>

            <div className="profile-details">

              <div className="profile-stat-card">
                <h2>{profile.total_logged_dives || 0}</h2>
                <span>Total Dives</span>
              </div>

              <div className="profile-stat-card">
                <h2>{profile.species_count || 0}</h2>
                <span>Species Found</span>
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
        )}

      </div>

    </div>
  );
}
