import { applicationRows } from "@/data/demo";
import { Card } from "@/components/ui/card";

const statuses = ["Saved", "Applied", "Assessment", "Interview", "Offer", "Rejected", "Withdrawn"];

export default function ApplicationsPage() {
  return (
    <main className="container section">
      <div className="section-header">
        <div>
          <div className="eyebrow">Applications</div>
          <h1>Job application tracker.</h1>
          <p className="section-lead">Kanban and table-ready tracker for company, role, URL, resume version, status, notes, and follow-up date.</p>
        </div>
      </div>
      <div className="grid grid-4">
        {statuses.slice(0, 4).map((status) => (
          <Card key={status}>
            <h3>{status}</h3>
            {applicationRows.filter((row) => row.status === status).map((row) => (
              <div className="issue" key={row.company}>
                <strong>{row.company}</strong>
                <p>{row.role}</p>
                <span className="pill">Resume score {row.score}</span>
              </div>
            ))}
          </Card>
        ))}
      </div>
    </main>
  );
}
