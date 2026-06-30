export default function PrivacyPage() {
  return (
    <main className="container section">
      <h1>Privacy</h1>
      <p className="section-lead">Demo mode processes uploaded content for the current analysis request. Production deployments should configure authenticated storage, short-lived URLs, encryption-at-rest, deletion schedules, and audit logs before handling real user data at scale.</p>
    </main>
  );
}
