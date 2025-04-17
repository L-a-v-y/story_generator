from fastapi import FastAPI, HTTPException, Body
import uuid
from datetime import datetime
from models import User, StoryPrompt, StoryOverview, StoryOutline, ArcGenDetails, ArcOverview, EpisodeGenDetails, EpisodeDetails
from utils import regenerate_title_from_outline, generatefirstoutline, generate_title_from_outline, regenerateoutline, create_arc_outline, refine_arc_outline, detailarc, updatearcdetail, episodes_overview, refine_episodes_overview, episode_details, refine_episode_details
from database import users_collection, stories_collection, arcs_collection, episodes_collection

app = FastAPI(
    title="Story Generator API", 
    description="API for generating and managing story content",
    version="1.0.0"
    )

# --- API Endpoints ---

@app.post("/register")
async def register_user(user: User):
    if await users_collection.find_one({"username": user.username}):
        raise HTTPException(status_code=400, detail="Username already exists")
    await users_collection.insert_one(user.dict())
    return {"message": "User registered successfully"}

@app.post("/login")
async def login_user(user: User):
    db_user = await users_collection.find_one({"username": user.username})
    if not db_user or db_user["password"] != user.password:
        raise HTTPException(status_code=401, detail="Invalid username or password")
    return {"message": "Login successful"}

@app.post("/logout")
async def logout_user(username: str = Body(...)):
    """
    Logout a user.
    """
    # if username not in users_db:
    #     raise HTTPException(status_code=404, detail="User not found")
    # return {"message": f"User {username} logged out successfully"}
    pass

@app.post("{user_id}/story_generate")
async def story_generate(prompt: StoryPrompt):
    """
    Generate a new story based on the user prompt.
    Returns an overview and suggestions for further development.
    """
    if prompt.user_feedback:
        # If user feedback is provided, regenerate the outline
        return regenerateoutline(prompt.user_prompt, prompt.genre, prompt.user_feedback)
    
    return generatefirstoutline(prompt.genre, prompt.user_prompt)

@app.post("{user_id}/{story_id}/generate_title")
async def generate_title(user_id: str, story_outline: StoryOverview):
    """
    Generate a title for the story based on the user prompt.
    """
    if story_outline.user_feedback:
        return regenerate_title_from_outline(story_outline, story_outline.title, story_outline.user_feedback)
    return generate_title_from_outline(story_outline)

@app.post("{user_id}/{story_id}/generate_arcs_overview")
async def generate_arcs_overview(story_name: str, arc_details: ArcGenDetails):
    if arc_details.user_feedback:
        # If user feedback is provided, regenerate the arcs overview
        output = refine_arc_outline(arc_details.outline, arc_details.user_feedback)
    else: 
        output = create_arc_outline(arc_details.outline, arc_details.number_of_arcs)

    dictarc = {}
    for i in output:
        dictarc[i.split('\n\n**Summary:**')[0].split(': ')[1]] = i.split('\n\n**Summary:**')[1]
    return dictarc

@app.post("{user_id}/{story_id}/{arc_id}/expand_arc_details")
async def create_arc_detail(user_id:int, story_id: int, arc_id: int, story_name: str, arc_data: ArcOverview):
    # Fetch the main outline of the story from the stories_collection using story_id
    story = await stories_collection.find_one({"story_id": story_id})
    if not story:
        raise HTTPException(status_code=404, detail="Story not found")
    main_outline = story.get("main_outline", "")

    # Fetch details of the previous arc of the same story from the database
    previous_arc = await arcs_collection.find_one({"story_id": story_id, "arc_id": arc_id-1})
    
    if previous_arc:
        # Use the previous arc details to refine the current arc details
        return detailarc(arc_data.summary, main_outline, arc_data.title, previous_arc)
    
    if arc_data.user_feedback:
        # If user feedback is provided, regenerate the arc details
        return updatearcdetail(arc_data.summary, main_outline, arc_data.title, previous_arc, arc_data.user_feedback)
    # If no previous arc is found, proceed without it
    return detailarc(arc_data.summary, main_outline, arc_data.title)

@app.post("{user_id}/{story_id}/{arc_id}/generate_episodes_overview")
async def generate_episodes_overview(user_id:int, story_id: int, arc_id: int, episode_gen: EpisodeGenDetails):

    story = await stories_collection.find_one({"story_id": story_id})
    if not story:
        raise HTTPException(status_code=404, detail="Story not found")
    outline = story.get("main_outline", "")
    previous_arc = await arcs_collection.find_one({"story_id": story_id, "arc_id": arc_id-1})
    story_so_far = previous_arc.get("summary", "") if previous_arc else ""

    """Generate episodes overview for the current arc"""
    if episode_gen.user_feedback:
        # If user feedback is provided, regenerate the episodes overview
        return refine_episodes_overview(episode_gen.org_episodes, episode_gen.user_feedback, episode_gen.arc_info, outline, story_so_far)
    
    return episodes_overview(episode_gen.arc_info, outline, episode_gen.num_episodes, story_so_far)

@app.post("{user_id}/{story_id}/{arc_name}/{ep_id}/generate_episode_details")
async def generate_episode_details(user_id:int, story_id: int, arc_id: int, ep_id:int, episode_det: EpisodeDetails):
    if episode_det.user_feedback:
        # If user feedback is provided, regenerate the episodes details
        return refine_episode_details(episode_det.details, episode_det.user_feedback, episode_det.title, episode_det.number, episode_det.arc, episode_det.outline)
    
    return episode_details(episode_det.title, episode_det.number, episode_det.arc, episode_det.outline)


# @app.get("/{story_name}/overview")
# async def get_story_overview(story_name: str):
#     """Get the overview of a specific story."""
#     pass

# @app.get("/{story_name}/{arc_name}/all_episodes")
# async def get_all_episodes(story_name: str, arc_name: str):
#     """Get details about a particular arc and list all episodes."""
#     pass

# @app.get("/{story_name}/{arc_name}/{episode_name}/episode_overview")
# async def get_episode_details(story_name: str, arc_name: str, episode_name: str):
#     """Get overview of a specific episode."""
#     pass

# @app.get("/{story_name}/{arc_name}/{episode_name}/episode_details")
# async def get_episode_details(story_name: str, arc_name: str, episode_name: str):
#     """Get the full story in an episode."""
#     pass

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)