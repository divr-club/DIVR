"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSignup() {

    const { data, error } =
      await supabase.auth.signUp({
        email,
        password,
      });

    if (error) {
      alert(error.message);
      return;
    }

    const profileResult = await supabase
      .from("profiles")
      .insert([
        {
          id: data.user.id,
          username: email.split("@")[0],
        },
      ]);

    console.log(profileResult);

    if (profileResult.error) {
      alert(profileResult.error.message);
      return;
    }

    alert("Account created 🌊");

    router.push("/login");
  }

  return (
    <div className="auth-container">

      <div className="auth-card">

        <div className="logo">
          DIVR
        </div>

        <p className="tagline">
          Explore. Dive. Connect.
        </p>

        <div className="form-group">

          <input
            className="input"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          <input
            className="input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          <button
            className="button"
            onClick={handleSignup}
          >
            Sign Up
          </button>

        </div>

      </div>

    </div>
  );
}
