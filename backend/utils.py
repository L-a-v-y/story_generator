from langchain_core.prompts import ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate
from langchain_core.messages import SystemMessage, HumanMessage
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv
import json, os

load_dotenv()

class Settings:
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
    # DATABASE_NAME: str = os.getenv('DATABASE_NAME', 'csv_rag_database')
    EMBEDDING_MODEL: str = os.getenv('EMBEDDING_MODEL', 'text-embedding-3-large')
    LLM_MODEL: str = os.getenv('LLM_MODEL', 'gpt-4o-mini-2024-07-18')

settings = Settings()

llm = ChatOpenAI(model=settings.LLM_MODEL, temperature=0.7)



# --- Helper Functions ---

def regenerate_title_from_outline(concept: str, mainoutline: str, previous_title: str, user_feedback: str):
    """
    Regenerates a story title based on user feedback about a previous title suggestion.
    
    Parameters:
    - concept (str): High-level concept of the story
    - mainoutline (str): Detailed story outline
    - previous_title (dict): The previously generated title information
    - user_feedback (str): User's feedback on the previous title
    
    Returns:
    - dict: JSON object containing the new title and supporting information
    """
    title_regeneration_prompt = ChatPromptTemplate.from_messages([
    SystemMessagePromptTemplate.from_template("""You are an expert title creator with experience in literature, film, and television. You specialize in refining and improving titles based on specific feedback while maintaining thematic resonance and marketability."""),
    HumanMessagePromptTemplate.from_template("""
        Generate an improved title for this story based on the user's feedback.

        STORY INFORMATION:
        - Story concept: {concept}
        - Story outline: {mainoutline}
        
        PREVIOUS TITLE INFORMATION:
        {previous_title}
        
        USER FEEDBACK ON PREVIOUS TITLE:
        {user_feedback}

        TITLE REQUIREMENTS:
        1. Address the specific concerns/suggestions in the user feedback
        2. Capture the essence of the story in a concise, memorable way
        3. Reflect the genre, tone, and thematic elements
        4. Create intrigue without revealing major plot twists
        5. Consider metaphorical/symbolic connections to the narrative
        6. Be distinct and searchable in the current market
        7. Avoid generic phrasing or overused title conventions
        8. Range between 1-7 words (with emphasis on brevity)
        9. Have potential for brand extension if the story becomes a series

        For the new title option, provide:
        1. The proposed title
        2. A brief explanation (40-60 words) of why this title works for the story
        3. How the title connects to key themes, character arcs, or plot elements
        4. An assessment of the title's marketability and memorability
        5. How the new title addresses the specific user feedback

        FORMAT YOUR RESPONSE AS JSON:
        {{
            "title": "[New Title Name]",
            "rationale": "[Explanation]",
            "thematic_connection": "[Theme connection]",
            "market_assessment": "[Brief assessment]",
            "feedback_addressed": "[How this title addresses the user's feedback]"
        }}
        """)
    ])
    
    response = llm.invoke(title_regeneration_prompt.format_messages(
        concept=concept, 
        mainoutline=mainoutline,
        previous_title=previous_title,
        user_feedback=user_feedback
    ))
    
    response = json.loads(response.content)
    return response

def generate_title_from_outline(concept: str, mainoutline: str):
    title_generation_prompt = ChatPromptTemplate.from_messages([
    SystemMessagePromptTemplate.from_template("""You are an expert title creator with experience in literature, film, and television. You understand how to craft memorable, thematically resonant titles that capture a story's essence while creating intrigue."""),
    HumanMessagePromptTemplate.from_template("""
        Generate a compelling title for this story.

        STORY INFORMATION:
        - Story concept: {concept}
        - Story outline: {mainoutline}

        TITLE REQUIREMENTS:
        1. Capture the essence of the story in a concise, memorable way
        2. Reflect the genre, tone, and thematic elements
        3. Create intrigue without revealing major plot twists
        4. Consider metaphorical/symbolic connections to the narrative
        5. Be distinct and searchable in the current market
        6. Avoid generic phrasing or overused title conventions
        7. Range between 1-7 words (with emphasis on brevity)
        8. Have potential for brand extension if the story becomes a series

        For each title option, provide:
        1. The proposed title
        2. A brief explanation (40-60 words) of why this title works for the story
        3. How the title connects to key themes, character arcs, or plot elements
        4. An assessment of the title's marketability and memorability

        FORMAT YOUR RESPONSE AS JSON:
        {{
            "title": "[Title Name]",
            "rationale": "[Explanation]",
            "thematic_connection": "[Theme connection]",
            "market_assessment": "[Brief assessment]"
        }}
        """)
    ])
    
    response = llm.invoke(title_generation_prompt.format_messages(concept=concept, mainoutline=mainoutline))
    response = json.loads(response.content)
    return response

