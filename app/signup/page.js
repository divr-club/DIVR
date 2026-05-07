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

    const profileResult =
      await supabase
        .from("profiles")
        .insert([
          {
            id: data.user.id,
            username: email.split("@")[0],
          },
        ]);

    if (profileResult.error) {
      alert(profileResult.error.message);
      return;
    }

    router.push("/home");
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

        <form
          className="form-group"
          onSubmit={(e) => {
            e.preventDefault();
            handleSignup();
          }}
        >

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
            type="submit"
          >
            Start Diving
          </button>

        </form>

        <p
          style={{
            marginTop: "20px",
            color: "rgba(255,255,255,0.6)"
          }}
        >
          Already have an account?
          {" "}
          <span
            style={{
              color: "#22d3ee",
              cursor: "pointer"
            }}
            onClick={() => router.push("/login")}
          >
            Login
          </span>
        </p>

      </div>

    </div>
  );
}
