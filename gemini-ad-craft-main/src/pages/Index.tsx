import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown"; // CORRECTED IMPORT
import { Sparkles } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { GlassInput } from "@/components/ui/glass-input";
import { PremiumButton } from "@/components/ui/premium-button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { VideoPlayer } from "@/components/video-player";
import { ProjectHistory } from "@/components/project-history";
import { ThemeToggle } from "@/components/theme-toggle";
import { AuthModals } from "@/components/auth-modals";
import { AdOptions } from "@/components/ad-options";
import heroBackground from "@/assets/hero-background.jpg";

// Define the type for the options state from AdOptions component
interface AdGenerationOptions {
  duration: number;
  style: string;
  aspectRatio: string;
  voiceover: boolean;
  musicIntensity: number;
  template: string;
}

// This function contains the actual API call logic
const generateAdScript = async (payload: { prompt: string, options: AdGenerationOptions | null }) => {
  const response = await fetch('http://localhost:3000/api/response', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Failed to generate ad script. Please try again.');
  }

  return response.json();
};

const Index = () => {
  const [inputText, setInputText] = useState("");
  const [adOptions, setAdOptions] = useState<AdGenerationOptions | null>(null);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(true);

  // TanStack Query mutation hook to handle the API call
  const { mutate, isPending, isSuccess, data, error, reset } = useMutation({
    mutationFn: generateAdScript,
    onSuccess: () => {
      toast({
        title: "Ad Generated Successfully!",
        description: "Your stunning advertisement script is ready.",
      });
    },
    onError: (err) => {
      toast({
        title: "An Error Occurred",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  const handleGenerate = () => {
    if (!inputText.trim()) {
      toast({
        title: "Please enter some ad copy",
        description: "We need text to generate your advertisement.",
        variant: "destructive",
      });
      return;
    }
    mutate({ prompt: inputText, options: adOptions });
  };

  const handleReset = () => {
    setInputText("");
    reset(); // Reset the mutation state from react-query
  };

  return (
    <div className="min-h-screen bg-gradient-hero relative overflow-hidden flex">
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url(${heroBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      <div className="absolute inset-0 bg-gradient-glow animate-float opacity-50" />
      
      {showHistory && (
        <ProjectHistory 
          onNewProject={() => {
            handleReset();
          }}
          onSelectProject={(project) => {
            setInputText(project.title);
            // In a real app, you might fetch the result for this project
            // For now, we'll just set the text
          }}
        />
      )}
      
      <div className="flex-1 relative z-10">
        <header className="flex items-center justify-between p-6">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Sparkles className="w-6 h-6 text-primary" />
            </button>
            <span className="text-2xl font-bold text-white">AdGenius</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <PremiumButton
              variant="ghost"
              size="sm"
              onClick={() => setIsSignInOpen(true)}
              className="text-white hover:bg-white/10"
            >
              Sign In
            </PremiumButton>
            <PremiumButton
              size="sm"
              onClick={() => setIsSignUpOpen(true)}
              className="px-6"
            >
              Sign Up
            </PremiumButton>
          </div>
        </header>

        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-88px)] px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-4xl mx-auto text-center">
          
            {!isPending && !isSuccess && !error && (
              <div className="space-y-8 animate-fade-in">
                <div className="space-y-4">
                  <h1 className="text-6xl sm:text-8xl lg:text-9xl font-bold text-white tracking-tight">
                    HI
                  </h1>
                  <div className="w-16 h-1 bg-gradient-primary mx-auto rounded-full animate-glow" />
                </div>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-12">
                  Craft stunning campaigns,{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-primary">
                    instantly.
                  </span>
                </h2>

                <div className="max-w-2xl mx-auto space-y-6">
                  <GlassInput
                    variant="hero"
                    placeholder="Enter your ad copy here... (e.g., 'Revolutionary fitness app that transforms lives')"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                    className="text-center"
                  />
                  <PremiumButton
                    variant="hero"
                    size="xl"
                    onClick={handleGenerate}
                    className="w-full sm:w-auto px-12"
                  >
                    <Sparkles className="w-5 h-5" />
                    Generate Ad
                  </PremiumButton>
                </div>

                <div className="mt-8">
                  <AdOptions onOptionsChange={(options) => setAdOptions(options)} />
                </div>

                <p className="text-muted-foreground text-sm max-w-md mx-auto">
                  Our AI transforms your text into captivating video advertisements 
                  optimized for maximum engagement.
                </p>
              </div>
            )}

            {isPending && (
              <div className="space-y-8 animate-fade-in">
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8">
                  Creating Your{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-primary">
                    Masterpiece
                  </span>
                </h2>
                <LoadingSpinner className="my-12" />
                <div className="max-w-md mx-auto">
                  <div className="glass rounded-2xl p-6">
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      "Your copy is being transformed into a stunning visual campaign 
                      using advanced AI algorithms..."
                    </p>
                  </div>
                </div>
              </div>
            )}

            {isSuccess && (
              <div className="space-y-8 animate-fade-in">
                <div className="space-y-4">
                  <h2 className="text-3xl sm:text-4xl font-bold text-white">
                    Your Ad is{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-primary">
                      Ready!
                    </span>
                  </h2>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Here's your professionally crafted advertisement. 
                    Download it or generate a new variation.
                  </p>
                </div>

                <VideoPlayer
                  videoUrl={data?.videoUrl ? `http://localhost:3000${data.videoUrl}` : undefined}
                  onRegenerate={handleGenerate}
                  onDownload={() => {
                    if (data?.videoUrl) {
                      const link = document.createElement('a');
                      link.href = `http://localhost:3000${data.videoUrl}`;
                      link.download = `${data.title || 'ad'}.mp4`;
                      link.click();
                    }
                  }}
                />

                {/* Debug info */}
                {data?.videoUrl && (
                  <div className="mt-4 p-3 bg-black/20 rounded-lg text-xs text-muted-foreground">
                    <strong>Debug:</strong> Video URL: {`http://localhost:3000${data.videoUrl}`}
                  </div>
                )}

                {data?.title && (
                  <div className="max-w-2xl mx-auto my-4 text-left p-6 glass rounded-2xl">
                    <h3 className="text-lg font-semibold text-white mb-2">Generated Ad: {data.title}</h3>
                    <p className="text-muted-foreground">Video successfully created and ready for download.</p>
                  </div>
                )}

                <PremiumButton
                  variant="glass"
                  onClick={handleReset}
                  className="mt-8"
                >
                  Create Another Ad
                </PremiumButton>
              </div>
            )}
            
            {error && (
              <div className="space-y-8 animate-fade-in">
                <h2 className="text-3xl font-bold text-red-500">Generation Failed</h2>
                <p className="text-muted-foreground">{error.message}</p>
                <PremiumButton variant="glass" onClick={handleReset}>
                    Try Again
                </PremiumButton>
              </div>
            )}
          </div>
        </div>
      </div>

      <AuthModals
        isSignInOpen={isSignInOpen}
        setIsSignInOpen={setIsSignInOpen}
        isSignUpOpen={isSignUpOpen}
        setIsSignUpOpen={setIsSignUpOpen}
      />
    </div>
  );
};

export default Index;