import { ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function SecurityPage() {
  return (
    <main className="container section">
      <div className="section-header">
        <div>
          <div className="eyebrow">Security</div>
          <h1>Resume data is sensitive by default.</h1>
          <p className="section-lead">The codebase includes file validation, prompt-injection guidance, environment-driven secrets, and production hooks for auth, storage, audit logs, rate limiting, and deletion.</p>
        </div>
        <ShieldCheck size={42} color="var(--emerald)" />
      </div>
      <div className="grid grid-3">
        {["Ownership checks", "No public storage buckets", "Prompt injection defense", "No secrets committed", "Account deletion hooks", "Audit log models"].map((item) => (
          <Card key={item}><h3>{item}</h3><p>Documented and represented in architecture for production implementation.</p></Card>
        ))}
      </div>
    </main>
  );
}
