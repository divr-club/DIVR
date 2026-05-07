"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSignup() {
    const { data, error } = await supabase.auth.signUp({
  email,
  password,
});

if (error) {
  alert(error.message);
} else {
  await supabase.from("profiles").insert([
    {
      id: data.user.id,
      username: email.split("@")[0],
    },
  ]);

  alert("Account created 🎉");
  router.push("/login");
}
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Account created 🎉");
      router.push("/login");
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#07111f",
      color: "white",
      padding: "24px",
      fontFamily: "Arial"
    }}>
      <h1>Create DIVR Account 🌊</h1>

      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        maxWidth: "300px",
        marginTop: "24px"
      }}>
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: "12px" }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: "12px" }}
        />

        <button
          onClick={handleSignup}
          style={{
            padding: "12px",
            background: "#0ea5a4",
            color: "white",
            border: "none",
            borderRadius: "8px"
          }}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}
