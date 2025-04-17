import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { StoryOutline } from "@/types/story";
import { ArrowRight, X, MessageSquarePlus, Send } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import ReactMarkdown from 'react-markdown';
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface OutlineStageProps {
  storyData: { outline: StoryOutline };
  updateStoryData: (data: Partial<StoryOutline>) => void;
  onNextStage: () => void;
}

const OutlineStage = ({ storyData, updateStoryData, onNextStage }: OutlineStageProps) => {
  const { outline } = storyData;
  const [suggestion, setSuggestion] = useState("");
  const [isApplyingSuggestion, setIsApplyingSuggestion] = useState(false);
  const [isEditingOutline, setIsEditingOutline] = useState(false);
  const [isSuggestionOpen, setIsSuggestionOpen] = useState(false);
  const suggestBoxRef = useRef<HTMLDivElement>(null);
  const outlineRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Handles applying the suggestion
  const handleApplySuggestion = async () => {
    if (!suggestion.trim()) {
      toast({
        title: "Empty Suggestion",
        description: "Please enter a suggestion first",
        variant: "destructive",
      });
      return;
    }
    
    setIsApplyingSuggestion(true);
    setIsEditingOutline(true);
    
    try {
      // In a real app, send suggestion to API and get updated markdown
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate updated outline based on suggestion
      // In a real app, this would come from the API
      const updatedMarkdown = outline.markdown.replace(
        "# Story Outline", 
        `# Story Outline\n\n*Updated based on your suggestion: "${suggestion}"*`
      );
      
      updateStoryData({ markdown: updatedMarkdown });
      setSuggestion("");
      
      toast({
        title: "Suggestion Applied",
        description: "Your outline has been updated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to apply suggestion. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsApplyingSuggestion(false);
      
      // Keep editing animation for a bit longer after API response
      setTimeout(() => {
        setIsEditingOutline(false);
      }, 1000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleApplySuggestion();
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in pb-20 relative">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold mb-2">Story Outline</h1>
        <p className="text-muted-foreground">
          Review your automatically generated outline and suggest changes
        </p>
      </div>
      
      <div 
        ref={outlineRef}
        className={cn(
          "bg-white border rounded-lg p-6 shadow-sm relative mb-8 transition-all duration-300",
          isEditingOutline && "outline outline-2 outline-primary animate-pulse"
        )}
      >
        <div className="prose prose-stone max-w-none">
          <ReactMarkdown>{outline.markdown}</ReactMarkdown>
        </div>
      </div>
      
      {/* Floating suggestion box with fixed positioning */}
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
              <h3 className="font-medium text-sm">Suggest Edit</h3>
            </div>
            
            <div className="p-3">
              <Textarea
                value={suggestion}
                onChange={(e) => setSuggestion(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Describe how you'd like to change the outline..."
                className="min-h-20 mb-2 text-sm"
                rows={3}
              />
              
              <div className="flex justify-between items-center">
                <p className="text-xs text-muted-foreground">Press Ctrl+Enter to submit</p>
                <Button 
                  onClick={handleApplySuggestion}
                  disabled={isApplyingSuggestion}
                  size="sm"
                >
                  {isApplyingSuggestion ? "Applying..." : "Apply"}
                  {!isApplyingSuggestion && <Send className="ml-2 h-3 w-3" />}
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

export default OutlineStage;