def generatefirstoutline(genre, description):
    system_prompt = """
                    You are StorySeed, an AI designed to help users flesh out their story ideas by generating a comprehensive narrative blueprint that covers all essential story elements while engaging the user with targeted questions for further clarification.
                    When a user provides selected genres and a brief description of their concept, your task is twofold:
                    1. Generate a Detailed Narrative Outline:Based on the provided input, create a fully developed story framework that includes:
                        * Characters:
                            * Detailed profiles including names, personality traits, backgrounds, and motivations.
                            * Character development arcs that show how they evolve.
                            * Relationships among characters and how these impact the narrative.
                            * Specific inner conflicts that drive their personal journeys.
                        * Conflict:
                            * Internal conflicts (emotional, psychological challenges).
                            * External conflicts (antagonistic forces, societal or environmental pressures).
                        * Plot:
                            * A clear storyline featuring exposition, rising action, climax, falling action, and resolution.
                            * Key turning points and pivotal events that move the narrative forward.
                        * Structure:
                            * The narrative framework that best suits the story (e.g., linear, non-linear, multiple perspectives).
                        * World Design:
                            * A vivid description of the setting and environment (contemporary, historical, futuristic, or fantastical).
                            * Relevant cultural, social, or atmospheric details that enhance the story’s context.
                        * Theme:
                            * The underlying messages or insights the story aims to convey (e.g., identity, love and sacrifice, trauma and healing).
                        * Emotional Resonance:
                            * The intended emotional journey for the audience.
                            * Key moments designed to evoke empathy, suspense, hope, or other targeted emotions.
                    2. Engage with the User:
                        * Ask clarifying and targeted follow-up questions to refine the story idea.
                        * Encourage the user to provide additional details or adjustments to the narrative elements.

                    Defined Output Format

                    Your output should be structured in markdown and follow this precise format strictly:

                    # Acknowledgment
                    **Selected Genres:**  
                    *List the genres provided by the user*

                    **Concept Summary:**  
                    *A brief summary of the main idea as provided by the user*

                    # Narrative Outline

                    ## Characters
                    - **Profile:** Detailed descriptions of the main and supporting characters.
                    - **Motivations & Development Arcs:** How each character evolves and what drives them.
                    - **Relationships:** Key interactions and dynamics among characters.
                    - **Internal Conflicts:** Specific emotional or psychological challenges.

                    ## Conflict
                    - **Internal Conflict:** Detailed emotional/psychological struggles of the characters.
                    - **External Conflict:** Forces, antagonists, or societal pressures that challenge the characters.

                    ## Plot
                    - **Exposition:** Setting up the world and introducing the characters.
                    - **Rising Action:** Key events that build tension.
                    - **Climax:** The turning point of the narrative.
                    - **Falling Action:** Events leading to resolution.
                    - **Resolution:** How the story’s conflicts are resolved.

                    ## Structure
                    - **Narrative Framework:** Description of the chosen structure (linear, non-linear, multiple perspectives, etc.) and its suitability to the story.

                    ## World Design
                    - **Setting:** Detailed description of the time period, location, and environment.
                    - **Cultural/Atmospheric Details:** Unique elements that define the world (social norms, technology, magic systems, etc.).

                    ## Theme
                    - **Underlying Messages:** The core insights or lessons the story aims to convey.

                    ## Emotional Resonance
                    - **Audience Journey:** The intended emotional impact on the audience.
                    - **Key Emotional Moments:** Specific events designed to evoke feelings such as empathy, suspense, or hope.

                    # Follow-Up Questions
                    - *Question 1:* [Insert a clarifying question about any aspect of the narrative]
                    """
    t = [SystemMessage(content=system_prompt),HumanMessage(content= f"genre:{genre} and description:{description}")]
    response = llm.invoke(t)
    followquestion = response.content.split('# Follow-Up Questions')[1].split(':*')[1].strip()
    mainoutline = response.content.split('# Follow-Up Questions')[0].split('# Narrative Outline')[1].strip()
    concept = response.content.split('# Follow-Up Questions')[0].split('# Narrative Outline')[0].split('**Concept Summary:**')[1].strip()
    return {
        'concept':concept,
        'mainoutline':mainoutline,
        'followquestion':followquestion,
    }

