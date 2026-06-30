export const skillAliases: Record<string, string[]> = {
  python: ["python", "py"],
  java: ["java"],
  javascript: ["javascript", "java script", "js"],
  typescript: ["typescript", "type script", "ts"],
  react: ["react", "reactjs", "react js", "react.js"],
  "next.js": ["next.js", "nextjs", "next js"],
  node: ["node", "nodejs", "node js", "node.js"],
  flask: ["flask"],
  django: ["django"],
  sql: ["sql"],
  mysql: ["mysql", "my sql"],
  postgresql: ["postgresql", "postgres"],
  mongodb: ["mongodb", "mongo db"],
  excel: ["excel", "microsoft excel"],
  "power bi": ["power bi", "powerbi"],
  tableau: ["tableau"],
  git: ["git", "github", "git hub"],
  docker: ["docker"],
  kubernetes: ["kubernetes", "k8s"],
  aws: ["aws", "amazon web services"],
  azure: ["azure"],
  gcp: ["gcp", "google cloud"],
  "data analysis": ["data analysis", "data analytics", "analytics"],
  "machine learning": ["machine learning", "ml"],
  nlp: ["nlp", "natural language processing"],
  communication: ["communication", "communications", "presentation", "presentations"],
  leadership: ["leadership", "led", "mentored"],
  "problem solving": ["problem solving", "problem-solving"],
  agile: ["agile", "scrum"]
};

export const groupedSkillCategories = {
  "Programming Languages": ["python", "java", "javascript", "typescript", "sql"],
  "Frameworks": ["react", "next.js", "node", "flask", "django"],
  "Data And Analytics": ["excel", "power bi", "tableau", "data analysis", "machine learning", "nlp"],
  "Cloud And DevOps": ["git", "docker", "kubernetes", "aws", "azure", "gcp"],
  "Professional Skills": ["communication", "leadership", "problem solving", "agile"]
};

export function normalizeSkillName(skill: string) {
  const normalized = skill.toLowerCase().trim();
  for (const [canonical, aliases] of Object.entries(skillAliases)) {
    if (aliases.includes(normalized)) {
      return canonical;
    }
  }
  return normalized;
}

export function findSkills(text: string) {
  const normalized = text
    .toLowerCase()
    .replace(/(?<=\w)[./](?=\w)/g, " ")
    .replace(/[^a-z0-9+#\s-]/g, " ");
  const found = new Set<string>();

  for (const [canonical, aliases] of Object.entries(skillAliases)) {
    for (const alias of aliases) {
      const safe = alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\\\./g, "[. ]?");
      const pattern = new RegExp(`(^|[^a-z0-9+#])${safe}([^a-z0-9+#]|$)`, "i");
      if (pattern.test(normalized)) {
        found.add(canonical);
        break;
      }
    }
  }

  return Array.from(found).sort();
}
