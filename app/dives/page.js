"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import Navbar from "../components/Navbar";

export default function DivesPage() {
  const router = useRouter();

  const [dives, setDives] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDives();
  }, []);

  async function fetchDives() {
    const { data } = await supabase
      .from("dives")
      .select("*")
      .order("date", { ascending: true });

    setDives(data || []);

    setLoading(false);
  }

  return (
    <div className="dives-page">
      <Navbar />

      <div className="dives-content">
        <div className="dives-header">
          <h1>Upcoming Dives</h1>

          <button
            className="create-dive-btn"
            onClick={() => router.push("/create-dive")}
          >
            + Create Dive
          </button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="dives-grid">
            {dives.map((dive) => (
              <div
                key={dive.id}
                className="dive-card"
                onClick={() => router.push(`/dives/${dive.id}`)}
              >
                <div className="dive-card-top">
                  <span className="dive-badge">
                    {dive.type || "Reef"}
                  </span>

                  <span className="dive-spots">
                    {dive.spots} spots
                  </span>
                </div>

                <h2>{dive.title}</h2>

                <div className="dive-card-location">
                  📍 {dive.location}
                </div>

                <div className="dive-card-date">
                  {new Date(dive.date).toLocaleDateString("en-GB", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
