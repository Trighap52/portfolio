"use client"

import type { PortfolioSection } from "@/app/page"
import { AnimatePresence, motion } from "framer-motion"
import TechIcons from "@/components/tech-icons"
import { ChevronDown } from "lucide-react"

interface HeroContentProps {
  activeSection: PortfolioSection
  direction?: "up" | "down" | null
}

export default function HeroContent({ activeSection, direction }: HeroContentProps) {
  const renderContent = () => {
    switch (activeSection) {
      case "intro":
        return (
          <>
            <h1 className="text-4xl md:text-6xl md:leading-16 tracking-tight font-light text-white mb-4">
              <span className="font-medium italic instrument">ZYAD</span>
              <br />
              <span className="font-medium italic instrument">HADDAD</span>
            </h1>
            <p className="text-xs md:text-sm font-light text-white/70 mb-6 leading-relaxed max-w-xs md:max-w-md">
              Hi, I’m Zyad Haddad, a CS engineer splitting a double M.Sc. between INSA Lyon and KTH. I love shipping AI-powered tools, resilient distributed systems, and playful web experiences that people actually use. If we’re not talking tech, I’m likely working on side-projects, contributing to open-source, or lost in a Balatro run.
            </p>
            <div className="flex items-center gap-2 md:gap-4 flex-wrap">
              <a
                href="https://github.com/Trighap52/"
                target="_blank"
                className="px-4 md:px-6 py-2 md:py-3 rounded-full bg-transparent border border-white/30 text-white font-normal text-xs transition-all duration-200 hover:bg-white/10 hover:border-white/50 cursor-pointer"
                rel="noreferrer"
                aria-label="Explore my GitHub profile"
              >
                See my GitHub
              </a>
              <a
                href="mailto:trighap52@gmail.com"
                className="px-4 md:px-6 py-2 md:py-3 rounded-full bg-white text-black font-normal text-xs transition-all duration-200 hover:bg-white/90 cursor-pointer"
                aria-label="Send me an email"
              >
                Email me
              </a>
            </div>
          </>
        )

      case "experience":
        return (
          <>
            <h2 className="text-3xl md:text-5xl md:leading-16 tracking-tight font-medium italic instrument mb-4 md:mb-6">
              EXPERIENCE
            </h2>
            <div className="space-y-4 md:space-y-6 max-w-xs md:max-w-2xl">
              <details className="border-l-2 border-blue-400 pl-3 md:pl-4 group">
                <summary className="list-none cursor-pointer flex items-start justify-between gap-3">
                  <div className="space-y-1 md:space-y-2">
                    <h3 className="text-sm md:text-lg font-medium text-white">AI Engineer Intern (Master Thesis)</h3>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <p className="text-blue-300 text-xs md:text-sm">Volvo Group • Jun 2025 – Nov 2025</p>
                      <TechIcons
                        tech={["python", "git", "docker", "langchain", "azure", "azuredevops", "deepeval"]}
                        className="flex"
                      />
                    </div>
                  </div>
                  <ChevronDown className="mt-1 h-4 w-4 text-white/60 transition-transform duration-200 group-open:rotate-180" />
                </summary>
                <p className="text-white/70 text-xs md:text-sm mt-1 md:mt-2">
                  Designing an agentic LLM platform (LangChain + RAG) for 15k teammates; boosted retrieval accuracy by
                  25% and baked evaluation checkpoints into delivery.
                </p>
              </details>
              <details className="border-l-2 border-blue-400 pl-3 md:pl-4 group">
                <summary className="list-none cursor-pointer flex items-start justify-between gap-3">
                  <div className="space-y-1 md:space-y-2">
                    <h3 className="text-sm md:text-lg font-medium text-white">Freelance Software Engineer</h3>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <p className="text-blue-300 text-xs md:text-sm">ETIC INSA LYON (EDF - TOSIT) • Jan 2024 – Dec 2024</p>
                      <TechIcons
                        tech={[
                          "apache iceberg",
                          "knox",
                          "spark",
                          "trino",
                          "prestodb",
                          "flink",
                          "hive",
                          "impala",
                        ]}
                        className="flex"
                      />
                    </div>
                  </div>
                  <ChevronDown className="mt-1 h-4 w-4 text-white/60 transition-transform duration-200 group-open:rotate-180" />
                </summary>
                <p className="text-white/70 text-xs md:text-sm mt-1 md:mt-2">
                  Modernized distributed analytics over 5TB+ with Iceberg/Trino; cut query times by 30% and locked
                  access behind Apache Knox so data teams could focus on insight instead of infrastructure.
                </p>
              </details>
              <details className="border-l-2 border-blue-400 pl-3 md:pl-4 group">
                <summary className="list-none cursor-pointer flex items-start justify-between gap-3">
                  <div className="space-y-1 md:space-y-2">
                    <h3 className="text-sm md:text-lg font-medium text-white">Fullstack Web Developer</h3>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <p className="text-blue-300 text-xs md:text-sm">OnePoint • Apr 2024 – Jun 2024</p>
                      <TechIcons tech={["angular", "spring", "git", "terraform", "azure"]} className="flex" />
                    </div>
                  </div>
                  <ChevronDown className="mt-1 h-4 w-4 text-white/60 transition-transform duration-200 group-open:rotate-180" />
                </summary>
                <p className="text-white/70 text-xs md:text-sm mt-1 md:mt-2">
                  Redesigned a sports management platform with Angular and Spring Boot, adding media uploads and live
                  event coverage that pulled users back in every weekend.
                </p>
              </details>

              {/* New Experience: Data Science Intern */}
              <details className="border-l-2 border-blue-400 pl-3 md:pl-4 group">
                <summary className="list-none cursor-pointer flex items-start justify-between gap-3">
                  <div className="space-y-1 md:space-y-2">
                    <h3 className="text-sm md:text-lg font-medium text-white">Data Science Intern</h3>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <p className="text-blue-300 text-xs md:text-sm">Volvo Group • Jun 2023 – Sep 2023</p>
                      <TechIcons tech={["powerbi", "python", "pytorch", "vba", "sql"]} className="flex" />
                    </div>
                  </div>
                  <ChevronDown className="mt-1 h-4 w-4 text-white/60 transition-transform duration-200 group-open:rotate-180" />
                </summary>
                <p className="text-white/70 text-xs md:text-sm mt-1 md:mt-2">
                  Automated data pipelines and built reporting tools, cutting manual work by 40% for 10+ analysts; shipped
                  PyTorch models to triage service requests.
                </p>
              </details>
            </div>
          </>
        )

      case "projects":
        return (
          <>
            <h2 className="text-3xl md:text-5xl md:leading-16 tracking-tight font-medium italic instrument mb-4 md:mb-6">
              PROJECTS
            </h2>
            <div className="space-y-4 md:space-y-6 max-w-xs md:max-w-2xl">
              <details className="border-l-2 border-green-400 pl-3 md:pl-4 group">
                <summary className="list-none cursor-pointer flex items-start justify-between gap-3">
                  <div className="space-y-1 md:space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm md:text-lg font-medium text-white">TAILOR — ML‑Powered Social App</h3>
                      <a
                        className="text-green-200 text-[11px] md:text-xs underline underline-offset-4 hover:text-white transition-colors"
                        href="https://tailorapp.fr"
                        target="_blank"
                        rel="noreferrer"
                      >
                        tailorapp.fr
                      </a>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <p className="text-green-300 text-xs md:text-sm">Ongoing</p>
                      <TechIcons
                        tech={["reactnative", "spring", "qdrant", "expo", "fastapi", "gitlab", "postgres"]}
                        className="flex"
                      />
                    </div>
                  </div>
                  <ChevronDown className="mt-1 h-4 w-4 text-white/60 transition-transform duration-200 group-open:rotate-180" />
                </summary>
                <p className="text-white/70 text-xs md:text-sm mt-1 md:mt-2">
                  I’m shipping a social app where people tune their feed with pluggable recommender strategies. Blends
                  clustering and vector search (Qdrant) with an API‑first, Expo-powered experience.
                </p>
              </details>
              <details className="border-l-2 border-green-400 pl-3 md:pl-4 group">
                <summary className="list-none cursor-pointer flex items-start justify-between gap-3">
                  <div className="space-y-1 md:space-y-2">
                    <h3 className="text-sm md:text-lg font-medium text-white">Multi Agent Path-Finding</h3>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <p className="text-green-300 text-xs md:text-sm">Unity • Feb 2025</p>
                      <TechIcons tech={["unity", "csharp"]} className="flex" />
                    </div>
                  </div>
                  <ChevronDown className="mt-1 h-4 w-4 text-white/60 transition-transform duration-200 group-open:rotate-180" />
                </summary>
                <p className="text-white/70 text-xs md:text-sm mt-1 md:mt-2">
                  Built Conflict‑Based Search (CBS) for drone swarms; coordinated 50+ agents with ~40% fewer collisions
                  and live planner/constraint visualizations.
                </p>
              </details>
            </div>
          </>
        )

      case "skills":
        return (
          <>
            <h2 className="text-3xl md:text-5xl md:leading-16 tracking-tight font-medium italic instrument mb-4 md:mb-6">
              SKILLS
            </h2>
            <div className="space-y-3 md:space-y-4 max-w-xs md:max-w-2xl">
              <div>
                <h3 className="text-sm md:text-lg font-medium text-white mb-1 md:mb-2">Machine Learning & AI</h3>
                <p className="text-amber-300 text-xs md:text-sm">
                  PyTorch, TensorFlow, scikit‑learn, Hugging Face, LangChain, RAG, NLP, model evaluation
                </p>
              </div>
              <div>
                <h3 className="text-sm md:text-lg font-medium text-white mb-1 md:mb-2">Programming Languages</h3>
                <p className="text-amber-300 text-xs md:text-sm">Python, C++, JavaScript, TypeScript, SQL</p>
              </div>
              <div>
                <h3 className="text-sm md:text-lg font-medium text-white mb-1 md:mb-2">Data & Infrastructure</h3>
                <p className="text-amber-300 text-xs md:text-sm">
                  Qdrant, Apache Iceberg, Trino, Spark, Apache Knox, Azure, Docker, Terraform
                </p>
              </div>
              <div>
                <h3 className="text-sm md:text-lg font-medium text-white mb-1 md:mb-2">Languages</h3>
                <p className="text-amber-300 text-xs md:text-sm">
                  French (Fluent), English (TOEFL iBT: 109/120), Arabic (Fluent)
                </p>
              </div>
            </div>
          </>
        )

      default:
        return null
    }
  }

  return (
    <main className="absolute bottom-4 md:bottom-8 left-4 md:left-8 right-20 md:right-32 z-20">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={activeSection}
          className="text-left"
          custom={direction}
          variants={{
            initial: (dir: "up" | "down" | null) => ({
              opacity: 0,
              y: dir === "down" ? 24 : dir === "up" ? -24 : 16,
              filter: "blur(2px)",
            }),
            animate: {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              transition: { duration: 0.35, ease: "easeOut" },
            },
            exit: (dir: "up" | "down" | null) => ({
              opacity: 0,
              y: dir === "down" ? -24 : dir === "up" ? 24 : -16,
              filter: "blur(2px)",
              transition: { duration: 0.25, ease: "easeIn" },
            }),
          }}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </main>
  )
}