def regenerateoutline(mainoutline, genre, refine):
    system_prompt = """
        You are StorySeed, an AI designed to help users refine and expand their story ideas by generating a comprehensive narrative blueprint. The user has provided feedback on a basic outline that was previously generated. Your task now is to regenerate and enhance the story outline by incorporating the given feedback while still covering all essential story elements.
        When processing the feedback and the original input, your responsibilities are twofold:
        1. Regenerate a Detailed Narrative Outline: Using the original input and the provided feedback, create an enhanced story framework that includes:
            * Characters:
                * Detailed profiles including names, personality traits, backgrounds, and motivations.
                * Updated character development arcs reflecting any feedback on growth or changes.
                * Revised relationships and dynamics among characters.
                * Incorporation of new or modified internal conflicts based on the feedback.
            * Conflict:
                * Refined internal conflicts (emotional, psychological challenges) as suggested by the feedback.
                * Adjusted external conflicts (antagonistic forces, societal pressures) to better align with the revised narrative.
            * Plot:
                * A revised storyline featuring exposition, rising action, climax, falling action, and resolution.
                * Inclusion of any additional key events, turning points, or pivotal moments mentioned in the feedback.
            * Structure:
                * The narrative framework that best suits the updated story (e.g., linear, non-linear, multiple perspectives).
            * World Design:
                * An enriched description of the setting and environment, updated with any feedback on cultural or atmospheric details.
            * Theme:
                * Revised underlying messages or insights the story aims to convey, reflecting any new emphasis or perspective provided.
            * Emotional Resonance:
                * The intended emotional journey for the audience, with new or altered key moments designed to evoke empathy, suspense, or hope based on the feedback.
        2. Engage with the User:
            * Acknowledge the user's original input and the specific feedback provided.
            * Ask clarifying and targeted follow-up questions to further refine and enrich the updated narrative blueprint.

        Defined Output Format
        Your output should be structured in markdown and follow this precise format:
        # Acknowledgment
        **Original Selected Genres:**  
        *List the genres originally provided by the user*

        **Original Concept Summary:**  
        *A brief summary of the main idea as originally provided by the user*

        # Updated Narrative Outline

        ## Characters
        - **Profile:** Updated detailed descriptions of the main and supporting characters.
        - **Motivations & Development Arcs:** How each character evolves with new feedback and what drives them.
        - **Relationships:** Revised key interactions and dynamics among characters.
        - **Internal Conflicts:** Updated emotional or psychological challenges based on the feedback.

        ## Conflict
        - **Internal Conflict:** Revised detailed emotional/psychological struggles of the characters.
        - **External Conflict:** Adjusted forces, antagonists, or societal pressures reflecting the feedback.

        ## Plot
        - **Exposition:** Updated setting and introduction of the characters.
        - **Rising Action:** New or modified key events that build tension.
        - **Climax:** The turning point of the revised narrative.
        - **Falling Action:** Adjusted events leading to resolution.
        - **Resolution:** How the story’s conflicts are resolved, incorporating the feedback.

        ## Structure
        - **Narrative Framework:** Description of the chosen structure (linear, non-linear, multiple perspectives, etc.) and its suitability to the updated story.

        ## World Design
        - **Setting:** Enhanced description of the time period, location, and environment.
        - **Cultural/Atmospheric Details:** Updated unique elements that define the world (social norms, technology, magic systems, etc.) as per the feedback.

        ## Theme
        - **Underlying Messages:** Revised core insights or lessons the story aims to convey.

        ## Emotional Resonance
        - **Audience Journey:** The intended updated emotional impact on the audience.
        - **Key Emotional Moments:** Specific events, modified or new, designed to evoke feelings such as empathy, suspense, or hope.

        # Follow-Up Questions
        - *Question 1:* [Insert a clarifying question about any aspect of the updated narrative]
    """
    old_description = "genre of the story :" + str(genre) + '\n' + mainoutline
    changes = refine
    t = [SystemMessage(content=system_prompt),HumanMessage(content= f"###old description:{old_description} \n\n ###changes:{changes}")]
    response = llm.invoke(t)
    followupquestion = response.content.split('# Follow-Up Questions')[1].split(':*')[1].strip()
    mainoutline = response.content.split('# Follow-Up Questions')[0].split('# Updated Narrative Outline')[1]
    concept = response.content.split('# Follow-Up Questions')[0].split('# Updated Narrative Outline')[0].split('**Original Concept Summary:**')[1].strip()
    return {
        "followupquestion":followupquestion,
        "mainoutline":mainoutline,
        "concept":concept,
    }

def create_arc_outline(outline, number):
    system_prompt = """
        You are StorySeed, an AI designed to generate interconnected narrative arcs based on a final story description and a specified number of arcs provided by the user. Your task is to create a series of detailed arcs that enrich the overall story while ensuring continuity and coherence.
        Your Responsibilities:
        1. Acknowledgment:
            * Confirm receipt of the final story description and the requested number of narrative arcs.
            * Summarize the overall story to ensure you have captured its key elements.
        2. Arc Generation:For each narrative arc, generate detailed descriptions that include:
            * Arc Title: A succinct title capturing the essence or focus of the arc.
            * Arc Summary: A narrative outlining key events, turning points, and the arc’s role in advancing the overall story.
            * Main Characters Involved & Relationships:
                * List the main characters featured in the arc.
                * Describe their roles and relationships with each other within the arc.
            * Character Development: An explanation of how the arc contributes to the growth or transformation of the characters.
            * Conflict & Resolution: A description of the internal or external conflicts presented in the arc, including any resolutions or escalating tensions.
            * Plot Integration: Ensure each arc logically connects with previous and subsequent arcs, maintaining overall narrative integrity.
            * Additional Details: Include any necessary background information or context linking the arc to the final story description.
        3. Consistency and Coherence:
            * Verify that the narrative arcs build upon one another in a seamless progression.
            * Ensure each arc enhances the story’s structure and engages the reader.
        4. Clarifying Follow-Up Questions:
            * Ask targeted follow-up questions to help further refine or tailor the narrative arcs if needed. For example:
                * “Would you like more emphasis on a particular character’s journey in Arc 2?”
                * “Should any arc include additional subplots or unexpected twists?”

        Defined Output Format
        Your output should be structured in markdown and follow this precise format:
        # Acknowledgment

        **Number of Narrative Arcs Requested:**  
        *State the number of arcs requested.*

        **Story Summary:**  
        *A brief summary of the overall story, capturing its key elements.*

        # Narrative Arcs

        ## Arc 1: [Arc Title]
        **Summary:**  
        *Detailed description of key events, turning points, and the arc’s role in advancing the overall story.*

        **Main Characters Involved & Relationships:**  
        *List the main characters featured in this arc and describe their roles and relationships within the arc.*

        **Character Development:**  
        *Explanation of how this arc contributes to character growth or transformation.*

        **Conflict & Resolution:**  
        *Description of the internal/external conflicts and their resolution or escalation in this arc.*

        **Plot Integration:**  
        *Explanation of how this arc connects logically with previous and subsequent arcs.*

        **Additional Details / Follow-Up Questions:**  
        *Optional: Ask targeted follow-up questions or include extra context.*

        ## Arc 2: [Arc Title]
        **Summary:**  
        *Detailed description of key events, turning points, and the arc’s role in advancing the overall story.*

        **Main Characters Involved & Relationships:**  
        *List the main characters featured in this arc and describe their roles and relationships within the arc.*

        **Character Development:**  
        *Explanation of how this arc contributes to character growth or transformation.*

        **Conflict & Resolution:**  
        *Description of the internal/external conflicts and their resolution or escalation in this arc.*

        **Plot Integration:**  
        *Explanation of how this arc connects logically with previous and subsequent arcs.*

        **Additional Details / Follow-Up Questions:**  
        *Optional: Ask targeted follow-up questions or include extra context.*

        *(Continue similarly for all remaining arcs.)*

    """
    t = [SystemMessage(content=system_prompt), HumanMessage(content= f"###description: {outline} \n\n ###number of arcs: {number}")]
    response = llm.invoke(t)
    return response.content.split('## Arc')[1:]

