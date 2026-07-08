import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { Button } from '../components/ui/button';
import { 
  Zap, 
  Shield, 
  BarChart3, 
  ArrowRight, 
  Link2, 
  Copy, 
  Check, 
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useState } from 'react';

export default function LandingPage() {
  const [copied, setCopied] = useState(false);
  const mockShortLink = "snapurl.co/r/youtube";

  const handleCopyMock = () => {
    navigator.clipboard.writeText(`https://${mockShortLink}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col scroll-smooth">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32 flex flex-col items-center justify-center text-center px-4">
        {/* Glow effect */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          <div className="inline-flex items-center space-x-2 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>Shorten, track, and optimize your links</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1]">
            Simplify Your Links, <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-muted-foreground">
              Amplify Your Reach
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Create clean, memorable links in seconds. Track detailed click analytics to understand your audience better. Completely free.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
            <Button size="lg" asChild className="group">
              <Link to="/register" className="flex items-center">
                Get Started for Free 
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="#features">See How it Works</a>
            </Button>
          </div>
        </div>

        {/* Live Interactive Shortener Demo Preview */}
        <div className="w-full max-w-4xl mx-auto mt-16 px-2 relative z-10">
          <div className="rounded-xl border border-border bg-card/60 backdrop-blur-sm p-2 sm:p-4 shadow-2xl">
            {/* Window header decoration */}
            <div className="flex items-center space-x-2 pb-4 border-b border-border/60 mb-4 px-2">
              <div className="w-3 h-3 rounded-full bg-red-400/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
              <div className="w-3 h-3 rounded-full bg-green-400/80" />
              <span className="text-xs text-muted-foreground/60 pl-2 select-none font-mono">snapurl-demo.exe</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              <div className="md:col-span-8">
                <div className="text-left bg-muted/50 border border-border/80 rounded-lg p-3 font-mono text-sm text-foreground/80 truncate">
                  https://www.youtube.com/watch?v=4KNqAH5Xkv0
                </div>
              </div>
              <div className="md:col-span-4 flex items-center gap-2">
                <ChevronRight className="h-5 w-5 text-muted-foreground hidden md:block" />
                <div className="flex-1 flex items-center justify-between bg-primary/5 border border-primary/20 rounded-lg p-3 font-mono text-sm font-semibold text-primary truncate">
                  <span>{mockShortLink}</span>
                  <button 
                    onClick={handleCopyMock}
                    className="p-1 rounded hover:bg-primary/10 text-primary transition-colors ml-2"
                    title="Copy Link"
                  >
                    {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 lg:py-32 border-t border-border bg-muted/20">
        <div className="max-w-screen-xl mx-auto px-4 md:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
              Packed with powerful features
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg">
              Everything you need to create and manage links, track engagements, and keep your marketing clean.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6">
            {/* Feature 1 */}
            <div className="flex flex-col space-y-4 p-6 bg-card border border-border rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Lightning Fast</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Shorten your URLs instantly. Our optimized redirect architecture ensures your visitors reach their destination with zero delay.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col space-y-4 p-6 bg-card border border-border rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Detailed Analytics</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Monitor your link metrics in real-time. Know exactly how many clicks your links get so you can measure audience engagement.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col space-y-4 p-6 bg-card border border-border rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Secure & Private</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                All accounts and generated links are encrypted and stored safely. We focus on keeping your links safe from redirection scams.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 lg:py-32 border-t border-border">
        <div className="max-w-screen-xl mx-auto px-4 md:px-8 space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
              How it works
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg">
              Get your custom short links up and running in just three simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative pt-6">
            {/* Step 1 */}
            <div className="text-center space-y-4 relative">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg mx-auto shadow-md">
                1
              </div>
              <h3 className="text-lg font-bold text-foreground">Paste Your URL</h3>
              <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                Paste your long, messy link into our dashboard inputs.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center space-y-4 relative">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg mx-auto shadow-md">
                2
              </div>
              <h3 className="text-lg font-bold text-foreground">Get Your Snip</h3>
              <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                Our server generates a unique, optimized 6-character short code.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center space-y-4 relative">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg mx-auto shadow-md">
                3
              </div>
              <h3 className="text-lg font-bold text-foreground">Track Engagements</h3>
              <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                Copy and share the link. Monitor clicks directly in your personal links list.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/40 border-t border-b border-border text-center px-4 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-2xl mx-auto space-y-6 relative z-10">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
            Simplify your link sharing today
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg">
            Create an account in 15 seconds and start shortening your URLs.
          </p>
          <div className="pt-2">
            <Button size="lg" asChild className="group">
              <Link to="/register">
                Sign Up for Free 
                <ChevronRight className="ml-1 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t border-border py-8 px-4 mt-auto">
        <div className="max-w-screen-xl mx-auto flex flex-col sm:flex-row items-center justify-between text-muted-foreground text-sm">
          <div className="flex items-center space-x-2 mb-4 sm:mb-0">
            <Link2 className="h-4 w-4 text-primary" />
            <span className="font-bold text-foreground">SnapURL</span>
            <span>&copy; {new Date().getFullYear()}</span>
          </div>
          <div className="flex space-x-6">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a>
            <Link to="/login" className="hover:text-foreground transition-colors">Login</Link>
            <Link to="/register" className="hover:text-foreground transition-colors">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
