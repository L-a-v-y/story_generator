import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, MessageSquarePlus, Send } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface EpisodeStageProps {
  storyData: {
    title: string;
    arcs: {
      title: string;
      overview: string;
      episodes: {
        numberOfEpisodes: number;
        episodeInfo: Record<string, string>;
        episodeDetails: Record<string, string>;
      };
    }[];
  };
  updateStoryData: (data: any) => void;
  onNextStage: () => void;
}

// Function to generate dummy data for testing
const generateDummyData = () => {
  const arcs = [
    {
      title: "The Beginning",
      overview: "This story arc sets up the main characters and introduces the central conflict that will drive the story forward.",
      episodes: {
        numberOfEpisodes: 3,
        episodeInfo: {
          "Episode 1: Introduction": "We meet our protagonist as they go about their everyday life, unaware of the adventure that awaits.",
          "Episode 2: The Call": "A mysterious event disrupts the protagonist's normal routine, presenting them with an opportunity for adventure.",
          "Episode 3: First Challenge": "The protagonist faces their first real obstacle, giving us insight into their character and abilities."
        },
        episodeDetails: {
          "Episode 1: Introduction": "The story opens in a small coastal town where our protagonist, Alex, works as a local librarian. We see them interacting with townspeople, showcasing their knowledge and helpful nature. The episode ends with Alex discovering an ancient book with strange markings hidden in the library basement.",
          "Episode 2: The Call": "After finding the book, Alex begins to experience strange dreams and visions. Meanwhile, unusual weather patterns begin affecting the town. A mysterious stranger arrives, claiming to know about the book and warning Alex of impending danger.",
          "Episode 3: First Challenge": "Alex must decipher the first pages of the book to stop increasingly dangerous weather phenomena threatening the town. Working with the stranger, they discover they have latent magical abilities that are awakened by the book's presence."
        }
      }
    },
    {
      title: "Rising Tensions",
      overview: "The stakes increase as our characters begin to understand the true nature of their quest and face more dangerous obstacles.",
      episodes: {
        numberOfEpisodes: 2,
        episodeInfo: {
          "Episode 4: The Journey Begins": "Our characters leave the safety of familiar surroundings and venture into unknown territory.",
          "Episode 5: New Allies and Enemies": "The group encounters other characters who will either help or hinder their progress."
        },
        episodeDetails: {
          "Episode 4: The Journey Begins": "Alex and the stranger (now revealed to be Elara, a guardian from a hidden magical society) must leave town as dark forces have detected the book's awakening. They set out for a hidden sanctuary, encountering their first magical creatures along the way. Alex struggles with leaving their old life behind.",
          "Episode 5: New Allies and Enemies": "On the road to the sanctuary, Alex and Elara meet Marcus, a rogue magic user with questionable motives who offers to help them. They also encounter their first real adversary, a hunter tracking them on behalf of a mysterious organization called The Veil."
        }
      }
    },
    {
      title: "The Revelation",
      overview: "Key secrets are revealed that change the characters' understanding of their quest and their own identities.",
      episodes: {
        numberOfEpisodes: 2,
        episodeInfo: {
          "Episode 6: Truth Uncovered": "A major revelation forces the characters to reconsider everything they thought they knew.",
          "Episode 7: Difficult Choices": "In light of new information, difficult decisions must be made that will affect the course of the journey."
        },
        episodeDetails: {
          "Episode 6: Truth Uncovered": "Arriving at the sanctuary, Alex discovers that they are descended from an ancient line of guardians sworn to protect the book, which contains spells capable of altering reality itself. Additionally, they learn that Elara has been withholding critical information about the dangers they face.",
          "Episode 7: Difficult Choices": "With The Veil closing in on the sanctuary, Alex must decide whether to continue embracing their newfound powers and responsibilities or attempt to return to their normal life. Meanwhile, Marcus reveals his true intentions, complicating the group's dynamics."
        }
      }
    }
  ];

  return { title: "The Awakening Chronicles", arcs };
};