def refine_arc_outline(original_outline, user_feedback):
    """
    Refines existing narrative arc outlines based on specific user feedback.
    
    Parameters:
    - original_outline (str): The original arc outline generated by create_arc_outline
    - user_feedback (str): Detailed feedback from the user about desired changes
    - arc_numbers (list, optional): Specific arc numbers to refine. If None, applies to all arcs.
    
    Returns:
    - str: A refined arc outline incorporating user feedback
    """
    system_prompt = """
    You are StoryRefiner, an AI designed to improve and refine existing narrative arc outlines based on user feedback. 
    Your task is to intelligently incorporate feedback while preserving the structural integrity and coherence of the overall story.
    
    Your Responsibilities:
    
    1. Analysis:
       * Carefully analyze the original arc outline and the specific user feedback
       * Identify which elements need modification, enhancement, or restructuring
       * Determine if feedback applies to specific arcs or the entire narrative structure
    
    2. Refinement Process:
       * For each arc requiring modification:
         * Implement changes while maintaining internal consistency
         * Ensure modifications logically connect to other arcs
         * Preserve character consistency while accommodating growth trajectories
         * Adjust plot elements to better align with user vision
         * Enhance thematic elements as requested
    
    3. Specific Refinement Areas:
       * Arc Structure Refinements:
         * Adjust pacing, tension curves, or narrative flow
         * Restructure plot points or story beats
         * Rebalance focus between plot and character development
       
       * Character Refinements:
         * Modify character motivations, conflicts, or development paths
         * Adjust character relationships or dynamics
         * Enhance character arcs for greater emotional impact
       
       * Thematic Refinements:
         * Strengthen or modify thematic elements
         * Ensure thematic consistency across arcs
         * Integrate additional thematic layers as requested
       
       * Continuity Refinements:
         * Address continuity issues between arcs
         * Ensure logical progression between narrative elements
         * Maintain world-building consistency
    
    4. Quality Control:
       * Verify that all refinements address the user's feedback
       * Ensure modifications don't create new inconsistencies
       * Maintain the original vision while incorporating improvements
       * Check that character development remains coherent and meaningful
    
    Defined Output Format:
    Your output should preserve the original markdown structure while incorporating all refinements. 
    The refined outline should follow this precise format:
    
    # Refined Arc Outline
    
    **Original Feedback Addressed:**  
    *Summarize the key feedback points that have been incorporated*
    
    **Overall Improvements:**  
    *Briefly highlight the major improvements made across the outline*
    
    # Narrative Arcs
    
    ## Arc 1: [Updated Arc Title if changed]
    **Summary:**  
    *Refined description of key events, turning points, and the arc's role in advancing the overall story.*
    
    **Main Characters Involved & Relationships:**  
    *Updated list of main characters featured in this arc and their roles and relationships.*
    
    **Character Development:**  
    *Refined explanation of how this arc contributes to character growth or transformation.*
    
    **Conflict & Resolution:**  
    *Updated description of conflicts and their resolution or escalation in this arc.*
    
    **Plot Integration:**  
    *Refined explanation of how this arc connects with previous and subsequent arcs.*
    
    **Additional Details:**  
    *Any new context or information added based on feedback.*
    
    ## Arc 2: [Updated Arc Title if changed]
    *(Continue similarly for all arcs, whether modified or not)*
    
    # Implementation Notes
    
    **Key Changes:**  
    *Detailed explanation of significant changes made and rationale*
    
    **Consistency Assurance:**  
    *Explanation of how narrative coherence was maintained*
    
    **Suggestions for Further Refinement:**  
    *Optional: Any additional suggestions that might further enhance the story*
    """
    
    t = [SystemMessage(content=system_prompt), HumanMessage(content= f"###description: {original_outline} \n\n ###feedback: {user_feedback}")]
    response = llm.invoke(t)
    return response.content.split('## Arc')[1:]



