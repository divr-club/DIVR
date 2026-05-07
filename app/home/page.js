import Navbar from "../components/Navbar";

export default function HomePage() {
  return (
    <div className="page">

      <Navbar />

      <div className="dashboard-grid">

        <div className="card">
          <h2 className="card-title">
            Upcoming Dives
          </h2>

          <p className="card-subtext">
            No dives scheduled yet.
          </p>
        </div>

        <div className="card">
          <h2 className="card-title">
            Species Logged
          </h2>

          <p className="card-subtext">
            Your marine sightings will appear here.
          </p>
        </div>

        <div className="card">
          <h2 className="card-title">
            Dive Stats
          </h2>

          <p className="card-subtext">
            Track your dives, depth, and hours underwater.
          </p>
        </div>

      </div>

    </div>
  );
}
