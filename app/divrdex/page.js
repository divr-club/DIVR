import Navbar from "../components/Navbar";

export default function DivrDexPage() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#07111f",
      color: "white"
    }}>
      <Navbar />

      <div style={{ padding: "24px" }}>
        <h1>Divr-dex 🐠</h1>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "16px",
          marginTop: "24px"
        }}>
          <div style={{
            background: "#102033",
            padding: "20px",
            borderRadius: "16px"
          }}>
            <h2>Sea Turtle</h2>
            <p>Locked 🔒</p>
          </div>

          <div style={{
            background: "#102033",
            padding: "20px",
            borderRadius: "16px"
          }}>
            <h2>Reef Shark</h2>
            <p>Locked 🔒</p>
          </div>
        </div>
      </div>
    </div>
  );
}
