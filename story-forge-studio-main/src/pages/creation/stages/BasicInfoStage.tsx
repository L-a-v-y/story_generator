
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { STORY_GENRES } from "@/constants/genres";
import { StoryBasicInfo } from "@/types/story";
import { ArrowRight } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface BasicInfoStageProps {
  storyData: { basicInfo: StoryBasicInfo };
  updateStoryData: (data: Partial<StoryBasicInfo>) => void;
  onNextStage: () => void;
  generateOutline: (basicInfo: StoryBasicInfo) => Promise<string>;
}

const BasicInfoStage = ({ storyData, updateStoryData, onNextStage, generateOutline }: BasicInfoStageProps) => {
  const { basicInfo } = storyData;
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenreChange = (genreId: string, checked: boolean) => {
    const updatedGenres = checked
      ? [...basicInfo.genres, genreId]
      : basicInfo.genres.filter(id => id !== genreId);
    
    updateStoryData({ genres: updatedGenres });
  };

  const handleNextStage = async () => {
    if (basicInfo.genres.length === 0) {
      toast({
        title: "No Genres Selected",
        description: "Please select at least one genre for your story",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsGenerating(true);
      
      // Generate the outline
      await generateOutline(basicInfo);
      
      // Let the parent component handle the next stage transition
      onNextStage();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate outline. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold mb-2">Story Concept</h1>
        <p className="text-muted-foreground">
          Let's start building your story by defining its foundation
        </p>
      </div>
      
      <div className="space-y-8">
        {/* Description */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="description" className="text-base">Description</Label>
            <Textarea
              id="description"
              value={basicInfo.description}
              onChange={(e) => updateStoryData({ description: e.target.value })}
              placeholder="Describe what your story is about in a few sentences..."
              className="mt-1.5 min-h-24"
            />
          </div>
        </div>
        
        {/* Genres */}
        <div>
          <Label className="text-base mb-3 block">Genre Selection</Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-60 overflow-y-auto pr-2 border rounded-md p-3">
            {STORY_GENRES.map((genre) => (
              <div key={genre.id} className="flex items-center space-x-2">
                <Checkbox
                  id={genre.id}
                  checked={basicInfo.genres.includes(genre.id)}
                  onCheckedChange={(checked) => 
                    handleGenreChange(genre.id, checked as boolean)
                  }
                />
                <Label htmlFor={genre.id} className="text-sm font-normal cursor-pointer">
                  {genre.label}
                </Label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Instructions
        <div>
          <Label htmlFor="instructions" className="text-base">
            Special Instructions
          </Label>
          <Textarea
            id="instructions"
            value={basicInfo.instructions}
            onChange={(e) => updateStoryData({ instructions: e.target.value })}
            placeholder="Add any specific themes, elements, or preferences you'd like to include in your story..."
            className="mt-1.5 min-h-32"
          />
        </div> */}
        
        {/* Next Button */}
        <div className="pt-4">
          <Button 
            onClick={handleNextStage} 
            disabled={isGenerating} 
            className="w-full sm:w-auto"
          >
            {isGenerating ? (
              <>Generating Outline...</>
            ) : (
              <>
                Generate Outline
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
          
          {isGenerating && (
            <p className="text-sm text-muted-foreground mt-2">
              This may take a moment as we craft a unique outline for your story...
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BasicInfoStage;
