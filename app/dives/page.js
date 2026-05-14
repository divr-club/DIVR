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

    // GET DIVES
    const { data: divesData, error: divesError } =
      await supabase
        .from("dives")
        .select("*")
        .order("date", { ascending: true });

    if (divesError) {
      console.error(divesError);
      setLoading(false);
      return;
    }

    // GET PARTICIPANTS
    const { data: participantsData, error: participantsError } =
      await supabase
        .from("dive_participants")
        .select("*");

    if (participantsError) {
      console.error(participantsError);
    }

    const formatted = (divesData || []).map((dive) => {

      const participants =
        (participantsData || []).filter(
          (p) => p.dive_id === dive.id
        );

      return {
        ...dive,
        participants,
        spots_left:
          Math.max(
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

                  <span className="dive-type-badge">
                    {dive.type || "Reef"}
                  </span>

                  <span className="dive-spots">
                    {dive.spots_left} spots left
                  </span>

                </div>

                <h2>{dive.title}</h2>

                <div className="dive-location">
                  📍 {dive.location}
                </div>

                <div className="dive-date">
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

                {dive.participants.length > 0 && (

                  <div className="dive-participants-preview">

                    {dive.participants
                      .slice(0, 5)
                      .map((participant, index) => (

                        <div
                          key={index}
                          className="participant-bubble"
                        >
                          Diver
                        </div>

                    ))}

                  </div>

                )}

              </div>

            ))}

          </div>

        )}

      </div>
    </div>
  );
}
