
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageSquarePlus, Send } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface CharactersStageProps {
  storyData: {
    outline: { markdown: string };
    characters: {
      minNumberOfCharacters: number;
      characterInfo: Record<string, string>;
    };
  };
  updateStoryData: (data: any) => void;
  onNextStage: () => void;
}

const CharactersStage = ({ storyData, updateStoryData, onNextStage }: CharactersStageProps) => {
  const { outline, characters } = storyData;
  const { toast } = useToast();
  
  const [suggestion, setSuggestion] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  const [isEditingCharacter, setIsEditingCharacter] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [isSuggestionOpen, setIsSuggestionOpen] = useState(false);
  const [title, setTitle] = useState("Default Story Title");
  
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
      // Simulate API call to generate updated characters
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Example of updating character info based on suggestion
      const updatedCharacterInfo = { ...characters.characterInfo };
      
      // Update the first character as an example
      const keys = Object.keys(updatedCharacterInfo);
      if (keys.length > 0) {
        updatedCharacterInfo[keys[0]] = `${updatedCharacterInfo[keys[0]]} (Updated based on your suggestion: "${suggestion}")`;
      }
      
      updateStoryData({
        characterInfo: updatedCharacterInfo
      });
      
      setSuggestion("");
      
      toast({
        title: "Suggestion Applied",
        description: "Character information has been updated",
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
  
  const startEditingCharacter = (name: string, info: string) => {
    setIsEditingCharacter(name);
    setEditValue(info);
  };
  
  const saveCharacterEdit = () => {
    if (!isEditingCharacter) return;
    
    const updatedCharacterInfo = { ...characters.characterInfo };
    updatedCharacterInfo[isEditingCharacter] = editValue;
    
    updateStoryData({
      characterInfo: updatedCharacterInfo
    });
    
    setIsEditingCharacter(null);
    setEditValue("");
    
    toast({
      title: "Character Updated",
      description: `${isEditingCharacter} has been updated`,
    });
  };
  
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    // Update title in the parent component
    updateStoryData({ title: e.target.value });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleApplySuggestion();
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold mb-2">Character Development</h1>
        <p className="text-muted-foreground">
          Create and refine the characters in your story
        </p>
      </div>
      
      {/* Title Input */}
      <div className="mb-8">
        <Label htmlFor="title" className="text-lg font-medium">Story Title</Label>
        <Input
          id="title"
          value={title}
          onChange={handleTitleChange}
          placeholder="Enter a captivating title..."
          className="mt-1.5 text-xl"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {Object.entries(characters.characterInfo).map(([name, info]) => (
          <Card key={name} className={cn(
            "transition-all duration-300",
            isEditingCharacter === name && "ring-2 ring-primary"
          )}>
            <CardHeader>
              <CardTitle>{name}</CardTitle>
              <CardDescription>Character Profile</CardDescription>
            </CardHeader>
            <CardContent>
              {isEditingCharacter === name ? (
                <div className="space-y-4">
                  <Textarea
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="min-h-32"
                  />
                  <div className="flex space-x-2">
                    <Button onClick={saveCharacterEdit}>Save</Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setIsEditingCharacter(null);
                        setEditValue("");
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="mb-4">{info}</p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => startEditingCharacter(name, info)}
                  >
                    Edit Character
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="mb-8">
        <Button variant="outline" onClick={() => {
          const newCharNum = Object.keys(characters.characterInfo).length + 1;
          const newCharName = `character${newCharNum}`;
          const updatedCharacterInfo = { 
            ...characters.characterInfo,
            [newCharName]: `This is a new character. Add details about ${newCharName} here.`
          };
          
          updateStoryData({
            characterInfo: updatedCharacterInfo
          });
        }}>
          Add New Character
        </Button>
      </div>
      
      {/* Fixed floating edit box with full width */}
      <div className="fixed bottom-6 left-0 w-full px-4 z-20 flex justify-center animate-fade-in">
        <Collapsible 
          open={isSuggestionOpen} 
          onOpenChange={setIsSuggestionOpen} 
          className="w-full max-w-4xl bg-white rounded-lg shadow-lg border overflow-hidden"
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
              {isSuggestionOpen ? "Hide Suggestion Box" : "Suggest Character Changes"}
            </Button>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="p-0">
            <div className="flex items-center justify-between p-3 border-b bg-secondary/30">
              <h3 className="font-medium">Suggest Character Changes</h3>
            </div>
            
            <div className="p-4">
              <Textarea
                value={suggestion}
                onChange={(e) => setSuggestion(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Suggest changes to any character..."
                className="min-h-32 mb-3"
              />
              
              <div className="flex justify-between items-center">
                <p className="text-xs text-muted-foreground">Press Ctrl+Enter to submit</p>
                <Button 
                  onClick={handleApplySuggestion}
                  disabled={isApplying}
                >
                  {isApplying ? "Applying..." : "Apply"}
                  {!isApplying && <Send className="ml-2 h-4 w-4" />}
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

export default CharactersStage;
