import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../App";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { BookOpen, Plus, LogOut, User, Settings, ChevronDown, Library, Pencil, BookText } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Story types
interface Story {
  id: string; 
  title: string; 
  genre: string; 
  lastEdited: string; 
  progress: number; 
  coverImage?: string;
}

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock story data
  const mockStories = [
    { 
      id: "story-1", 
      title: "The Crystal Labyrinth", 
      genre: "Fantasy/Adventure", 
      lastEdited: "Yesterday, 8:43 PM", 
      progress: 68, 
      coverImage: "https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?q=80&w=200&h=300&auto=format&fit=crop"
    },
    { 
      id: "story-2", 
      title: "Whispers in the Shadows", 
      genre: "Psychological Thriller", 
      lastEdited: "3 days ago", 
      progress: 42, 
      coverImage: "https://images.unsplash.com/photo-1547355253-ff0740f6e8c1?q=80&w=200&h=300&auto=format&fit=crop"
    },
    { 
      id: "story-3", 
      title: "Quantum Convergence", 
      genre: "Science Fiction", 
      lastEdited: "Last week", 
      progress: 89, 
      coverImage: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=200&h=300&auto=format&fit=crop"
    },
  ];

  // Load stories on mount
  useEffect(() => {
    const loadStories = async () => {
      try {
        // In real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Look for saved stories in localStorage
        const savedStoryKeys = Object.keys(localStorage).filter(key => key.startsWith('story-'));
        const savedStories = savedStoryKeys.map(key => {
          const storyData = JSON.parse(localStorage.getItem(key) || '{}');
          return {
            id: storyData.id || key,
            title: storyData.title || "Untitled Story",
            genre: (storyData.arcs?.[0]?.description || "").split(',')[0] || "General",
            lastEdited: new Date().toLocaleDateString(),
            progress: 100, // Completed stories are at 100%
            coverImage: `https://source.unsplash.com/random/200x300?sig=${Math.random()}`
          };
        });
        
        // Combine mock and saved stories
        setStories([...mockStories, ...savedStories]);
      } catch (error) {
        console.error("Failed to load stories:", error);
        toast({
          title: "Error",
          description: "Failed to load your stories. Please refresh the page.",
          variant: "destructive",
        });
        
        // Fall back to mock data
        setStories(mockStories);
      } finally {
        setLoading(false);
      }
    };
    
    loadStories();
  }, [toast]); // eslint-disable-line react-hooks/exhaustive-deps

  const continueStory = (storyId: string) => {
    // If the story is completed (100%), go to read view
    const story = stories.find(s => s.id === storyId);
    if (story && story.progress === 100) {
      navigate(`/read/${storyId}`);
    } else {
      // Otherwise go to edit view
      navigate(`/create/${storyId}`);
    }
  };

  const shareStory = (storyId: string) => {
    // Get the share URL
    const shareUrl = `${window.location.origin}/read/${storyId}`;
    
    // Try to use the Web Share API if available
    if (navigator.share) {
      navigator.share({
        title: stories.find(s => s.id === storyId)?.title || "Check out my story",
        url: shareUrl
      }).catch(() => {
        // Fallback if share fails
        navigator.clipboard.writeText(shareUrl);
        toast({
          title: "Link Copied",
          description: "Story link copied to clipboard",
        });
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link Copied",
        description: "Story link copied to clipboard",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <BookOpen className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-serif font-bold text-primary">Story Forge Studio</h1>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`} alt={user?.name} />
                  <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span>{user?.name}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => {
                logout();
                navigate("/login");
              }}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* User Profile Summary */}
      <section className="bg-gradient-to-b from-primary/10 to-background pt-10 pb-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <Avatar className="h-20 w-20 border-4 border-white shadow-md">
              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`} alt={user?.name} />
              <AvatarFallback className="text-2xl">{user?.name.charAt(0)}</AvatarFallback>
            </Avatar>
            
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-serif font-bold">{user?.name}'s Library</h2>
              <p className="text-muted-foreground mt-1">{user?.email}</p>
              
              <div className="flex gap-4 mt-4 flex-wrap justify-center md:justify-start">
                <div className="text-center">
                  <p className="text-2xl font-bold">{stories.length}</p>
                  <p className="text-sm text-muted-foreground">Stories</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{stories.filter(s => s.progress === 100).length}</p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-muted-foreground">Collaborations</p>
                </div>
              </div>
            </div>
            
            <div className="md:ml-auto flex flex-col sm:flex-row gap-3">
              <Button asChild className="flex gap-2">
                <Link to="/create">
                  <Pencil className="h-4 w-4" />
                  Create Story
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-serif font-bold">Your Stories</h2>
        </div>

        {/* Story Gallery */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse flex flex-col items-center">
              <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Loading your stories...</p>
            </div>
          </div>
        ) : stories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((story) => (
              <Card key={story.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="h-3 bg-primary" style={{ width: `${story.progress}%` }}></div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-serif font-bold mb-2">{story.title}</h3>
                  <div className="flex justify-between text-sm text-muted-foreground mb-4">
                    <span>{story.genre}</span>
                    <span>Edited {story.lastEdited}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{story.progress}% Complete</span>
                    {story.progress === 100 && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        Completed
                      </span>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="px-6 py-4 bg-muted/30 flex justify-between">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => continueStory(story.id)}
                    className="gap-2"
                  >
                    {story.progress === 100 ? (
                      <>
                        <BookText className="h-4 w-4" />
                        Read
                      </>
                    ) : (
                      <>Continue</>
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => shareStory(story.id)}
                  >
                    Share
                  </Button>
                </CardFooter>
              </Card>
            ))}
            
            {/* Create New Story Card */}
            <Card className="border-2 border-dashed border-muted hover:border-primary/50 transition-colors flex items-center justify-center h-[224px]">
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <Button variant="ghost" size="lg" className="h-20 w-20 rounded-full" asChild>
                  <Link to="/create">
                    <Plus className="h-10 w-10 text-muted-foreground" />
                  </Link>
                </Button>
                <p className="mt-4 font-medium">Create New Story</p>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="text-center py-12 bg-muted/30 rounded-lg">
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">No stories yet</h3>
            <p className="text-muted-foreground mb-6">
              Create your first story to get started
            </p>
            <Button asChild>
              <Link to="/create">
                <Plus className="mr-2 h-4 w-4" />
                Create Story
              </Link>
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
