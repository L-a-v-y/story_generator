import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Copy, ChevronDown, ChevronUp } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface FinalEpisodeStageProps {
  storyData: {
    title: string;
    arcs: {
      arcTitle: string;
      arcInfo: Record<string, string>;
      arcDetails: Record<string, string>;
      numberOfArcs: number;
    };
    episodes: {
      episodeInfo: Record<string, string>;
      episodeDetails: Record<string, string>;
    };
    finalEpisode: {
      detailedEpisode: string;
    };
  };
  updateStoryData: (data: any) => void;
  onNextStage: () => void;
}

const FinalEpisodeStage = ({ storyData: initialStoryData, updateStoryData, onNextStage }: FinalEpisodeStageProps) => {
  const [storyData, setLocalStoryData] = useState(initialStoryData);
  const { title, arcs, episodes } = storyData;
  const { toast } = useToast();

  // State for expanded episodes
  const [expandedEpisodes, setExpandedEpisodes] = useState<Record<string, boolean>>({});
  const [editingEpisode, setEditingEpisode] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  
  // Sync with parent component when data changes
  useEffect(() => {
    setLocalStoryData(initialStoryData);
  }, [initialStoryData]);
  
  // Helper to get episode key
  const getEpisodeKey = (arcIndex: number, episodeName: string) => {
    return `arc-${arcIndex}-${episodeName}`;
  };
  
  // Toggle episode expansion
  const toggleExpansion = (key: string) => {
    setExpandedEpisodes(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  
  // Copy episode to clipboard
  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    
    toast({
      title: "Copied",
      description: "Episode content copied to clipboard",
    });
  };
  
  // Apply suggestion to an episode
  const handleApplySuggestion = async (arcName: string, episodeName: string) => {
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
      // Simulate API call to generate updated final episode
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const currentContent = episodes.episodeDetails[episodeName];
      const updatedContent = `${currentContent}\n\n[Updated based on suggestion: "${suggestion}"]`;
      
      // Update the episodes object directly
      updateStoryData({
        episodes: {
          ...episodes,
          episodeDetails: {
            ...episodes.episodeDetails,
            [episodeName]: updatedContent
          }
        }
      });
      
      setLocalStoryData(prev => ({
        ...prev,
        episodes: {
          ...prev.episodes,
          episodeDetails: {
            ...prev.episodes.episodeDetails,
            [episodeName]: updatedContent
          }
        }
      }));
      
      setSuggestion("");
      
      toast({
        title: "Suggestion Applied",
        description: `Updates applied to "${episodeName}"`,
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

  return (
    <div className="max-w-4xl mx-auto animate-fade-in pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold mb-2">Final Episodes</h1>
        <p className="text-muted-foreground">
          Review and finalize all episodes across your story arcs
        </p>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>
            Complete Story Overview
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Your story contains {arcs.numberOfArcs} arcs with a total of {
            Object.keys(episodes.episodeInfo).length
          } episodes.</p>
        </CardContent>
      </Card>
      
      {/* Convert arc info object to array for mapping */}
      {Object.entries(arcs.arcInfo).map(([arcName, overview], arcIndex) => (
        <Card key={`arc-${arcIndex}`} className="mb-8">
          <CardHeader>
            <CardTitle>{arcName}</CardTitle>
            <CardDescription>{overview}</CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {Object.entries(episodes.episodeInfo).map(([episodeName, overview]) => {
              const episodeKey = getEpisodeKey(arcIndex, episodeName);
              const isExpanded = expandedEpisodes[episodeKey];
              const isEditing = editingEpisode === episodeKey;
              
              return (
                <Card key={episodeKey} className="border border-secondary">
                  <CardHeader className="py-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-lg">{episodeName}</CardTitle>
                        <CardDescription className="line-clamp-1">{overview}</CardDescription>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => toggleExpansion(episodeKey)}
                        className="gap-1"
                      >
                        {isExpanded ? (
                          <>
                            <ChevronUp className="h-4 w-4" />
                            Hide
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-4 w-4" />
                            Show
                          </>
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  
                  <Collapsible open={isExpanded}>
                    <CollapsibleContent>
                      <CardContent className="pt-0">
                        {isEditing ? (
                          <Textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="min-h-[500px] font-mono text-sm"
                          />
                        ) : (
                          <div className="whitespace-pre-line bg-muted p-4 rounded-md font-mono text-sm max-h-[500px] overflow-y-auto">
                            {episodes.episodeDetails[episodeName] || "No detailed content available."}
                          </div>
                        )}
                      </CardContent>
                      
                      <CardFooter className="justify-end space-x-2 pt-0 pb-4">
                        {isEditing ? (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => setEditingEpisode(null)}
                            >
                              Cancel
                            </Button>
                            <Button 
                              size="sm" 
                              onClick={() => {
                                // Add logic to save edits
                                setEditingEpisode(null);
                              }}
                            >
                              Save Changes
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => copyToClipboard(episodes.episodeDetails[episodeName] || "")}
                            >
                              <Copy className="h-4 w-4 mr-1" /> Copy
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => {
                                // Add logic to start editing
                                setEditingEpisode(episodeKey);
                                setEditContent(episodes.episodeDetails[episodeName] || "");
                              }}
                            >
                              Edit
                            </Button>
                            <Button 
                              size="sm" 
                              onClick={() => handleApplySuggestion(arcName, episodeName)}
                              disabled={isApplying || !suggestion.trim()}
                            >
                              Apply Suggestion
                            </Button>
                          </>
                        )}
                      </CardFooter>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              );
            })}
          </CardContent>
        </Card>
      ))}
      
      {/* Next Button */}
      <div className="pt-4">
        <Button onClick={onNextStage}>
          Complete Story
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default FinalEpisodeStage;
