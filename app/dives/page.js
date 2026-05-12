"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import Navbar from "../components/Navbar";

export default function DivesPage() {
  const router = useRouter();
  const [dives, setDives]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
    fetchDives();
  }, []);

  async function checkUser() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) router.push("/login");
  }

  async function fetchDives() {
    const { data, error } = await supabase
      .from("dives").select("*").order("date", { ascending: true });
    if (!error) setDives(data || []);
    setLoading(false);
  }

  return (
    <div className="dives-page">
      <Navbar />
      <div className="dives-content">
        <div className="dives-header">
          <h1>Upcoming Dives</h1>
          <button className="create-dive-btn" onClick={() => router.push("/create-dive")}>
            + Create Dive
          </button>
        </div>

        {loading ? (
          <p style={{ color: "rgba(34,211,238,0.4)", fontSize: "13px", letterSpacing: "0.1em" }}>
            Loading…
          </p>
        ) : dives.length === 0 ? (
          <div className="glass-card" style={{ textAlign: "center", padding: "60px 20px" }}>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "14px", marginBottom: "20px" }}>
              No dives scheduled yet.
            </p>
            <button className="create-dive-btn" onClick={() => router.push("/create-dive")}>
              + Schedule the first dive
            </button>
          </div>
        ) : (
          <div className="dives-grid">
            {dives.map((dive) => (
              <div
  key={dive.id}
  className="dive-card"
  onClick={() => router.push("/create-dive")}
>
                <div className="dive-card-location">{dive.location}</div>
                <div className="dive-card-date">
                  {new Date(dive.date).toLocaleDateString("en-GB", {
                    weekday: "short", day: "numeric", month: "short", year: "numeric",
                  })}
                </div>
                <div className="dive-card-info">
                  <span className="dive-card-spots">
                    <strong>{dive.spots ?? "?"}</strong> spots left
                  </span>
                  {dive.depth && <span className="dive-badge">{dive.depth}m</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
