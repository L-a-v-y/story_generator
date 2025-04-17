import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageSquarePlus, Send } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface ArcStageProps {
  storyData: {
    outline: { markdown: string };
    title: string;
    arcs: {
      numberOfArcs: number;
      arcInfo: Record<string, string>;
      arcDetails: Record<string, string>;
    };
  };
  updateStoryData: (data: any) => void;
  onNextStage: () => void;
}

const ArcStage = ({ storyData, updateStoryData, onNextStage }: ArcStageProps) => {
  const { outline, title, arcs } = storyData;
  const { toast } = useToast();
  
  const [suggestion, setSuggestion] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  const [isSuggestionOpen, setIsSuggestionOpen] = useState(false);
  const [selectedArc, setSelectedArc] = useState<string | null>(null);
  const [arcDetail, setArcDetail] = useState("");
  const [isEditingArc, setIsEditingArc] = useState(false);
  const [editName, setEditName] = useState("");
  const [editOverview, setEditOverview] = useState("");
  
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
      // Simulate API call to generate updated arcs
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Example of updating arc info based on suggestion
      const updatedArcInfo = { ...arcs.arcInfo };
      
      // Update the first arc as an example
      const keys = Object.keys(updatedArcInfo);
      if (keys.length > 0) {
        updatedArcInfo[keys[0]] = `${updatedArcInfo[keys[0]]} (Updated based on your suggestion: "${suggestion}")`;
      }
      
      updateStoryData({
        arcInfo: updatedArcInfo
      });
      
      setSuggestion("");
      
      toast({
        title: "Suggestion Applied",
        description: "Arc information has been updated",
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
  
  const viewArcDetail = (arcName: string) => {
    setSelectedArc(arcName);
    setArcDetail(arcs.arcDetails[arcName] || "No details available for this arc yet.");
  };
  
  const startEditingArc = (arcName: string) => {
    setIsEditingArc(true);
    setEditName(arcName);
    setEditOverview(arcs.arcInfo[arcName] || "");
  };
  
  const saveArcEdit = () => {
    if (!editName) return;
    
    const updatedArcInfo = { ...arcs.arcInfo };
    
    if (editName !== selectedArc && selectedArc) {
      // Rename the arc
      delete updatedArcInfo[selectedArc];
    }
    
    updatedArcInfo[editName] = editOverview;
    
    updateStoryData({
      arcInfo: updatedArcInfo
    });
    
    setIsEditingArc(false);
    setSelectedArc(editName);
    
    toast({
      title: "Arc Updated",
      description: `Arc "${editName}" has been updated`,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleApplySuggestion();
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold mb-2">Story Arcs</h1>
        <p className="text-muted-foreground">
          Structure your story into major narrative arcs
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {Object.entries(arcs.arcInfo).map(([name, overview]) => (
          <Card 
            key={name} 
            className={cn(
              "cursor-pointer transition-all duration-200 hover:shadow-md",
              selectedArc === name && "ring-2 ring-primary"
            )}
            onClick={() => viewArcDetail(name)}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm line-clamp-3">{overview}</p>
            </CardContent>
          </Card>
        ))}
        
        <Card className="cursor-pointer border-dashed hover:border-primary hover:shadow-md flex items-center justify-center" onClick={() => {
          const newArcName = `New Arc ${Object.keys(arcs.arcInfo).length + 1}`;
          const updatedArcInfo = { 
            ...arcs.arcInfo,
            [newArcName]: "Overview of the new arc. Describe the key events and developments that occur during this section of the story."
          };
          
          const updatedArcDetails = {
            ...arcs.arcDetails,
            [newArcName]: "Detailed description of this story arc. Include key plot points, character developments, and thematic elements."
          };
          
          updateStoryData({
            arcInfo: updatedArcInfo,
            arcDetails: updatedArcDetails
          });
          
          setSelectedArc(newArcName);
        }}>
          <div className="py-8 text-center">
            <p className="font-medium">Add New Arc</p>
          </div>
        </Card>
      </div>
      
      {selectedArc && (
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>{isEditingArc ? "Edit Arc" : selectedArc}</CardTitle>
                <CardDescription>
                  {isEditingArc ? "Make changes to this arc" : "Detailed information about this arc"}
                </CardDescription>
              </div>
              {!isEditingArc && (
                <Button variant="outline" size="sm" onClick={() => startEditingArc(selectedArc)}>
                  Edit Arc
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {isEditingArc ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Arc Name</label>
                  <Input 
                    value={editName} 
                    onChange={(e) => setEditName(e.target.value)}
                    className="mb-4"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Arc Overview</label>
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
                <p className="mb-4">{arcs.arcInfo[selectedArc]}</p>
                <h3 className="text-lg font-medium mb-2">Details</h3>
                <p>{arcDetail}</p>
              </div>
            )}
          </CardContent>
          {isEditingArc && (
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditingArc(false)}>
                Cancel
              </Button>
              <Button onClick={saveArcEdit}>
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
              <h3 className="font-medium text-sm">Suggest Arc Changes</h3>
            </div>
            
            <div className="p-3">
              <Textarea
                value={suggestion}
                onChange={(e) => setSuggestion(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Suggest changes to story arcs..."
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
      <div className="pt-4">
        <Button onClick={onNextStage}>
          Next Stage 
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ArcStage;
