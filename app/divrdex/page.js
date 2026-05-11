"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import Navbar from "../components/Navbar";

const ALL_SPECIES = [
  { id: 1,  name: "Sea Turtle",          emoji: "🐢", type: "Reptile"    },
  { id: 2,  name: "Reef Shark",          emoji: "🦈", type: "Shark"      },
  { id: 3,  name: "Manta Ray",           emoji: "🫧", type: "Ray"        },
  { id: 4,  name: "Clownfish",           emoji: "🐠", type: "Fish"       },
  { id: 5,  name: "Moray Eel",           emoji: "🐍", type: "Fish"       },
  { id: 6,  name: "Octopus",             emoji: "🐙", type: "Cephalopod" },
  { id: 7,  name: "Lionfish",            emoji: "🐡", type: "Fish"       },
  { id: 8,  name: "Seahorse",            emoji: "🌿", type: "Fish"       },
  { id: 9,  name: "Hammerhead Shark",    emoji: "🦈", type: "Shark"      },
  { id: 10, name: "Blue-ringed Octopus", emoji: "🐙", type: "Cephalopod" },
  { id: 11, name: "Nudibranch",          emoji: "🐛", type: "Mollusk"    },
  { id: 12, name: "Whale Shark",         emoji: "🦈", type: "Shark"      },
  { id: 13, name: "Barracuda",           emoji: "🐟", type: "Fish"       },
  { id: 14, name: "Stonefish",           emoji: "🪨", type: "Fish"       },
  { id: 15, name: "Giant Clam",          emoji: "🦪", type: "Mollusk"    },
  { id: 16, name: "Dolphin",             emoji: "🐬", type: "Mammal"     },
  { id: 17, name: "Cuttlefish",          emoji: "🦑", type: "Cephalopod" },
  { id: 18, name: "Stingray",            emoji: "🐟", type: "Ray"        },
  { id: 19, name: "Parrotfish",          emoji: "🐠", type: "Fish"       },
  { id: 20, name: "Pufferfish",          emoji: "🐡", type: "Fish"       },
];

export default function DivrDexPage() {
  const router = useRouter();
  const [species] = useState(ALL_SPECIES.map(s => ({ ...s, unlocked: false })));
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push("/login");
    });
  }, [router]);

  const types = ["All", ...Array.from(new Set(ALL_SPECIES.map(s => s.type)))];
  const filtered = filter === "All" ? species : species.filter(s => s.type === filter);
  const unlocked = species.filter(s => s.unlocked).length;

  return (
    <div className="divrdex-page">
      <Navbar />
      <div className="divrdex-content">
        <div className="divrdex-header">
          <div>
            <h1>Divr-dex</h1>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", marginTop: "6px", letterSpacing: "0.05em" }}>
              Log dives to unlock species
            </p>
          </div>
          <span className="dive-badge">{unlocked} / {species.length} unlocked</span>
        </div>

        {/* Filter tabs */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "24px" }}>
          {types.map(t => (
            <button key={t} onClick={() => setFilter(t)} style={{
              padding: "6px 14px",
              borderRadius: "20px",
              border: `1px solid ${filter === t ? "rgba(34,211,238,0.6)" : "rgba(34,211,238,0.15)"}`,
              background: filter === t ? "rgba(34,211,238,0.12)" : "transparent",
              color: filter === t ? "#22d3ee" : "rgba(255,255,255,0.4)",
              fontSize: "11px",
              fontFamily: "'Space Grotesk', sans-serif",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}>
              {t}
            </button>
          ))}
        </div>

        <div className="species-grid">
          {filtered.map((s) => (
            <div key={s.id} style={{
              background: s.unlocked ? "rgba(34,211,238,0.06)" : "rgba(8,32,50,0.85)",
              border: `1px solid ${s.unlocked ? "rgba(34,211,238,0.3)" : "rgba(34,211,238,0.08)"}`,
              borderRadius: "16px",
              padding: "22px 18px",
              textAlign: "center",
              backdropFilter: "blur(12px)",
              transition: "all 0.2s ease",
              filter: s.unlocked ? "none" : "grayscale(1)",
              opacity: s.unlocked ? 1 : 0.45,
            }}>
              <div style={{ fontSize: "32px", marginBottom: "10px" }}>
                {s.emoji}
              </div>
              <h2 style={{
                fontSize: "14px",
                fontWeight: 600,
                color: s.unlocked ? "#22d3ee" : "rgba(255,255,255,0.5)",
                marginBottom: "4px",
              }}>
                {s.unlocked ? s.name : "???"}
              </h2>
              <p style={{
                fontSize: "10px",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.3)",
              }}>
                {s.unlocked ? s.type : "Locked"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
