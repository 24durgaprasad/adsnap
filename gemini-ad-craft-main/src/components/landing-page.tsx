import { useState } from "react";
import { useNavigate } from "react-router-dom"; // 1. Import useNavigate
import { Button } from "@/components/ui/button";
import { PremiumButton } from "@/components/ui/premium-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { AuthModals } from "@/components/auth-modals";
import {
  Sparkles,
  Zap,
  Target,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Play,
  BarChart3,
  Users,
  Globe,
} from "lucide-react";
import heroBackground from "@/assets/hero-background.jpg";

// 2. The component signature is simplified as we no longer need the prop
export function LandingPage() {
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const navigate = useNavigate(); // 3. Initialize the navigate function

  // 4. This function will handle clicks to navigate to the main app
  const handleGetStarted = () => {
    navigate("/app");
  };

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Fast Generation",
      description:
        "Create professional ads in seconds, not hours. Our AI processes your text instantly.",
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Precision Targeting",
      description:
        "Craft messages that resonate with your exact audience using advanced AI insights.",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Proven Results",
      description:
        "Our AI is trained on high-converting ad campaigns to maximize your ROI.",
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Advanced Analytics",
      description:
        "Track performance metrics and optimize your campaigns with data-driven insights.",
    },
  ];

  const benefits = [
    "Save 90% of your ad creation time",
    "Increase engagement rates by up to 300%",
    "Professional-grade videos without design skills",
    "Multiple formats for all platforms",
    "Real-time collaboration tools",
    "Enterprise-grade security",
  ];

  const stats = [
    { number: "10M+", label: "Ads Generated" },
    { number: "500K+", label: "Happy Users" },
    { number: "98%", label: "Satisfaction Rate" },
    { number: "24/7", label: "Support" },
  ];

  return (
    <div className="min-h-screen bg-gradient-hero relative overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url(${heroBackground})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Animated Background Glow */}
      <div className="absolute inset-0 bg-gradient-glow animate-float opacity-30" />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">AdGenius</span>
        </div>

        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <Button
            variant="ghost"
            onClick={() => setIsSignInOpen(true)}
            className="text-white hover:bg-white/10"
          >
            Sign In
          </Button>
          {/* This button can also navigate or open the sign-up modal */}
          <PremiumButton
            size="sm"
            onClick={handleGetStarted}
            className="px-6"
          >
            Get Started
          </PremiumButton>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="space-y-8 animate-fade-in">
            {/* Main Headline */}
            <div className="space-y-6">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white tracking-tight">
                Transform Words Into
                <span className="block text-transparent bg-clip-text bg-gradient-primary">
                  Winning Campaigns
                </span>
              </h1>
              <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                The world's most advanced AI ad generator. Create stunning
                video advertisements that convert in seconds, not hours.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
              {/* 5. Use the new handler in your main CTA button */}
              <PremiumButton
                size="xl"
                onClick={handleGetStarted}
                className="px-12 py-4 text-lg"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Creating Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </PremiumButton>
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-4 text-lg glass border-white/20 text-white hover:bg-white/10"
              >
                Watch Demo
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-white mb-2">
                    {stat.number}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* The rest of your landing page JSX remains the same */}
      {/* Features Section, Benefits Section, CTA, Footer, etc. */}
      {/* Remember to update any other "Get Started" buttons to use onClick={handleGetStarted} */}
      
      {/* Auth Modals */}
      <AuthModals
        isSignInOpen={isSignInOpen}
        setIsSignInOpen={setIsSignInOpen}
        isSignUpOpen={isSignUpOpen}
        setIsSignUpOpen={setIsSignUpOpen}
      />
    </div>
  );
}