"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail]       = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError]       = useState<string>("");
  const [loading, setLoading]   = useState<boolean>(false);

  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data, error: err } = await supabase.auth.signUp({ email, password });
    if (err) { setError(err.message); setLoading(false); return; }

    if (data?.user?.id) {
      await supabase.from("profiles").insert([{
        id: data.user.id,
        username: email.split("@")[0],
      }]);
    }

    setLoading(false);
    router.push("/home");
  }

  return (
    <div className="page-center">
      <div className="auth-card">
        <div className="logo">DIVR</div>
        <div className="subtitle">Explore · Dive · Connect</div>

        {error && <p className="form-error">{error}</p>}

        <form className="form-group" onSubmit={handleSignup}>
          <input
            className="input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <input
            className="input"
            type="password"
            placeholder="Password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            autoComplete="new-password"
          />
          <button className="button" type="submit" disabled={loading}>
            {loading ? "Creating account…" : "Create Account"}
          </button>
        </form>

        <div className="auth-link">
          Already have an account? <a href="/login">Log in</a>
        </div>
      </div>
    </div>
  );
}
