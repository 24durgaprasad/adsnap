import { useState } from "react"
import { Clock, Video, Trash2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

interface Project {
  id: string
  title: string
  createdAt: string
  thumbnail?: string
  type: "video" | "image"
}

const mockProjects: Project[] = [
  {
    id: "1",
    title: "Revolutionary fitness app that transforms lives",
    createdAt: "2 hours ago",
    type: "video"
  },
  {
    id: "2", 
    title: "Premium coffee subscription service",
    createdAt: "1 day ago",
    type: "video"
  },
  {
    id: "3",
    title: "AI-powered productivity tool",
    createdAt: "3 days ago", 
    type: "video"
  },
  {
    id: "4",
    title: "Sustainable fashion brand launch",
    createdAt: "1 week ago",
    type: "video"
  }
]

interface ProjectHistoryProps {
  onSelectProject?: (project: Project) => void
  onNewProject?: () => void
}

export function ProjectHistory({ onSelectProject, onNewProject }: ProjectHistoryProps) {
  const [projects] = useState<Project[]>(mockProjects)

  return (
    <div className="w-80 glass-border-r border-r h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b glass-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Projects</h2>
          <Button
            size="sm"
            onClick={onNewProject}
            className="btn-premium h-8 w-8 p-0"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        <Button
          onClick={onNewProject}
          variant="outline"
          className="w-full glass hover:bg-white/10"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Projects List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {projects.map((project, index) => (
            <div key={project.id}>
              <button
                onClick={() => onSelectProject?.(project)}
                className="w-full p-3 text-left hover:bg-white/5 rounded-lg transition-colors group"
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-8 h-8 rounded bg-gradient-primary flex items-center justify-center">
                      <Video className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <div className="flex items-center mt-2 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3 mr-1" />
                      {project.createdAt}
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      console.log("Delete project:", project.id)
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-destructive/20 rounded"
                  >
                    <Trash2 className="w-3 h-3 text-destructive" />
                  </button>
                </div>
              </button>
              
              {index < projects.length - 1 && (
                <Separator className="my-2 bg-white/10" />
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Usage Stats */}
      <div className="p-4 border-t glass-border">
        <div className="text-xs text-muted-foreground space-y-2">
          <div className="flex justify-between">
            <span>Projects created</span>
            <span className="text-primary font-medium">{projects.length}/10</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-1">
            <div 
              className="bg-gradient-primary h-1 rounded-full transition-all"
              style={{ width: `${(projects.length / 10) * 100}%` }}
            />
          </div>
          <div className="text-center">
            <Button variant="link" size="sm" className="text-xs p-0 h-auto">
              Upgrade for unlimited projects
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}