export default function HomePage() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#07111f",
      color: "white",
      padding: "24px",
      fontFamily: "Arial"
    }}>
      <h1>Welcome to DIVR 🌊</h1>

      <p>Your dives will appear here.</p>

      <div style={{
        marginTop: "24px",
        padding: "20px",
        background: "#102033",
        borderRadius: "16px"
      }}>
        <h2>Upcoming Dives</h2>

        <p>No dives yet.</p>
      </div>
    </div>
  );
}
