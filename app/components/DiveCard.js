export default function DiveCard({ dive }) {
  return (
    <div className="dive-card">
      <div className="dive-card-top">
        <span className="dive-badge">
          {dive.dive_type}
        </span>

        <span className="spots-left">
          {dive.spots} spots
        </span>
      </div>

      <h2>{dive.title}</h2>

      <p className="dive-location">
        📍 {dive.location}
      </p>

      <p className="dive-date">
        {new Date(dive.date).toDateString()}
      </p>
    </div>
  );
}
