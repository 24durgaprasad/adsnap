import { useState } from "react"
import { Clock, Palette, Ratio, Volume2, Zap, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"

interface AdOptionsProps {
  onOptionsChange?: (options: AdGenerationOptions) => void
}

interface AdGenerationOptions {
  duration: number
  style: string
  aspectRatio: string
  voiceover: boolean
  musicIntensity: number
  template: string
}

export function AdOptions({ onOptionsChange }: AdOptionsProps) {
  const [options, setOptions] = useState<AdGenerationOptions>({
    duration: 15,
    style: "modern",
    aspectRatio: "16:9",
    voiceover: false,
    musicIntensity: 50,
    template: "dynamic"
  })

  const updateOptions = (newOptions: Partial<AdGenerationOptions>) => {
    const updated = { ...options, ...newOptions }
    setOptions(updated)
    onOptionsChange?.(updated)
  }

  const durations = [
    { value: 6, label: "6s", badge: "Stories" },
    { value: 15, label: "15s", badge: "Most Popular" },
    { value: 30, label: "30s", badge: "Standard" },
    { value: 60, label: "60s", badge: "Extended" }
  ]

  const styles = [
    { value: "modern", label: "Modern", description: "Clean, minimalist design" },
    { value: "bold", label: "Bold", description: "High-contrast, energetic" },
    { value: "elegant", label: "Elegant", description: "Sophisticated, premium" },
    { value: "playful", label: "Playful", description: "Fun, colorful, dynamic" },
    { value: "corporate", label: "Corporate", description: "Professional, trustworthy" },
    { value: "cinematic", label: "Cinematic", description: "Movie-like, dramatic" }
  ]

  const aspectRatios = [
    { value: "16:9", label: "16:9", description: "Landscape (YouTube, Desktop)" },
    { value: "9:16", label: "9:16", description: "Portrait (TikTok, Stories)" },
    { value: "1:1", label: "1:1", description: "Square (Instagram, Facebook)" },
    { value: "4:5", label: "4:5", description: "Vertical (Instagram Feed)" }
  ]

  const templates = [
    { value: "dynamic", label: "Dynamic", description: "Fast-paced transitions" },
    { value: "smooth", label: "Smooth", description: "Gradual, flowing animations" },
    { value: "minimal", label: "Minimal", description: "Simple, clean approach" },
    { value: "explosive", label: "Explosive", description: "High-energy, impactful" }
  ]

  return (
    <div className="space-y-6 p-6 glass rounded-2xl backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <Sparkles className="w-5 h-5 mr-2 text-primary" />
          Advanced Options
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => updateOptions({
            duration: 15,
            style: "modern",
            aspectRatio: "16:9",
            voiceover: false,
            musicIntensity: 50,
            template: "dynamic"
          })}
          className="text-xs hover:bg-white/10"
        >
          Reset
        </Button>
      </div>

      {/* Duration Selection */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-primary" />
          <label className="text-sm font-medium text-white">Duration</label>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {durations.map((duration) => (
            <button
              key={duration.value}
              onClick={() => updateOptions({ duration: duration.value })}
              className={`p-3 rounded-lg border transition-all text-center ${
                options.duration === duration.value
                  ? "border-primary bg-primary/20 text-primary"
                  : "border-white/20 hover:border-white/40 text-white"
              }`}
            >
              <div className="font-semibold">{duration.label}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {duration.badge}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Style Selection */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Palette className="w-4 h-4 text-primary" />
          <label className="text-sm font-medium text-white">Visual Style</label>
        </div>
        <Select value={options.style} onValueChange={(value) => updateOptions({ style: value })}>
          <SelectTrigger className="glass-input">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="glass border-white/20">
            {styles.map((style) => (
              <SelectItem key={style.value} value={style.value}>
                <div>
                  <div className="font-medium">{style.label}</div>
                  <div className="text-xs text-muted-foreground">{style.description}</div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Aspect Ratio */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Ratio className="w-4 h-4 text-primary" />
          <label className="text-sm font-medium text-white">Aspect Ratio</label>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {aspectRatios.map((ratio) => (
            <button
              key={ratio.value}
              onClick={() => updateOptions({ aspectRatio: ratio.value })}
              className={`p-3 rounded-lg border transition-all text-left ${
                options.aspectRatio === ratio.value
                  ? "border-primary bg-primary/20"
                  : "border-white/20 hover:border-white/40"
              }`}
            >
              <div className="font-medium text-white">{ratio.label}</div>
              <div className="text-xs text-muted-foreground">{ratio.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Template Style */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Zap className="w-4 h-4 text-primary" />
          <label className="text-sm font-medium text-white">Animation Template</label>
        </div>
        <Select value={options.template} onValueChange={(value) => updateOptions({ template: value })}>
          <SelectTrigger className="glass-input">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="glass border-white/20">
            {templates.map((template) => (
              <SelectItem key={template.value} value={template.value}>
                <div>
                  <div className="font-medium">{template.label}</div>
                  <div className="text-xs text-muted-foreground">{template.description}</div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Audio Options */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Volume2 className="w-4 h-4 text-primary" />
          <label className="text-sm font-medium text-white">Audio Options</label>
        </div>
        
        {/* Voiceover Toggle */}
        <div className="flex items-center justify-between p-3 glass rounded-lg">
          <div>
            <div className="font-medium text-white">AI Voiceover</div>
            <div className="text-xs text-muted-foreground">Add narration to your ad</div>
          </div>
          <Button
            variant={options.voiceover ? "default" : "outline"}
            size="sm"
            onClick={() => updateOptions({ voiceover: !options.voiceover })}
            className={options.voiceover ? "btn-premium" : "glass border-white/20"}
          >
            {options.voiceover ? "Enabled" : "Disabled"}
          </Button>
        </div>

        {/* Music Intensity */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-white">Background Music Intensity</span>
            <Badge variant="outline" className="text-primary border-primary/20">
              {options.musicIntensity}%
            </Badge>
          </div>
          <Slider
            value={[options.musicIntensity]}
            onValueChange={([value]) => updateOptions({ musicIntensity: value })}
            max={100}
            step={10}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Subtle</span>
            <span>Energetic</span>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="p-4 bg-white/5 rounded-lg border border-primary/20">
        <div className="text-xs text-muted-foreground mb-2">Generation Summary:</div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{options.duration}s duration</Badge>
          <Badge variant="secondary">{options.style} style</Badge>
          <Badge variant="secondary">{options.aspectRatio} ratio</Badge>
          <Badge variant="secondary">{options.template} animation</Badge>
          {options.voiceover && <Badge variant="secondary">Voiceover</Badge>}
        </div>
      </div>
    </div>
  )
}