"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function LoginPage() {

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {

    const { error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (error) {
      alert(error.message);
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
          Continue your underwater journey.
        </p>

        <form
          className="form-group"
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
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
            Sign In
          </button>

        </form>

        <p
          style={{
            marginTop: "20px",
            color: "rgba(255,255,255,0.6)"
          }}
        >
          New to DIVR?
          {" "}
          <span
            style={{
              color: "#22d3ee",
              cursor: "pointer"
            }}
            onClick={() => router.push("/signup")}
          >
            Create account
          </span>
        </p>

      </div>

    </div>
  );
}
