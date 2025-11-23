"use client"

import type React from "react"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import {
  SiPython,
  SiMicrosoftazure,
  SiDocker,
  SiApachespark,
  SiJava,
  SiSpringboot,
  SiGit,
  SiNextdotjs,
  SiTypescript,
  SiNodedotjs,
  SiTailwindcss,
  SiPostgresql,
  SiReact,
  SiGitlab,
  SiFastapi,
  SiExpo,
  SiAzuredevops,
  SiPytorch,
  SiPowerbi,
  SiCsharp,
  SiUnity,
  SiAngular,
  SiTerraform,
  SiApachehive,
  SiApacheflink,
} from "react-icons/si"

const ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  python: SiPython,
  azure: SiMicrosoftazure,
  docker: SiDocker,
  spark: SiApachespark,
  java: SiJava,
  spring: SiSpringboot,
  git: SiGit,
  nextjs: SiNextdotjs,
  typescript: SiTypescript,
  node: SiNodedotjs,
  tailwind: SiTailwindcss,
  postgres: SiPostgresql,
  react: SiReact,
  reactnative: SiReact,
  gitlab: SiGitlab,
  fastapi: SiFastapi,
  expo: SiExpo,
  azuredevops: SiAzuredevops,
  pytorch: SiPytorch,
  powerbi: SiPowerbi,
  csharp: SiCsharp,
  unity: SiUnity,
  angular: SiAngular,
  terraform: SiTerraform,
  hive: SiApachehive,
  flink: SiApacheflink,
}

const LABELS: Record<string, string> = {
  python: "Python",
  azure: "Azure",
  docker: "Docker",
  spark: "Apache Spark",
  java: "Java",
  spring: "Spring Boot",
  git: "Git",
  nextjs: "Next.js",
  typescript: "TypeScript",
  node: "Node.js",
  tailwind: "Tailwind CSS",
  postgres: "PostgreSQL",
  react: "React",
  reactnative: "React Native",
  gitlab: "GitLab",
  fastapi: "FastAPI",
  expo: "Expo",
  azuredevops: "Azure DevOps",
  pytorch: "PyTorch",
  powerbi: "Power BI",
  csharp: "C#",
  unity: "Unity",
  angular: "Angular",
  terraform: "Terraform",
  hive: "Apache Hive",
  flink: "Apache Flink",
}

interface TechIconsProps extends React.HTMLAttributes<HTMLDivElement> {
  tech: string[]
  size?: number
}

export default function TechIcons({ tech, size = 18, className = "" }: TechIconsProps) {
  return (
    <div className={`flex items-center gap-2 text-white/80 ${className}`}>
      {tech
        .map((key) => key.toLowerCase())
        .filter((key) => ICONS[key])
        .map((key, idx) => {
          const Icon = ICONS[key]
          const label = LABELS[key] ?? key
          return (
            <Tooltip key={`${key}-${idx}`}>
              <TooltipTrigger asChild>
                <span className="inline-flex" aria-label={label} title={label}>
                  <Icon size={size} />
                </span>
              </TooltipTrigger>
              <TooltipContent sideOffset={6}>{label}</TooltipContent>
            </Tooltip>
          )
        })}
    </div>
  )
}
