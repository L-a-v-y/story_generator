from typing import Dict, List, Optional
from pydantic import BaseModel, Field
from datetime import datetime
import uuid

# --- Pydantic Models ---

class EpisodeOverview(BaseModel):
    arc_id: str
    episode_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    summary: str
    number: int
    # episode_detail: Optional[str] = None
    user_feedback: Optional[str] = None

class ArcOverview(BaseModel):
    title: str
    summary: str
    number: int
    story_id: str
    arc_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    # arc_detail: Optional[str] = None
    user_feedback: Optional[str] = None

class StoryOverview(BaseModel):
    title: Optional[str] = None
    genre: Optional[str] = None
    summary: str
    number_of_arcs: Optional[str] = None
    user_feedback: Optional[str] = None

class User(BaseModel):
    user_id: str
    username: str
    password: str
    stories: List[StoryOverview] = Field(default_factory=list)

class Story(BaseModel):
    user_id: str
    story_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    overview: StoryOverview
    main_characters: List[str]
    arcs: List[ArcOverview] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    user_feedback: Optional[str] = None

class Arc(BaseModel):
    overview: ArcOverview
    episodes: List[EpisodeOverview] = Field(default_factory=list)
    main_characters: List[str]
    user_feedback: Optional[str] = None

class Episode(BaseModel):
    arc_id: str
    episode_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    number: int
    title: str
    full_script: Optional[str] = None
    user_feedback: Optional[str] = None

class StoryPrompt(BaseModel):
    genre: str
    user_prompt: str
    user_feedback: Optional[str] = None

class StoryOutline(BaseModel):
    concept: str
    mainoutline: str
    followquestion: str

class ArcGenDetails(BaseModel):
    outline: str
    number_of_arcs: int
    user_feedback: Optional[str] = None

class ArcDetails(BaseModel):
    name: str
    summary: str
    mood: str
    episode_list: List[str]
    main_characters: List[str]
    
class EpisodeGenDetails(BaseModel):
    arc_info: str
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