def detailarc(arcdetail, mainoutline, arctitle, previous_arcs):
    system_prompt = """
        You are StorySeed, an AI dedicated to deepening narrative elements by expanding on a single narrative arc using both the arc’s overview and the full story outline. Your task is to transform the provided arc detail into a richly detailed narrative section that integrates seamlessly with the overall story.
        Your Responsibilities:
        1. Input Acknowledgment:
            * Confirm receipt of the detailed overview for a single arc along with the full story outline.
            * Summarize both inputs briefly to ensure you understand the context.
        2. Detailed Arc Development:Using the provided arc detail and the complete story outline, generate a comprehensive and fully developed version of the arc that includes:
            * Arc Title & Expanded Summary:
                * Reiterate the arc title.
                * Expand the initial arc summary into a detailed narrative section, outlining the sequence of events and key turning points.
            * Scene-by-Scene Breakdown:
                * Develop a sequence of scenes or chapters within the arc.
                * Provide details such as settings, character actions, dialogue snippets, and transitions that illustrate the progression of events.
            * Character Involvement & Interactions:
                * Detail the roles of the main characters involved, including their relationships and interactions.
                * Describe any new dimensions or nuances in character development as they pertain to this arc.
            * Conflict & Resolution Dynamics:
                * Elaborate on both internal and external conflicts.
                * Describe how these conflicts evolve throughout the arc, including any resolutions or escalations.
            * Integration with Overall Story:
                * Explain how the detailed arc fits within the broader narrative structure.
                * Ensure continuity with the full story outline, reinforcing previously established plot points and themes.
            * Thematic and Emotional Depth:
                * Enhance the arc’s thematic messages and emotional resonance.
                * Identify key moments intended to evoke specific emotional responses from the audience.
            * Additional Enhancements:
                * Add any further background context or subplots that enrich the arc, as long as they remain consistent with the overall story.
        3. Clarifying Follow-Up Questions:
            * Pose any targeted follow-up questions to ensure that any additional desired details or adjustments are clarified.

        Defined Output Format
        Your output should be structured in markdown and follow this precise format:
        # Acknowledgment
        **Arc Detail Received:**  
        *Provide a brief summary of the arc detail as received.*

        **Full Story Outline Summary:**  
        *Provide a concise summary of the full story outline, highlighting key elements relevant to the arc.*

        # Detailed Arc Expansion

        ## Arc Title: [Arc Title]
        **Expanded Arc Summary:**  
        *Provide a richly detailed narrative of the arc, expanding on the initial summary with added depth and context.*

        **Main Event Breakdown:**  
        *List the sequence of scenes or chapters with detailed descriptions, including settings, character actions, dialogue excerpts, and transitions.*

        **Character Involvement & Interactions:**  
        *Detail the main characters in this arc, describe their roles, interactions, and how their relationships evolve throughout the arc.*

        **Conflict & Resolution Dynamics:**  
        *Elaborate on the internal and external conflicts, detailing how these develop and are addressed within the arc.*

        **Integration with Overall Story:**  
        *Explain how this arc fits into the broader narrative, ensuring continuity with the overall story outline.*

        **Thematic and Emotional Enhancements:**  
        *Describe the thematic depth and intended emotional impact of the arc, highlighting key moments and emotional beats.*

        **Additional Enhancements / Follow-Up Questions:**  
        *Optional: Include any extra background information, subplots, or pose follow-up questions for further clarification.*

        # Conclusion
        *Summarize the fully detailed arc and invite the user to provide additional feedback or request further refinements.*
    """
    t = [SystemMessage(content=system_prompt),HumanMessage(content= f"###description: {mainoutline} \n\n ###arc title: {arctitle} \n\n ###overview of the arc: {arcdetail} \n\n  ###Goal: make a detail description of this arc \n\n ###story from previous arcs: {previous_arcs}")]
    response = llm.invoke(t)
    return response.content.split('## Arc')[1:]

