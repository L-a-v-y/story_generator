
export interface StoryBasicInfo {
  title: string;
  description: string;
  genres: string[];
  instructions: string;
}

export interface StoryOutline {
  markdown: string;
}

export interface StoryStage {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  enabled: boolean;
  component: React.ComponentType<any>;
}

// Stage status
export enum StageStatus {
  LOCKED = "locked",
  CURRENT = "current",
  COMPLETED = "completed"
}
