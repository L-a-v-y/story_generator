import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, BookOpen, User, Share2, Heart, MessageSquare, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

// Mock data service to simulate fetching story from an API
const getStory = async (id: string) => {
  // This would be an API call in a real application
  return new Promise(resolve => {
    setTimeout(() => {
      // Sample data structure for our story
      resolve({
        id,
        title: "The Forgotten Realms",
        author: {
          id: "1",
          name: "Jane Smith",
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=Jane Smith`
        },
        description: "A young archaeologist discovers an ancient artifact that opens a portal to a world where forgotten gods still hold power. As the boundaries between worlds begin to blur, she must navigate political intrigue and magical dangers to prevent catastrophe in both realms.",
        genres: ["fantasy", "adventure", "mystery"],
        coverImage: "https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?q=80&w=500&h=800&auto=format&fit=crop",
        publishedDate: "2023-08-15",
        lastUpdated: "2023-09-20",
        stats: {
          reads: 2453,
          likes: 187,
          comments: 42
        },
        arcs: [
          {
            id: "arc1",
            title: "Discovery",
            description: "Elena discovers the artifact and begins experiencing strange phenomena, culminating in her first journey to the other realm.",
            episodes: [
              {
                id: "ep1",
                title: "Episode 1: Unearthed",
                summary: "Elena discovers the mysterious artifact during an archaeological dig in northern Turkey.",
                content: `FADE IN:

EXT. ARCHAEOLOGICAL DIG SITE - NORTHERN TURKEY - DAY

A sprawling excavation in a remote valley. Graduate students and workers carefully brush dirt from stone structures. DR. ELENA REYES (32), intense and focused, examines a tablet through a magnifying glass.

ELENA
(to herself)
This doesn't match any known Hittite or Phrygian symbolism.

Her assistant, DEVON (25), approaches.

DEVON
Dr. Reyes, you need to see this. We've found something in the lower chamber.

INT. UNDERGROUND CHAMBER - MOMENTS LATER

Elena descends on a rope ladder into a dust-filled room untouched for millennia. Her headlamp illuminates unusual architectural details.

ELENA
These support structures... they're not Roman or Greek. Not even Mesopotamian.

She approaches a stone altar in the center. On it lies a BRONZE DISC, about 8 inches in diameter, covered in strange symbols.

DEVON
Should I call Professor Harrington?

ELENA
(mesmerized by the disc)
Not yet. Let's document everything first.

She carefully photographs the disc from multiple angles.

ELENA
I've never seen this writing system before.

She puts down her camera and reaches for the disc.

DEVON
(worried)
Shouldn't you use gloves?

ELENA
Yes, I should.

She pulls gloves from her pocket, puts them on, then lifts the disc.

CLOSE ON: The disc GLOWS briefly when she touches it.

Elena's eyes unfocus momentarily, her expression one of shock.

DEVON
Dr. Reyes? Are you okay?

Elena blinks, returning to normal.

ELENA
(confused)
Did you see that?

DEVON
See what?

Elena stares at the disc, troubled.

ELENA
Nothing. Probably just dust in my eyes.

She carefully places the disc in a preservation container, but can't stop staring at it.

ELENA
Tell the team to pack up. We're taking this back to the university immediately.

OFF ELENA: Her usual scientific detachment replaced by an unfamiliar feeling - something between fear and fascination.

FADE OUT.`
              },
              {
                id: "ep2",
                title: "Episode 2: Strange Occurrences",
                summary: "Back at the university, Elena begins experiencing inexplicable phenomena linked to the artifact.",
                content: `FADE IN:

INT. UNIVERSITY LABORATORY - NIGHT

Elena works alone, examining the bronze disc under specialized equipment. Various screens display analyses in progress.

ELENA
(frustrated)
Material composition inconclusive. Dating inconclusive. Symbols match no known language database.

She leans back, rubbing her tired eyes. When she looks up, for a split second, a SHADOWY FIGURE appears to be standing across the room. She jumps, but it's gone.

ELENA
Hello? Is someone there?

Silence. She shakes her head and returns to work.

CLOSE ON: The disc under a microscope. The symbols appear to SHIFT slightly, then return to normal.

Elena blinks, puzzled. She adjusts the microscope.

ELENA
That's impossible.

The lights FLICKER. A cold breeze passes through the sealed room.

Elena's phone RINGS, startling her. It's PROFESSOR HARRINGTON.

ELENA
(answering)
James, it's late. Why are you—

PROFESSOR HARRINGTON (O.S.)
(agitated)
Have they started speaking to you yet?

ELENA
What? Who?

PROFESSOR HARRINGTON (O.S.)
The ones who wait between. The forgotten ones.

Elena looks disturbed.

ELENA
James, you're not making sense. Are you taking your medication?

PROFESSOR HARRINGTON (O.S.)
Listen very carefully, Elena. The boundaries are thinning. You've found a key.

INT. ELENA'S APARTMENT - LATER THAT NIGHT

Elena tosses in her sleep. DREAM IMAGES flash: a landscape with purple skies, floating islands, figures with too many limbs.

She wakes with a gasp to find all the objects in her bedroom LEVITATING a few inches off their surfaces. When she sits up, everything crashes down simultaneously.

INT. UNIVERSITY LABORATORY - THE NEXT DAY

Elena enters to find PROFESSOR JAMES HARRINGTON (68), frail but with sharp eyes, examining the disc.

ELENA
James. I didn't expect you here.

HARRINGTON
(surprisingly lucid)
I had a good morning. The fog lifted.

He points to his notes - detailed drawings of symbols from the disc.

HARRINGTON
I've seen these before. In dreams, mostly. But also in fragments from digs across multiple continents.

ELENA
That's not possible. We ran comparisons—

HARRINGTON
Your computers wouldn't find them because they're not looking in the right places.

He pulls out an old journal, shows her sketches that indeed match some symbols.

HARRINGTON
These don't belong to our world, Elena.

As he says this, the disc VIBRATES slightly. Both notice.

ELENA
(whispering)
What is happening, James?

HARRINGTON
(his lucidity fading)
They're waking up. The old ones. They know you have their key.

His eyes go unfocused, his momentary clarity evaporating.

HARRINGTON
(confused)
Elena? When did you get here? Are we having tea?

Elena looks from her mentor to the disc, deeply troubled.

FADE OUT.`
              },
              // Additional episodes would be here
            ]
          },
          // Additional arcs would be here
        ]
      });
    }, 800);
  });
};

const ReadStory = () => {
  const { storyId } = useParams();
  const { toast } = useToast();
  const [story, setStory] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentArcIndex, setCurrentArcIndex] = useState(0);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [fontSize, setFontSize] = useState("medium");
  const [readerTheme, setReaderTheme] = useState("light");

  useEffect(() => {
    const fetchStory = async () => {
      try {
        if (storyId) {
          const storyData = await getStory(storyId);
          setStory(storyData);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load story. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStory();
  }, [storyId, toast]);

  const currentArc = story?.arcs[currentArcIndex];
  const currentEpisode = currentArc?.episodes[currentEpisodeIndex];
  
  const totalEpisodes = story?.arcs.reduce((total: number, arc: any) => total + arc.episodes.length, 0) || 0;
  const currentEpisodeNumber = story?.arcs.slice(0, currentArcIndex).reduce(
    (count: number, arc: any) => count + arc.episodes.length, 0
  ) + currentEpisodeIndex + 1 || 0;
  
  const readingProgress = Math.round((currentEpisodeNumber / totalEpisodes) * 100);

  const navigateToNextEpisode = () => {
    if (!story) return;
    
    // If there are more episodes in the current arc
    if (currentEpisodeIndex < currentArc.episodes.length - 1) {
      setCurrentEpisodeIndex(currentEpisodeIndex + 1);
      window.scrollTo(0, 0);
      return;
    }
    
    // If there are more arcs
    if (currentArcIndex < story.arcs.length - 1) {
      setCurrentArcIndex(currentArcIndex + 1);
      setCurrentEpisodeIndex(0);
      window.scrollTo(0, 0);
      return;
    }
    
    // Reached the end of the story
    toast({
      title: "End of Story",
      description: "You've reached the end of this story.",
    });
  };

  const navigateToPreviousEpisode = () => {
    if (!story) return;
    
    // If there are previous episodes in the current arc
    if (currentEpisodeIndex > 0) {
      setCurrentEpisodeIndex(currentEpisodeIndex - 1);
      window.scrollTo(0, 0);
      return;
    }
    
    // If there are previous arcs
    if (currentArcIndex > 0) {
      setCurrentArcIndex(currentArcIndex - 1);
      // Set to the last episode of the previous arc
      const previousArc = story.arcs[currentArcIndex - 1];
      setCurrentEpisodeIndex(previousArc.episodes.length - 1);
      window.scrollTo(0, 0);
      return;
    }
    
    // Already at the beginning
    toast({
      title: "Beginning of Story",
      description: "You're at the beginning of this story.",
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: story?.title,
        text: `Check out this story: ${story?.title}`,
        url: window.location.href,
      }).catch(() => {
        // Fallback if share fails
        navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link Copied",
          description: "Story link copied to clipboard",
        });
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied",
        description: "Story link copied to clipboard",
      });
    }
  };

  const handleLike = () => {
    toast({
      title: "Story Liked",
      description: "You've liked this story.",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">
          <BookOpen className="h-12 w-12 text-primary/50" />
          <p className="mt-4 text-muted-foreground">Loading story...</p>
        </div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Story Not Found</h1>
          <p className="text-muted-foreground mb-8">
            We couldn't find the story you're looking for. It may have been removed or doesn't exist.
          </p>
          <Button asChild>
            <Link to="/">Return to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "min-h-screen bg-background",
      readerTheme === "dark" && "bg-slate-900 text-slate-50"
    )}>
      {/* Header */}
      <header className={cn(
        "sticky top-0 z-10 border-b",
        readerTheme === "dark" ? "bg-slate-900 border-slate-700" : "bg-white border-gray-200"
      )}>
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              asChild
            >
              <Link to="/">
                <ChevronLeft className="h-5 w-5" />
              </Link>
            </Button>
            
            <div className="ml-4 truncate max-w-[200px] md:max-w-md">
              <h1 className={cn(
                "text-lg font-serif font-medium",
                readerTheme === "dark" ? "text-white" : "text-primary"
              )}>
                {story.title}
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="text-muted-foreground"
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setFontSize("small")}>
                  Small Text
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFontSize("medium")}>
                  Medium Text
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFontSize("large")}>
                  Large Text
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setReaderTheme(theme => theme === "light" ? "dark" : "light")}>
                  Toggle Theme
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Progress bar */}
      <div className="w-full bg-muted">
        <Progress value={readingProgress} className="h-1 rounded-none" />
      </div>

      {/* Story Content */}
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center">
            <Avatar className="h-10 w-10">
              <AvatarImage src={story.author.avatar} alt={story.author.name} />
              <AvatarFallback>{story.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="ml-3">
              <p className="text-sm font-medium">{story.author.name}</p>
              <p className="text-sm text-muted-foreground">
                Published {new Date(story.publishedDate).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleShare}
              title="Share"
            >
              <Share2 className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleLike}
              title="Like"
            >
              <Heart className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="read" className="mb-8">
          <TabsList>
            <TabsTrigger value="read">Read</TabsTrigger>
            <TabsTrigger value="info">Story Info</TabsTrigger>
            <TabsTrigger value="episodes">Episodes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="read" className="animate-fade-in">
            {/* Episode Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-serif font-bold mb-1">{currentEpisode?.title}</h2>
              <p className="text-muted-foreground">{currentEpisode?.summary}</p>
            </div>
            
            {/* Episode Content */}
            <div className={cn(
              "prose max-w-none mb-12 whitespace-pre-line",
              fontSize === "small" && "text-sm",
              fontSize === "medium" && "text-base",
              fontSize === "large" && "text-lg",
              readerTheme === "dark" && "prose-invert"
            )}>
              {currentEpisode?.content}
            </div>
            
            {/* Navigation Buttons */}
            <div className="flex justify-between mt-12">
              <Button 
                variant="outline" 
                onClick={navigateToPreviousEpisode} 
                disabled={currentArcIndex === 0 && currentEpisodeIndex === 0}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous Episode
              </Button>
              <Button 
                onClick={navigateToNextEpisode}
                disabled={currentArcIndex === story.arcs.length - 1 && currentEpisodeIndex === currentArc.episodes.length - 1}
              >
                Next Episode
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="info">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/3">
                    <img 
                      src={story.coverImage} 
                      alt={story.title} 
                      className="w-full h-auto rounded-md shadow-md object-cover" 
                    />
                  </div>
                  <div className="md:w-2/3">
                    <h2 className="text-2xl font-serif font-bold mb-2">{story.title}</h2>
                    <p className="mb-4 text-muted-foreground">{story.description}</p>
                    
                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground mb-1">Genres</p>
                      <div className="flex flex-wrap gap-2">
                        {story.genres.map((genre: string) => (
                          <span 
                            key={genre} 
                            className="text-xs px-2 py-1 rounded-full bg-muted"
                          >
                            {genre}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-center mb-4">
                      <div>
                        <p className="text-xl font-bold">{story.stats.reads}</p>
                        <p className="text-xs text-muted-foreground">Reads</p>
                      </div>
                      <div>
                        <p className="text-xl font-bold">{story.stats.likes}</p>
                        <p className="text-xs text-muted-foreground">Likes</p>
                      </div>
                      <div>
                        <p className="text-xl font-bold">{story.stats.comments}</p>
                        <p className="text-xs text-muted-foreground">Comments</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Last updated: {new Date(story.lastUpdated).toLocaleDateString()}
                      </span>
                      
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={handleLike}
                        >
                          <Heart className="h-4 w-4 mr-1" />
                          Like
                        </Button>
                        <Button 
                          size="sm"
                          variant="ghost"
                          onClick={handleShare}
                        >
                          <Share2 className="h-4 w-4 mr-1" />
                          Share
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="episodes">
            <div className="space-y-6">
              {story.arcs.map((arc: any, arcIdx: number) => (
                <div key={arc.id} className="mb-8">
                  <h3 className="text-xl font-bold mb-2">{arc.title}</h3>
                  <p className="text-muted-foreground mb-4">{arc.description}</p>
                  
                  <div className="space-y-2">
                    {arc.episodes.map((episode: any, epIdx: number) => (
                      <Card 
                        key={episode.id}
                        className={cn(
                          "cursor-pointer hover:bg-accent/50 transition-colors",
                          currentArcIndex === arcIdx && currentEpisodeIndex === epIdx && "border-primary"
                        )}
                        onClick={() => {
                          setCurrentArcIndex(arcIdx);
                          setCurrentEpisodeIndex(epIdx);
                        }}
                      >
                        <CardContent className="p-4">
                          <h4 className="font-medium">{episode.title}</h4>
                          <p className="text-sm text-muted-foreground truncate">{episode.summary}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Comment section would go here */}
    </div>
  );
};

export default ReadStory;
