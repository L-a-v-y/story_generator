from typing import Dict, List, Optional
from pydantic import BaseModel

# --- Pydantic Models ---

class User(BaseModel):
    username: str
    password: str

class StoryPrompt(BaseModel):
    genre: str
    user_prompt: str
    user_feedback: Optional[str] = None

class StoryOutline(BaseModel):
    concept: str
    mainoutline: str
    followquestion: str

class StoryOverview(BaseModel):
    title: str
    summary: str
    number_of_arcs: int
    genre: str
    mood: str
    main_characters: List[str]

class ArcGenDetails(BaseModel):
    outline: str
    number_of_arcs: int
    user_feedback: Optional[str] = None

class ArcOverview(BaseModel):
    title: str
    summary: str
    outline: str
    arc_detail: Optional[str] = None
    user_feedback: Optional[str] = None

class ArcDetails(BaseModel):
    name: str
    summary: str
    mood: str
    episode_list: List[str]
    main_characters: List[str]
    
class EpisodeGenDetails(BaseModel):
    arc_info: str
    story_so_far: str
    outline: str
    num_episodes: int
    org_episodes: Optional[Dict] = None
    user_feedback: Optional[str] = None

class EpisodeDetails(BaseModel):
    title: str
    number: int
    arc: Dict
    outline: str
    details: Optional[str] = None
    user_feedback: Optional[str] = None
    
class StoryResponse(BaseModel):
    overview: str
    suggestions: List[str]