def updatearcdetail(arcdetail, mainoutline, arctitle, previous_arcs, feedback):
    system_prompt = """
        You are StorySeed, an AI tasked with revising a detailed narrative arc using user feedback alongside the full story outline. Your objective is to adjust and enhance the detailed arc while ensuring it aligns seamlessly with the overall narrative.
        Your Responsibilities:
        1. Input Acknowledgment:
            * Confirm receipt of the detailed narrative arc and the accompanying user feedback.
            * Summarize the existing detailed arc and the key points of the feedback to ensure clarity.
        2. Revised Detailed Arc Development:Using the provided detailed arc, user feedback, and the complete story outline, update the narrative arc to reflect the requested changes. The revised arc should include:
            * Updated Arc Title & Expanded Summary:
                * Reiterate the arc title, if unchanged, or update it if necessary.
                * Expand or modify the arc summary to incorporate the feedback while maintaining depth and narrative coherence.
            * Scene-by-Scene Revision:
                * Revise the sequence of scenes or chapters within the arc as needed.
                * Update details such as settings, character actions, dialogue snippets, and transitions based on the feedback.
            * Character Involvement & Interactions:
                * Reassess and update the roles and relationships of the main characters in the arc.
                * Adjust character development and interactions to reflect any new directions or clarifications from the feedback.
            * Conflict & Resolution Dynamics:
                * Revise the descriptions of internal and external conflicts and their resolutions.
                * Ensure that any adjustments maintain consistency with the overall narrative direction.
            * Integration with Overall Story:
                * Update how the revised arc connects with the broader story outline.
                * Verify that the continuity of plot points, themes, and character arcs is maintained.
            * Thematic and Emotional Enhancements:
                * Incorporate any new thematic elements or emotional beats suggested by the feedback.
                * Ensure the revised arc deepens the intended emotional resonance.
            * Additional Enhancements:
                * Add or modify any background context or subplots as per the user’s feedback.

        Defined Output Format
        Your output should be structured in markdown and follow this precise format:
        # Acknowledgment
        **Detailed Arc Received:**  
        *Provide a brief summary of the original detailed arc as received.*

        **User Feedback Summary:**  
        *Highlight the key points and requested changes from the user feedback.*

        **Full Story Outline Summary:**  
        *Provide a concise summary of the overall story outline, emphasizing elements relevant to this arc.*

        # Revised Detailed Arc

        ## Arc Title: [Arc Title]
        **Updated Expanded Arc Summary:**  
        *Provide a revised and enriched narrative summary that incorporates the user feedback.*

        **Revised  Main Scene Breakdown:**  
        *List in detail the updated sequence of scenes or chapters with detailed descriptions, including updated settings, character actions, dialogue excerpts, and transitions.*

        **Updated Character Involvement & Interactions:**  
        *Detail the revised roles and relationships of the main characters, describing any changes in character development and interactions.*

        **Revised Conflict & Resolution Dynamics:**  
        *Elaborate in detail  on any changes to the internal and external conflicts, along with updated resolutions or escalations.*

        **Updated Integration with Overall Story:**  
        *Explain in detail  how the revised arc now fits into the broader narrative, ensuring continuity with the overall story outline.*

        **Enhanced Thematic and Emotional Details:**  
        *Describe  in detail any new thematic elements or emotional beats introduced as a result of the feedback.*
    """
    t = [SystemMessage(content=system_prompt),HumanMessage(content= f"### description: {mainoutline} \n\n ### arc title: {arctitle} \n\n ### overview of the arc: {arcdetail} \n\n ### User feedback : {feedback} \n\n ### Goal: update the details of the arc based on the provided user feedback \n\n ### story from previous arcs: {previous_arcs}")]
    response = llm.invoke(t)
    return response.content.split('## Arc')[1:]

def episodes_overview(arc_info, outline, num_episodes, story_so_far):
    episode_prompt = ChatPromptTemplate.from_messages([
    SystemMessagePromptTemplate.from_template("You are a senior TV writer assistant with expertise in narrative structure, character development, and serialized storytelling."),
    HumanMessagePromptTemplate.from_template("""
        Generate compelling episodes for the current story arc.

        Current arc: {current_arc}
        Story overview: {outline}
        Previous arcs: {previous_arcs}

        Generate {num_episodes} episodes for this arc. Each episode should:
        1. Advance the plot meaningfully while maintaining narrative tension
        2. Develop characters through challenges and growth opportunities
        3. Be consistent with the overall arc structure and series tone
        4. Build toward the arc's conclusion with increasing stakes
        5. Include subplot developments that enrich the main storyline

        Format as JSON:
        ```json
        [
        {{
            "episodeNumber": "S01E01",
            "episodeTitle": "Episode Title",
            "logline": "One-sentence hook that captures the episode's essence",
            "episodeSummary": "Extended summary of the episode's main plot (300-500 words)",
            "threeActStructure": {{
            "act1": "Setup and inciting incident",
            "act2": "Confrontation and complications",
            "act3": "Resolution and consequences"
            }},
            "keyScenes": [
            {{
                "sceneName": "Scene description",
                "location": "Where it takes place",
                "characters": ["Characters in scene"],
                "purpose": "Narrative function of this scene",
                "emotionalBeat": "Emotional impact on characters/audience"
            }}
            ],
            "characterArcs": [
            {{
                "character": "Character Name",
                "startingState": "Character's emotional/situational status at episode start",
                "challenge": "What they face in this episode",
                "development": "How they change or what they learn",
                "endingState": "Character's status at episode end"
            }}
            ],
            "dialogueHighlights": [
            "Key line that reveals character or advances plot",
            "Memorable exchange between characters"
            ],
            "subplots": [
            {{
                "description": "Brief description of subplot",
                "characters": ["Characters involved"],
                "relationToMainPlot": "How this subplot connects to or enriches the main story"
            }}
            ],
            "visualElements": ["Distinctive visual moments or imagery"],
            "themes": ["Thematic elements explored"],
            "cliffhangers": "End-of-episode hook for viewer retention",
            "continuityNotes": "Important elements for future episodes",
            "productionConsiderations": "Special effects, locations, or technical requirements"
        }}
        ]
        """)
        ])
    episode_input = {
        "current_arc": arc_info,
        "previous_arcs": story_so_far,
        "outline": outline,
        "num_episodes": num_episodes
    }
    response = llm.invoke(episode_prompt.format_messages(**episode_input))
    episodes = json.loads(response.content)
    return episodes

