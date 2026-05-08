"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import Navbar from "../components/Navbar";
import DiveCard from "../components/DiveCard";

export default function HomePage() {
  const router = useRouter();

  const [dives, setDives] = useState([]);

  useEffect(() => {
    checkUser();
    fetchDives();
  }, []);

  async function checkUser() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      router.push("/login");
    }
  }

  async function fetchDives() {
    const { data, error } = await supabase
      .from("dives")
      .select("*")
      .order("date", { ascending: true });

    if (error) {
      console.log(error);
      return;
    }

    setDives(data);
  }

  return (
    <div className="home-page">
      <Navbar />

      <div className="home-content">
        <div className="home-header">
          <h1>Upcoming Dives</h1>

          <button
            className="create-dive-btn"
            onClick={() => router.push("/create-dive")}
          >
            + Create Dive
          </button>
        </div>

        <div className="dives-grid">
          {dives.map((dive) => (
            <DiveCard key={dive.id} dive={dive} />
          ))}
        </div>
      </div>
    </div>
  );
}
