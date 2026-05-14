"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [username, setUsername] = useState("");
  const [location, setLocation] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [certification, setCertification] = useState("Hobby");

  const [loading, setLoading] = useState(false);

  async function handleSignup(e) {
    e.preventDefault();

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      await supabase.from("profiles").insert({
        id: data.user.id,
        username,
        certification,
        home_location: location,
        whatsapp,
        bio: "",
        dives_count: 0,
        species_count: 0,
        total_logged_dives: 0,
      });
    }

    alert("Account created 🌊");

    router.push("/home");

    setLoading(false);
  }

  return (
    <div className="auth-page">

      <div className="auth-card">

        <h1>Create Account</h1>

        <form onSubmit={handleSignup}>

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Home Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <input
            type="text"
            placeholder="WhatsApp Number"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
          />

          <select
            value={certification}
            onChange={(e) => setCertification(e.target.value)}
          >
            <option>Hobby</option>
            <option>Open Water</option>
            <option>Advanced Open Water</option>
            <option>Rescue Diver</option>
            <option>Divemaster</option>
            <option>Instructor</option>
          </select>

          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Account"}
          </button>

        </form>

      </div>

    </div>
  );
}