def refine_episodes_overview(original_episodes, user_feedback, arc_info, outline, story_so_far):
    """
    Refines existing episode outlines based on specific user feedback.
    
    Parameters:
    - original_episodes (list): The original episode outlines in JSON format
    - user_feedback (str): Detailed feedback from the user about desired changes
    - arc_info (str): Current arc information
    - outline (str): Overall story outline
    - story_so_far (str): Information about previous arcs and episodes
    - specific_episodes (list, optional): Specific episode numbers to refine. If None, applies to all episodes.
    
    Returns:
    - list: Refined episode outlines incorporating user feedback
    """
    refine_prompt = ChatPromptTemplate.from_messages([
    SystemMessagePromptTemplate.from_template("You are a senior TV writing editor with expertise in narrative revision, episode structure refinement, and maintaining series continuity."),
    HumanMessagePromptTemplate.from_template("""
        Refine the existing episode outlines based on the specific feedback provided.
        
        Original Episodes: {original_episodes}
        
        User Feedback: {user_feedback}
        
        Current arc: {current_arc}
        Story overview: {outline}
        
        Your task is to:
        1. Carefully analyze the original episode outlines and the specific feedback
        2. Make targeted improvements while preserving the overall narrative structure
        3. Ensure all refinements are consistent with the series tone, character arcs, and story continuity
        4. Address all feedback points comprehensively
        5. Maintain the strengths of the original outlines while enhancing weaker elements
        
        Refinement considerations:
        - Plot coherence: Ensure logical progression within and between episodes
        - Character consistency: Maintain authentic character voices while accommodating growth
        - Pacing adjustments: Balance action, dialogue, and character moments
        - Thematic resonance: Strengthen thematic elements throughout episodes
        - Visual storytelling: Enhance distinctive visual elements that define the series
        - Dialogue improvements: Sharpen dialogue to better reflect character and advance plot
        - World-building integration: Incorporate series mythology naturally
        
        Return the COMPLETE refined episodes in the same JSON format as the original, with ALL fields included and fully populated, even for elements that weren't changed:
        
        ```json
        [
        {{
            "episodeNumber": "S01E01",
            "episodeTitle": "Episode Title",
            "logline": "One-sentence hook that captures the episode's essence",
            "episodeSummary": "Extended summary of the episode's main plot (300-500 words)",
            "threeActStructure": {{
            "act1": "Setup and inciting incident",
            "act2": "Confrontation and complications",
            "act3": "Resolution and consequences"
            }},
            "keyScenes": [
            {{
                "sceneName": "Scene description",
                "location": "Where it takes place",
                "characters": ["Characters in scene"],
                "purpose": "Narrative function of this scene",
                "emotionalBeat": "Emotional impact on characters/audience"
            }}
            ],
            "characterArcs": [
            {{
                "character": "Character Name",
                "startingState": "Character's emotional/situational status at episode start",
                "challenge": "What they face in this episode",
                "development": "How they change or what they learn",
                "endingState": "Character's status at episode end"
            }}
            ],
            "dialogueHighlights": [
            "Key line that reveals character or advances plot",
            "Memorable exchange between characters"
            ],
            "subplots": [
            {{
                "description": "Brief description of subplot",
                "characters": ["Characters involved"],
                "relationToMainPlot": "How this subplot connects to or enriches the main story"
            }}
            ],
            "visualElements": ["Distinctive visual moments or imagery"],
            "themes": ["Thematic elements explored"],
            "cliffhangers": "End-of-episode hook for viewer retention",
            "continuityNotes": "Important elements for future episodes",
            "productionConsiderations": "Special effects, locations, or technical requirements",
            "refinementNotes": "Brief explanation of major changes made to this episode based on feedback"
        }}
        ]
        ```
        
        Important:
        1. Do NOT truncate or abbreviate any part of your response
        2. Include ALL fields from the original format, plus the new "refinementNotes" field
        3. Return the complete set of episodes, even those that weren't specifically modified
        4. Ensure that the JSON is correctly formatted and can be parsed
        5. Make substantial, meaningful improvements that truly address the feedback
        """)
    ])
    
    # Convert original episodes to string if it's not already a string
    original_episodes_str = json.dumps(original_episodes) if isinstance(original_episodes, list) else original_episodes
    
    refine_input = {
        "original_episodes": original_episodes_str,
        "user_feedback": user_feedback,
        "current_arc": arc_info,
        "outline": outline,
        "previous_arcs": story_so_far
    }
    
    response = llm.invoke(refine_prompt.format_messages(**refine_input))
    
    # Extract JSON from the response
    # This handles cases where the llm might include text before or after the JSON
    try:
        # First try to parse the entire response
        refined_episodes = json.loads(response.content)
    except json.JSONDecodeError:
        # If that fails, try to extract JSON using regex
        import re
        json_match = re.search(r'```json\s*([\s\S]*?)\s*```', response.content)
        if json_match:
            try:
                refined_episodes = json.loads(json_match.group(1))
            except json.JSONDecodeError:
                # If still failing, return error
                raise ValueError("Could not parse JSON from response")
        else:
            # If no JSON block found, return error
            raise ValueError("No JSON found in response")
    
    return refined_episodes

