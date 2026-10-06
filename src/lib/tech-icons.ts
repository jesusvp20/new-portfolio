export const TECH_CATALOG: { id: string; label: string; devicon: string }[] = [
  { id: "react", label: "React", devicon: "react/react-original" },
  { id: "nextjs", label: "Next.js", devicon: "nextjs/nextjs-original" },
  { id: "typescript", label: "TypeScript", devicon: "typescript/typescript-original" },
  { id: "javascript", label: "JavaScript", devicon: "javascript/javascript-original" },
  { id: "nodejs", label: "Node.js", devicon: "nodejs/nodejs-original" },
  { id: "python", label: "Python", devicon: "python/python-original" },
  { id: "postgresql", label: "PostgreSQL", devicon: "postgresql/postgresql-original" },
  { id: "mongodb", label: "MongoDB", devicon: "mongodb/mongodb-original" },
  { id: "mysql", label: "MySQL", devicon: "mysql/mysql-original" },
  { id: "redis", label: "Redis", devicon: "redis/redis-original" },
  { id: "docker", label: "Docker", devicon: "docker/docker-original" },
  { id: "tailwindcss", label: "Tailwind", devicon: "tailwindcss/tailwindcss-original" },
  { id: "go", label: "Go", devicon: "go/go-original" },
  { id: "java", label: "Java", devicon: "java/java-original" },
  { id: "figma", label: "Figma", devicon: "figma/figma-original" },
  { id: "git", label: "Git", devicon: "git/git-original" },
  { id: "aws", label: "AWS", devicon: "amazonwebservices/amazonwebservices-original-wordmark" },
  { id: "prisma", label: "Prisma", devicon: "prisma/prisma-original" },
  { id: "supabase", label: "Supabase", devicon: "supabase/supabase-original" },
  { id: "firebase", label: "Firebase", devicon: "firebase/firebase-original" },
];

export function techIconUrl(deviconPath: string) {
  return `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${deviconPath}.svg`;
}

export function resolveTechIcon(tech: string) {
  const key = tech.toLowerCase().replace(/\s|\./g, "");
  const found = TECH_CATALOG.find((t) => t.id === key || t.label.toLowerCase() === tech.toLowerCase());
  return found ? techIconUrl(found.devicon) : `https://cdn.simpleicons.org/${encodeURIComponent(key)}/white`;
}
