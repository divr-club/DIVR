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

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    setProfile(data);

    setLoading(false);
  }

  if (loading) {
    return (
      <div className="profile-page">
        <Navbar />
      </div>
    );
  }

  return (
    <div className="profile-page">

      <Navbar />

      <div className="profile-container">

        <div className="profile-hero-card">

          <div className="profile-hero-top">

            <div className="profile-avatar-large">
              {profile?.username?.charAt(0).toUpperCase() || "D"}
            </div>

            <div>

              <h1>
                {profile?.username || "Diver"}
              </h1>

              <p>
                {profile?.home_location || "Unknown waters"}
              </p>

            </div>

          </div>

          <div className="profile-bio-modern">

            {profile?.bio ||
              "No bio added yet."}

          </div>

        </div>

        <div className="profile-stats-grid">

          <div className="profile-modern-stat">

            <h2>
              {profile?.total_logged_dives || 0}
            </h2>

            <span>Total Dives</span>

          </div>

          <div className="profile-modern-stat">

            <h2>
              {profile?.species_count || 0}
            </h2>

            <span>Species Found</span>

          </div>

          <div className="profile-modern-stat">

            <h2>
              {profile?.certification || "Open Water"}
            </h2>

            <span>Certification</span>

          </div>

        </div>

        <div className="profile-info-card">

          <h3>Diver Details</h3>

          <div className="profile-info-row">
            <span>WhatsApp</span>
            <strong>
              {profile?.whatsapp || "Not added"}
            </strong>
          </div>

          <div className="profile-info-row">
            <span>Location</span>
            <strong>
              {profile?.home_location || "Unknown"}
            </strong>
          </div>

        </div>

      </div>

    </div>
  );
}
