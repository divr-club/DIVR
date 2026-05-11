"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import Navbar from "../components/Navbar";

const PLACEHOLDER_SPECIES = [
  { id: 1, name: "Sea Turtle",  unlocked: false },
  { id: 2, name: "Reef Shark",  unlocked: false },
  { id: 3, name: "Manta Ray",   unlocked: false },
  { id: 4, name: "Clownfish",   unlocked: false },
  { id: 5, name: "Moray Eel",   unlocked: false },
  { id: 6, name: "Octopus",     unlocked: false },
  { id: 7, name: "Lionfish",    unlocked: false },
  { id: 8, name: "Seahorse",    unlocked: false },
];

export default function DivrDexPage() {
  const router = useRouter();
  const [species] = useState(PLACEHOLDER_SPECIES);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push("/login");
    });
  }, [router]);

  const unlocked = species.filter((s) => s.unlocked).length;

  return (
    <div className="divrdex-page">
      <Navbar />
      <div className="divrdex-content">
        <div className="divrdex-header">
          <h1>Divr-dex</h1>
          <span className="dive-badge">{unlocked} / {species.length} unlocked</span>
        </div>

        <div className="species-grid">
          {species.map((s) => (
            <div key={s.id} className={`species-card ${s.unlocked ? "unlocked" : "locked"}`}>
              <div style={{ fontSize: "28px", marginBottom: "10px" }}>
                {s.unlocked ? "🐠" : "🔒"}
              </div>
              <h2>{s.unlocked ? s.name : "???"}</h2>
              <p>{s.unlocked ? "Spotted" : "Locked"}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