const EpisodeStage = ({ storyData: initialStoryData, updateStoryData, onNextStage }: EpisodeStageProps) => {
  // Check if we have arcs data, if not, use dummy data for testing
  const [storyData, setLocalStoryData] = useState(() => {
    if (initialStoryData.arcs && initialStoryData.arcs.length > 0) {
      return initialStoryData;
    }
    return generateDummyData();
  });
  
  // Sync local data with parent component
  useEffect(() => {
    if (initialStoryData.arcs && initialStoryData.arcs.length > 0) {
      setLocalStoryData(initialStoryData);
    }
  }, [initialStoryData]);

  const { title, arcs } = storyData;
  const { toast } = useToast();
  
  const [currentArcIndex, setCurrentArcIndex] = useState(0);
  const [suggestion, setSuggestion] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  const [isSuggestionOpen, setIsSuggestionOpen] = useState(false);
  const [selectedEpisode, setSelectedEpisode] = useState<string | null>(null);
  const [episodeDetail, setEpisodeDetail] = useState("");
  const [isEditingEpisode, setIsEditingEpisode] = useState(false);
  const [editName, setEditName] = useState("");
  const [editOverview, setEditOverview] = useState("");
  const [isAddingEpisode, setIsAddingEpisode] = useState(false);
  
  const currentArc = arcs[currentArcIndex];
  const totalArcs = arcs.length;
  
  // Update both local state and parent component
  const handleUpdateStoryData = (data: any) => {
    const updatedData = { ...storyData, ...data };
    setLocalStoryData(updatedData);
    updateStoryData(data);
  };

  const handleApplySuggestion = async () => {
    if (!suggestion.trim()) {
      toast({
        title: "Empty Suggestion",
        description: "Please enter a suggestion first",
        variant: "destructive",
      });
      return;
    }
    
    setIsApplying(true);
    
    try {
      // Simulate API call to generate updated episodes
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Example of updating episode info based on suggestion
      const updatedArcs = [...arcs];
      const updatedEpisodeInfo = { ...currentArc.episodes.episodeInfo };
      
      // Update the first episode as an example
      const keys = Object.keys(updatedEpisodeInfo);
      if (keys.length > 0) {
        updatedEpisodeInfo[keys[0]] = `${updatedEpisodeInfo[keys[0]]} (Updated based on your suggestion: "${suggestion}")`;
      }
      
      updatedArcs[currentArcIndex] = {
        ...currentArc,
        episodes: {
          ...currentArc.episodes,
          episodeInfo: updatedEpisodeInfo
        }
      };
      
      handleUpdateStoryData({
        arcs: updatedArcs
      });
      
      setSuggestion("");
      
      toast({
        title: "Suggestion Applied",
        description: "Episode information has been updated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to apply suggestion. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsApplying(false);
    }
  };
  
  const viewEpisodeDetail = (episodeName: string) => {
    setSelectedEpisode(episodeName);
    setEpisodeDetail(currentArc.episodes.episodeDetails[episodeName] || "No details available for this episode yet.");
  };
  
  const startEditingEpisode = (episodeName: string) => {
    setIsEditingEpisode(true);
    setEditName(episodeName);
    setEditOverview(currentArc.episodes.episodeInfo[episodeName] || "");
  };
  
  const saveEpisodeEdit = () => {
    if (!editName) return;
    
    const updatedArcs = [...arcs];
    const updatedEpisodeInfo = { ...currentArc.episodes.episodeInfo };
    const updatedEpisodeDetails = { ...currentArc.episodes.episodeDetails };
    
    if (editName !== selectedEpisode && selectedEpisode) {
      // Rename the episode
      delete updatedEpisodeInfo[selectedEpisode];
      
      // Move details to new name
      if (updatedEpisodeDetails[selectedEpisode]) {
        updatedEpisodeDetails[editName] = updatedEpisodeDetails[selectedEpisode];
        delete updatedEpisodeDetails[selectedEpisode];
      }
    }
    
    updatedEpisodeInfo[editName] = editOverview;
    
    updatedArcs[currentArcIndex] = {
      ...currentArc,
      episodes: {
        ...currentArc.episodes,
        episodeInfo: updatedEpisodeInfo,
        episodeDetails: updatedEpisodeDetails
      }
    };
    
    handleUpdateStoryData({
      arcs: updatedArcs
    });
    
    setIsEditingEpisode(false);
    setSelectedEpisode(editName);
    
    toast({
      title: "Episode Updated",
      description: `Episode "${editName}" has been updated`,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleApplySuggestion();
    }
  };
  
  const navigateArc = (direction: 'next' | 'prev') => {
    let newIndex;
    if (direction === 'next') {
      newIndex = Math.min(currentArcIndex + 1, totalArcs - 1);
    } else {
      newIndex = Math.max(currentArcIndex - 1, 0);
    }
    
    setCurrentArcIndex(newIndex);
    setSelectedEpisode(null);
    setIsEditingEpisode(false);
  };
  
  const addNewEpisode = async () => {
    setIsAddingEpisode(true);
    
    try {
      // Simulate backend processing
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newEpisodeName = `Episode ${Object.keys(currentArc.episodes.episodeInfo).length + 1}: New Episode`;
      const updatedArcs = [...arcs];
      
      const updatedEpisodeInfo = { 
        ...currentArc.episodes.episodeInfo,
        [newEpisodeName]: "Overview of the new episode. Describe the key events that occur."
      };
      
      const updatedEpisodeDetails = {
        ...currentArc.episodes.episodeDetails,
        [newEpisodeName]: "Detailed description of this episode. Include dialogue, character actions, and scene descriptions."
      };
      
      updatedArcs[currentArcIndex] = {
        ...currentArc,
        episodes: {
          ...currentArc.episodes,
          episodeInfo: updatedEpisodeInfo,
          episodeDetails: updatedEpisodeDetails
        }
      };
      
      handleUpdateStoryData({
        arcs: updatedArcs
      });
      
      setSelectedEpisode(newEpisodeName);
      
      toast({
        title: "Episode Added",
        description: `New episode "${newEpisodeName}" has been created.`
      });
    } finally {
      setIsAddingEpisode(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold mb-2">Episodes</h1>
        <p className="text-muted-foreground">
          Create episodes for the story arcs
        </p>
      </div>
      
      {/* Arc Navigation */}
      <div className="flex items-center justify-between mb-6">
        <Button 
          variant="outline" 
          onClick={() => navigateArc('prev')}
          disabled={currentArcIndex === 0}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Previous Arc
        </Button>
        
        <div className="text-center">
          <h2 className="font-medium">
            Arc {currentArcIndex + 1} of {totalArcs}
          </h2>
        </div>
        
        <Button 
          variant="outline" 
          onClick={() => navigateArc('next')}
          disabled={currentArcIndex === totalArcs - 1}
        >
          Next Arc <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Arc Overview</CardTitle>
          <CardDescription>{title} - {currentArc.title}</CardDescription>
        </CardHeader>
        <CardContent>
          <p>{currentArc.overview}</p>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {Object.entries(currentArc.episodes.episodeInfo).map(([name, overview]) => (
          <Card 
            key={name} 
            className={cn(
              "cursor-pointer transition-all duration-200 hover:shadow-md",
              selectedEpisode === name && "ring-2 ring-primary"
            )}
            onClick={() => viewEpisodeDetail(name)}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm line-clamp-3">{overview}</p>
            </CardContent>
          </Card>
        ))}
        
        <Card 
          className={cn(
            "cursor-pointer border-dashed hover:border-primary hover:shadow-md flex items-center justify-center",
            isAddingEpisode && "opacity-70"
          )} 
          onClick={isAddingEpisode ? undefined : addNewEpisode}
        >
          <div className="py-8 text-center">
            <p className="font-medium">
              {isAddingEpisode ? "Creating..." : "Add New Episode"}
            </p>
          </div>
        </Card>
      </div>
      
      {selectedEpisode && (
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>{isEditingEpisode ? "Edit Episode" : selectedEpisode}</CardTitle>
                <CardDescription>
                  {isEditingEpisode ? "Make changes to this episode" : `For arc: ${currentArc.title}`}
                </CardDescription>
              </div>
              {!isEditingEpisode && (
                <Button variant="outline" size="sm" onClick={() => startEditingEpisode(selectedEpisode)}>
                  Edit Episode
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {isEditingEpisode ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Episode Name</label>
                  <Input 
                    value={editName} 
                    onChange={(e) => setEditName(e.target.value)}
                    className="mb-4"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Episode Overview</label>
                  <Textarea 
                    value={editOverview} 
                    onChange={(e) => setEditOverview(e.target.value)}
                    className="min-h-32"
                  />
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-medium mb-2">Overview</h3>
                <p className="mb-4">{currentArc.episodes.episodeInfo[selectedEpisode]}</p>
                <h3 className="text-lg font-medium mb-2">Details</h3>
                <p className="whitespace-pre-line">{episodeDetail}</p>
              </div>
            )}
          </CardContent>
          {isEditingEpisode && (
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditingEpisode(false)}>
                Cancel
              </Button>
              <Button onClick={saveEpisodeEdit}>
                Save Changes
              </Button>
            </CardFooter>
          )}
        </Card>
      )}
      
      {/* Floating suggestion box with fixed positioning - replaced with collapsible */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-30 w-full max-w-4xl px-4 animate-fade-in">
        <Collapsible 
          open={isSuggestionOpen} 
          onOpenChange={setIsSuggestionOpen} 
          className="w-full bg-white rounded-lg shadow-lg border overflow-hidden"
        >
          <CollapsibleTrigger asChild>
            <Button 
              variant="outline" 
              className={cn(
                "flex items-center gap-2 absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full rounded-t-lg rounded-b-none border-b-0",
                isSuggestionOpen ? "bg-secondary/80" : "bg-white"
              )}
            >
              <MessageSquarePlus className="h-4 w-4" />
              {isSuggestionOpen ? "Hide Suggestion Box" : "Suggest Edit"}
            </Button>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="p-0">
            <div className="flex items-center justify-between p-2 border-b bg-secondary/30">
              <h3 className="font-medium text-sm">Suggest Episode Changes</h3>
            </div>
            
            <div className="p-3">
              <Textarea
                value={suggestion}
                onChange={(e) => setSuggestion(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Suggest changes to episodes..."
                className="min-h-20 mb-2 text-sm"
                rows={3}
              />
              
              <div className="flex justify-between items-center">
                <p className="text-xs text-muted-foreground">Press Ctrl+Enter to submit</p>
                <Button 
                  onClick={handleApplySuggestion}
                  disabled={isApplying}
                  size="sm"
                >
                  {isApplying ? "Applying..." : "Apply"}
                  {!isApplying && <Send className="ml-2 h-3 w-3" />}
                </Button>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
      
      {/* Next Button */}
      <div className="pt-4 flex justify-between">
        <Button 
          variant="outline" 
          onClick={() => navigateArc('prev')}
          disabled={currentArcIndex === 0}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Previous Arc
        </Button>
        
        {currentArcIndex === totalArcs - 1 ? (
          <Button onClick={onNextStage}>
            Next Stage 
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={() => navigateArc('next')}>
            Next Arc
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default EpisodeStage;
