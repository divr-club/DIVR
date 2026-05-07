import Navbar from "../components/Navbar";

export default function DivesPage() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#07111f",
      color: "white"
    }}>
      <Navbar />

      <div style={{ padding: "24px" }}>
        <h1>Upcoming Dives 🌊</h1>

        <div style={{
          marginTop: "24px",
          background: "#102033",
          padding: "20px",
          borderRadius: "16px"
        }}>
          <h2>Snoopy Island</h2>

          <p>Saturday — 8:00 AM</p>

          <p>4 divers attending</p>
        </div>
      </div>
    </div>
  );
}
