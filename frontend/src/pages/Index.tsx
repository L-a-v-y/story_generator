
import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../App";
import { Button } from "@/components/ui/button";
import { BookOpen, Feather, BookText, Users, ArrowRight } from "lucide-react";

const Index = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If authenticated, redirect to dashboard
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // If not authenticated, show landing page
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <BookOpen className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-serif font-bold text-primary">Story Forge Studio</h1>
            </div>
            
            <div className="flex gap-3">
              <Button variant="outline" asChild>
                <Link to="/login">Log in</Link>
              </Button>
              <Button asChild>
                <Link to="/signup">Sign up</Link>
              </Button>
            </div>
          </div>
        </header>

        {/* Hero section */}
        <section className="py-20 px-4 bg-gradient-to-b from-primary/10 to-background">
          <div className="container mx-auto text-center max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">Unleash Your Storytelling Potential</h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Craft compelling stories with our AI-powered writing assistant. From outline to final draft, Story Forge Studio guides you every step of the way.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg" asChild>
                <Link to="/signup">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg" asChild>
                <Link to="/login">Log in</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features section */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl font-serif font-bold text-center mb-12">How It Works</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Feather className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Create Your Outline</h3>
                <p className="text-muted-foreground">
                  Start with a basic outline and let our AI help you structure your story with compelling plot points.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookText className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Develop Characters</h3>
                <p className="text-muted-foreground">
                  Build rich, detailed characters with unique personalities, backgrounds, and motivations.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Share Your Work</h3>
                <p className="text-muted-foreground">
                  Collaborate with others, get feedback, and publish your stories to share with the world.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials/CTA */}
        <section className="py-16 px-4 bg-primary/5">
          <div className="container mx-auto text-center max-w-3xl">
            <h2 className="text-3xl font-serif font-bold mb-10">Ready to Write Your Story?</h2>
            <p className="text-xl mb-8">
              Join thousands of writers who are creating amazing stories with Story Forge Studio.
            </p>
            <Button size="lg" className="text-lg" asChild>
              <Link to="/signup">
                Start Writing Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-10 px-4 bg-muted">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-2 mb-4 md:mb-0">
                <BookOpen className="h-5 w-5 text-primary" />
                <span className="font-serif font-bold">Story Forge Studio</span>
              </div>
              
              <div className="text-center md:text-right text-sm text-muted-foreground">
                <p>© 2025 Story Forge Studio. All rights reserved.</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // This will only show briefly during redirect if the user is authenticated
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-serif font-bold mb-4">Story Forge Studio</h1>
        <p className="text-xl text-muted-foreground">Redirecting to dashboard...</p>
      </div>
    </div>
  );
};

export default Index;
