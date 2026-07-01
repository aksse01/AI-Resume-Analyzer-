import Link from "next/link";

export function Footer() {
  return (
    <footer className="footer">
      <div className="container row" style={{ justifyContent: "space-between" }}>
        <span>ResumeX</span>
        <div className="row">
          <Link href="/dashboard">Product</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/security">Security</Link>
          <Link href="/docs">Documentation</Link>
          <Link href="mailto:hello@resumex.app">Contact</Link>
        </div>
      </div>
    </footer>
  );
}
