export function ScoreGauge({ score, label }: { score: number; label: string }) {
  return (
    <div className="score-preview card">
      <div className="score-ring" style={{ background: `radial-gradient(circle, var(--card) 0 58%, transparent 59%), conic-gradient(var(--emerald) 0 ${score}%, #dbe4ef ${score}% 100%)` }}>
        <strong>{score}</strong>
      </div>
      <h3>{label}</h3>
      <p className="section-lead" style={{ fontSize: "0.95rem" }}>
        Internal score with transparent deductions. Not a guarantee of interviews or external ATS outcomes.
      </p>
    </div>
  );
}
