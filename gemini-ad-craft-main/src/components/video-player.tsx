import { useState } from "react";
import { Play, Pause, Download, RotateCcw } from "lucide-react";
import { PremiumButton } from "./ui/premium-button";
import { cn } from "@/lib/utils";

interface VideoPlayerProps {
  videoUrl?: string;
  onRegenerate: () => void;
  onDownload: () => void;
  className?: string;
}

export const VideoPlayer = ({ 
  videoUrl, 
  onRegenerate, 
  onDownload, 
  className 
}: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className={cn("w-full max-w-2xl mx-auto", className)}>
      {/* Video Container */}
      <div className="relative rounded-2xl overflow-hidden glass glow-primary group">
        {videoUrl ? (
          <video 
            className="w-full aspect-video object-cover rounded-2xl"
            controls
            preload="metadata"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            crossOrigin="anonymous"
          >
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <>
            <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              {/* Placeholder for video */}
              <div className="text-center p-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-primary flex items-center justify-center">
                  {isPlaying ? (
                    <Pause className="w-6 h-6 text-white" />
                  ) : (
                    <Play className="w-6 h-6 text-white ml-1" />
                  )}
                </div>
                <h3 className="text-xl font-semibold mb-2">Your Ad is Ready!</h3>
                <p className="text-muted-foreground">Click to preview your generated advertisement</p>
              </div>
            </div>
            
            {/* Play Button Overlay - Only for placeholder */}
            <button
              onClick={togglePlay}
              className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform duration-200">
                {isPlaying ? (
                  <Pause className="w-8 h-8 text-white" />
                ) : (
                  <Play className="w-8 h-8 text-white ml-1" />
                )}
              </div>
            </button>
          </>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mt-6">
        <PremiumButton
          variant="glass"
          size="lg"
          onClick={onRegenerate}
          className="flex-1"
        >
          <RotateCcw className="w-5 h-5" />
          Regenerate
        </PremiumButton>
        
        <PremiumButton
          variant="premium"
          size="lg"
          onClick={onDownload}
          className="flex-1"
        >
          <Download className="w-5 h-5" />
          Download
        </PremiumButton>
      </div>
    </div>
  );
};