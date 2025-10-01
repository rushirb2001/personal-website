"use client"

import { useState } from "react"
import { ChevronRight, FileText } from "lucide-react"
import { SkillExplorer } from "./skill-explorer"

export interface Skill {
  name: string
  proficiency: number // 1-5
  lastUsed: string
  clearanceLevel: string
}

export interface SkillGroup {
  title: string
  id: string
  skills: Skill[]
}

interface SkillFolderProps {
  group: SkillGroup
}

export function SkillFolder({ group }: SkillFolderProps) {
  const [isExplorerOpen, setIsExplorerOpen] = useState(false)

  // Only show top 3 skills initially
  const topSkills = group.skills.slice(0, 3)

  return (
    <>
      <div className="relative h-[80%] md:h-full w-[90%] md:w-full mx-auto">
        {/* Folder container with 3D effect */}
        <div
          className="absolute inset-0 cursor-pointer group transition-all duration-200 hover:-translate-y-1"
          onClick={() => setIsExplorerOpen(true)}
        >
          {/* Folder tab */}
          <div className="absolute top-0 left-[10%] right-[10%] h-8 bg-secondary dark:bg-eerie-darkgray border-t border-l border-r border-primary/40 rounded-t-md z-10 flex items-center justify-center shadow-sm">
            <h3 className="text-[10px] md:text-xs font-medium font-sf-mono truncate px-2 md:px-4">{group.title}</h3>
          </div>

          {/* Folder body */}
          <div className="absolute top-8 inset-x-0 bottom-0 bg-secondary/90 dark:bg-eerie-darkgray/90 border border-primary/40 rounded-b-md rounded-tr-md shadow-md transition-all duration-200 group-hover:shadow-lg">
            {/* Folder content */}
            <div className="p-2 md:p-4 flex flex-col h-full">
              <div className="flex-grow space-y-2 md:space-y-3 mb-2 md:mb-3 mt-1">
                {topSkills.map((skill, idx) => (
                  <div key={idx} className="flex items-center text-[10px] md:text-xs">
                    <FileText className="h-2.5 w-2.5 md:h-3 md:w-3 mr-1 md:mr-2 text-primary/50" />
                    <span className="font-mono">{skill.name}</span>
                  </div>
                ))}
              </div>

              {/* Folder footer */}
              <div className="border-t border-primary/20 pt-2 mt-auto">
                <div className="text-[10px] md:text-xs flex items-center text-primary/60 group-hover:text-primary/80 transition-colors animate-mechanical-pulse">
                  <ChevronRight className="h-2.5 w-2.5 md:h-3 md:w-3 mr-1 md:mr-2" />
                  <span className="font-sf-mono tracking-wide text-[0.65rem]">ACCESS SKILLS... </span>
                </div>

                <div className="flex justify-between items-center mt-1">
                  <div className="text-[0.6rem] md:text-[0.7rem] font-sf-mono text-primary/30">
                    {group.skills.length} ENTRIES
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isExplorerOpen && (
        <SkillExplorer group={group} isOpen={isExplorerOpen} onClose={() => setIsExplorerOpen(false)} />
      )}
    </>
  )
}
