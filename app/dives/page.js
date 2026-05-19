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
    const { data: divesData, error: divesError } =
      await supabase
        .from("dives")
.select("*")
.gte("date", new Date().toISOString())
.order("date", { ascending: true });
    if (divesError) {
      console.error(divesError);
      setLoading(false);
      return;
    }

    const { data: participantsData } =
      await supabase
        .from("dive_participants")
        .select("*");

    const formatted = (divesData || []).map((dive) => {
      const participants =
        (participantsData || []).filter(
          (p) => p.dive_id === dive.id
        );

      return {
        ...dive,
        participants,
        spots_left: Math.max(
          (dive.spots || 0) - participants.length,
          0
        ),
      };
    });

    setDives(formatted);
    setLoading(false);
  }

  return (
    <div className="dives-page">

      <Navbar />

      <div className="dives-container">

        <div className="dives-header">

          <div>
            <h1>Upcoming Dives</h1>
            <p>
              Explore the reef with other divers.
            </p>
          </div>

          <button
            className="create-dive-btn"
            onClick={() => router.push("/create-dive")}
          >
            + Create Dive
          </button>

        </div>

        {loading ? (

          <div className="loading-text">
            Loading dives...
          </div>

        ) : dives.length === 0 ? (

          <div className="empty-dives-card">

            <h2>No dives yet</h2>

            <p>
              Create your first dive and start exploring.
            </p>

            <button
              className="create-dive-btn"
              onClick={() => router.push("/create-dive")}
            >
              Create Dive
            </button>

          </div>

        ) : (

          <div className="dives-grid">

            {dives.map((dive) => (

              <div
                key={dive.id}
                className="modern-dive-card"
                onClick={() => router.push(`/dives/${dive.id}`)}
              >

                <div className="modern-dive-top">

                  <span className="dive-type-badge">
                    {dive.type || "Reef"}
                  </span>

                  <span className="spots-left">
                    {dive.spots_left} spots left
                  </span>

                </div>

                <h2>{dive.title}</h2>

                <div className="modern-dive-location">
                  📍 {dive.location}
                </div>

                <div className="modern-dive-date">
                  {new Date(dive.date).toLocaleDateString(
                    "en-GB",
                    {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    }
                  )}
                </div>

                <div className="participants-row">

                  {dive.participants
                    .slice(0, 5)
                    .map((participant, index) => (

                      <div
                        key={index}
                        className="participant-pill"
                      >
                        Diver
                      </div>

                  ))}

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}
