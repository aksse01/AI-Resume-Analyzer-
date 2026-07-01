import Link from "next/link";

export default function DocsPage() {
  return (
    <main className="container section">
      <h1>Documentation</h1>
      <p className="section-lead">Start with the repository docs for setup, architecture, AI prompts, security, deployment, and contribution guidance.</p>
      <div className="row">
        {["/docs/ARCHITECTURE.md", "/docs/SECURITY.md", "/docs/AI_PROMPTS.md", "/docs/DEPLOYMENT.md"].map((doc) => (
          <Link className="button" href="https://github.com/aksse01/ResumeX" key={doc}>{doc}</Link>
        ))}
      </div>
    </main>
  );
}