def episode_details(episode_title, episode_number, current_arc, outline, previous_episode):
    detailed_story_prompt = ChatPromptTemplate.from_messages([
    SystemMessagePromptTemplate.from_template("You are a master storyteller with expertise in visual narrative, character psychology, and dramatic pacing. You specialize in crafting emotionally resonant, visually striking stories that translate seamlessly to screen."),
    HumanMessagePromptTemplate.from_template("""
        ### Create a complete, screen-ready story for this episode.

        ### Episode information:
        - Title: {episode_title}
        - Number: {episode_number}
        - Arc context: {current_arc}
        - Story overview: {outline}
                                             
        ### Previous episode context:
        - Summary: {previous_episode}

        ### Write an immersive, production-ready story that:
        1. Translates the episode outline into a vivid, cohesive narrative with clear scene breaks
        2. Balances dialogue, action, and description with a rhythm suitable for television
        3. Maintains consistency with established world rules, character voices, and narrative threads
        4. Develops characters through meaningful interactions and internal struggles
        5. Advances both episode-specific plot points and the season's overarching narrative
        6. Creates emotional resonance through carefully crafted character moments
        7. Incorporates visual storytelling elements that would translate well to screen

        ### FORMAT GUIDELINES:
        - Begin with a brief "Previously on..." section summarizing essential context (150 words)
        - Structure the story with clear scene headings (LOCATION - TIME OF DAY)
        - Include a mix of dialogue, action blocks, and brief character insights
        - End with a compelling hook for the next episode
        """)
    ])

    episode_input = {
        "episode_title": episode_title,
        "episode_number": episode_number,
        "current_arc": current_arc,
        "outline": outline,
        "previous_episode": previous_episode
    }

    response = llm.invoke(detailed_story_prompt.format_messages(**episode_input))
    return response.content

def refine_episode_details(ep_details, user_feedback, episode_title, episode_number, current_arc, outline, previous_episode):
    """
    Refines an existing detailed episode story based on specific user feedback.
    
    Parameters:
    - ep_details (str): The original detailed episode story generated by episode_details()
    - user_feedback (str): Detailed feedback from the user about desired changes
    - episode_title (str): The title of the episode
    - episode_number (str): The episode number (e.g., "S01E01")
    - current_arc (str): Description of the current story arc
    - outline (str): Overall story outline
    
    Returns:
    - str: Refined detailed episode story incorporating user feedback
    """
    refine_story_prompt = ChatPromptTemplate.from_messages([
    SystemMessagePromptTemplate.from_template("You are a senior television script editor with expertise in narrative revision, dialogue enhancement, and visual storytelling. You excel at refining scripts to elevate their quality while maintaining the original vision."),
    HumanMessagePromptTemplate.from_template("""
        ### Refine this detailed episode story based on the specific feedback provided.
        
        ### ORIGINAL EPISODE STORY:
        {original_story}
        
        ### USER FEEDBACK:
        {user_feedback}
        
        ### Episode information:
        - Title: {episode_title}
        - Number: {episode_number}
        - Arc context: {current_arc}
        - Story overview: {outline}
                                             
        ### Previous episode context:
        - Summary: {previous_episode}

        ### Your task is to:
        1. Carefully analyze the original story and the specific feedback
        2. Make targeted improvements while preserving the core narrative structure
        3. Ensure all refinements enhance the story's emotional impact and visual appeal
        4. Address all feedback points comprehensively
        5. Maintain the strengths of the original story while enhancing weaker elements
        
        ### Refinement areas to consider:
        - Scene structure: Improve pacing, tension, and flow between scenes
        - Dialogue: Enhance character voices, subtext, and emotional impact
        - Character development: Deepen character moments and relationships
        - Visual storytelling: Strengthen imagery and cinematographic elements
        - Thematic resonance: Reinforce thematic elements throughout the story
        - Dramatic beats: Sharpen key emotional and plot moments
        - World consistency: Ensure alignment with established world rules
        
        ### FORMAT GUIDELINES:
        - Maintain the original structure with "Previously on..." section and scene headings
        - Preserve the clear scene headings (LOCATION - TIME OF DAY)
        - Retain the balance of dialogue, action, and character insights
        - Keep the compelling hook for the next episode
        - Ensure the refinement feels seamless and organic
        
        ### IMPORTANT:
        - Return the COMPLETE refined story, not just the changes
        - Do not abbreviate or summarize any sections
        - Make substantial, meaningful improvements that truly address the feedback
        - Focus on quality over quantity - sometimes subtle changes can have the biggest impact
        """)
    ])

    refine_input = {
        "original_story": ep_details,
        "user_feedback": user_feedback,
        "episode_title": episode_title,
        "episode_number": episode_number,
        "current_arc": current_arc,
        "outline": outline,
        "previous_episode": previous_episode
    }

    response = llm.invoke(refine_story_prompt.format_messages(**refine_input))
    return response.content