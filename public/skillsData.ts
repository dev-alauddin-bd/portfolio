import { Code2, Server, LayoutDashboard, LucideIcon } from "lucide-react";

// ✅ Shields.io Badge URLs
export const skillBadges: { [key: string]: string } = {
  HTML5: "https://img.shields.io/badge/html5-%23E34F26.svg?style=flat-square&logo=html5&logoColor=white",
  CSS3: "https://img.shields.io/badge/css3-%231572B6.svg?style=flat-square&logo=css3&logoColor=white",
  JavaScript: "https://img.shields.io/badge/javascript-%23323330.svg?style=flat-square&logo=javascript&logoColor=%23F7DF1E",
  TypeScript: "https://img.shields.io/badge/typescript-%23007ACC.svg?style=flat-square&logo=typescript&logoColor=white",
  React: "https://img.shields.io/badge/react-%2320232a.svg?style=flat-square&logo=react&logoColor=%2361DAFB",
  "Next.js": "https://img.shields.io/badge/Next-black?style=flat-square&logo=next.js&logoColor=white",
  "Tailwind CSS": "https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=flat-square&logo=tailwind-css&logoColor=white",
  Redux: "https://img.shields.io/badge/redux-%23593d88.svg?style=flat-square&logo=redux&logoColor=white",
  Figma: "https://img.shields.io/badge/figma-%23F24E1E.svg?style=flat-square&logo=figma&logoColor=white",
  NodeJS: "https://img.shields.io/badge/node.js-6DA55F?style=flat-square&logo=node.js&logoColor=white",
  "Express.js": "https://img.shields.io/badge/express.js-%23404d59.svg?style=flat-square&logo=express&logoColor=%2361DAFB",
  MongoDB: "https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=flat-square&logo=mongodb&logoColor=white",
  PostgreSQL: "https://img.shields.io/badge/postgres-%23316192.svg?style=flat-square&logo=postgresql&logoColor=white",
  Prisma: "https://img.shields.io/badge/Prisma-3982CE?style=flat-square&logo=Prisma&logoColor=white",
  Supabase: "https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white",
  Firebase: "https://img.shields.io/badge/firebase-%23039BE5.svg?style=flat-square&logo=firebase",
  Docker: "https://img.shields.io/badge/docker-%230db7ed.svg?style=flat-square&logo=docker&logoColor=white",
  Git: "https://img.shields.io/badge/git-%23F05033.svg?style=flat-square&logo=git&logoColor=white",
  GitHub: "https://img.shields.io/badge/github-%23121011.svg?style=flat-square&logo=github&logoColor=white",
  "GitHub Actions": "https://img.shields.io/badge/github%20actions-%232671E5.svg?style=flat-square&logo=githubactions&logoColor=white",
  Vercel: "https://img.shields.io/badge/vercel-%23000000.svg?style=flat-square&logo=vercel&logoColor=white",
  ESLint: "https://img.shields.io/badge/ESLint-4B3263?style=flat-square&logo=eslint&logoColor=white",
  default: "https://img.shields.io/badge/Skill-gray.svg?style=flat-square&logo=code",
};

// 🧩 Type Definitions
export interface SkillSubCategory {
  title: string;
  description: string;
  skills: string[];
}

export interface MainSkillCategory {
  title: string;
  icon: LucideIcon;
  subCategories: SkillSubCategory[];
}

// 🧠 Main Skill Categories
export const skillCategories: MainSkillCategory[] = [
  {
    title: "Frontend & UI/UX",
    icon: Code2,
    subCategories: [
      {
        title: "Frontend Development",
        description: "Building modern, responsive, and interactive UIs.",
        skills: [
          "HTML5",
          "CSS3",
          "JavaScript",
          "TypeScript",
          "React",
          "Next.js",
          "Tailwind CSS",
          "Redux",
        ],
      },
      {
        title: "UI/UX & Design",
        description: "Designing visually appealing and user-friendly interfaces.",
        skills: ["Figma"],
      },
    ],
  },
  {
    title: "Backend & DevOps",
    icon: Server,
    subCategories: [
      {
        title: "Server & APIs",
        description: "Developing robust and scalable backend services.",
        skills: ["NodeJS", "Express.js", "MongoDB", "PostgreSQL", "Prisma"],
      },
      {
        title: "DevOps & Tools",
        description: "Deployment, CI/CD, and cloud integrations.",
        skills: ["Supabase", "Firebase", "Docker", "GitHub Actions", "Vercel"],
      },
    ],
  },
  {
    title: "Tools & Code Quality",
    icon: LayoutDashboard,
    subCategories: [
      {
        title: "Developer Tools",
        description: "Improving development workflow and consistency.",
        skills: ["Git", "GitHub", "ESLint"],
      },
    ],
  },
];
