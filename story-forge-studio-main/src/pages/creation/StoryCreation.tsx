import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../App";
import { Button } from "@/components/ui/button";
import { StageStatus, StoryBasicInfo, StoryOutline } from "@/types/story";
import { ChevronLeft, CheckCircle, Lock, CircleEllipsis, BookOpen, User, ChevronRight, PanelLeftClose, PanelLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import BasicInfoStage from "./stages/BasicInfoStage";
import OutlineStage from "./stages/OutlineStage";
import CharactersStage from "./stages/CharactersStage";
import ArcStage from "./stages/ArcStage";
import EpisodeStage from "./stages/EpisodeStage";
import FinalEpisodeStage from "./stages/FinalEpisodeStage";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

type Stage = {
  id: string;
  name: string;
  description: string;
  status: StageStatus;
  component: React.ComponentType<any>;
};

const StoryCreation = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [storyData, setStoryData] = useState({
    basicInfo: {
      title: "The Forgotten Realms",
      description: "A young archaeologist discovers an ancient artifact that opens a portal to a world where forgotten gods still hold power. As the boundaries between worlds begin to blur, she must navigate political intrigue and magical dangers to prevent catastrophe in both realms.",
      genres: ["fantasy", "adventure", "mystery"],
      instructions: "I'd like the story to incorporate elements of ancient mythology while keeping the protagonist grounded and relatable.",
    },
    outline: {
      markdown: "# Story Outline\n\nYour story outline will appear here after completing the basic info stage.",
      question: "Would you like to add any specific themes to your story?"
    },
    characters: {
      minNumberOfCharacters: 5,
      characterInfo: {
        "Dr. Elena Reyes": "The protagonist, a 32-year-old archaeologist specializing in ancient civilizations. Brilliant but cautious, she's driven by curiosity rather than fame. Recently divorced, she's thrown herself into her work to avoid dealing with personal issues. Her analytical mind becomes both an asset and a limitation when faced with the supernatural.",
        "Malik Thorne": "A mysterious guide with knowledge of both worlds, appears to be in his 40s though his true age is unknown. Has his own agenda that he keeps hidden from Elena. Charismatic and dangerous, with unclear loyalties.",
        "Professor James Harrington": "Elena's 68-year-old mentor, suffering from early dementia which has given him unexpected insights into the other realm. His episodes of clarity provide crucial information, though Elena often doesn't recognize their importance until later.",
        "Lysandra": "A powerful deity from the forgotten realm who appears as a regal woman in her 30s. Once worshipped as a goddess of wisdom, now desperate to restore her influence in both worlds. Views humans as tools rather than equals.",
        "Director Castillo": "Head of Elena's research institute, outwardly supportive but secretly affiliated with a clandestine organization studying interdimensional travel. In her 50s, shrewd and politically connected."
      }
    },
    arcs: {
      numberOfArcs: 3,
      arcTitle: "Discovery",
      arcInfo: {
        "Discovery": "Elena discovers the artifact and begins experiencing strange phenomena, culminating in her first journey to the other realm.",
        "Understanding & Alliance": "Elena forms uneasy alliances in both worlds while learning to navigate the politics and dangers of the forgotten realm.",
        "Confrontation & Balance": "The barriers between worlds threaten to collapse completely as Elena must confront both Lysandra and Director Castillo to establish a new equilibrium."
      },
      arcDetails: {
        "Discovery": "The arc begins with Elena leading an archaeological dig in northern Turkey, where her team uncovers an unusual temple structure that doesn't match any known civilization. In a sealed chamber, Elena discovers a peculiar artifact: a handheld bronze disc inscribed with unfamiliar symbols. Upon touching it, she experiences a brief vision of another world.\n\nBack at her university, strange occurrences begin: objects moving on their own, glimpses of figures that shouldn't be there, and dreams of a world bathed in purple light. Professor Harrington recognizes some of the symbols from his own research and, during a moment of unusual clarity, warns Elena that 'the boundaries are thinning.'\n\nElena begins researching similar artifacts and discovers subtle references throughout multiple ancient cultures. During a late night in her office, the artifact activates, creating a temporary portal. Elena, driven by curiosity, steps through and finds herself in a realm where the laws of physics seem altered, with floating structures and vibrant, impossible colors. She encounters Malik, who claims he's been waiting for someone to cross over, before she's abruptly pulled back to her world.",
        "Understanding & Alliance": "With proof that another realm exists, Elena becomes determined to establish controlled contact. She discovers that the artifact responds to certain thought patterns and emotions, allowing her to create stable portals. Malik begins acting as her guide to the forgotten realm, explaining that it was once closely connected to Earth before humans stopped believing in the old gods.\n\nIn our world, Director Castillo takes unusual interest in Elena's research, offering additional funding and resources while requesting frequent updates. Professor Harrington's condition worsens, but his episodes now include coherent conversations with invisible entities.\n\nIn the forgotten realm, Elena meets Lysandra, who presents herself as an ally seeking to restore healthy connections between the worlds. She teaches Elena how to navigate the realm's unpredictable magic. Meanwhile, Elena notices concerning signs: displaced people from Earth appearing confused in the forgotten realm, and strange energy fluctuations affecting technology back home.\n\nMalik eventually reveals his true nature as a being who can exist in both worlds and warns Elena that Lysandra's intentions may not be benevolent. Elena must navigate political factions while trying to understand the true nature of the connection between worlds.",
        "Confrontation & Balance": "The barriers between worlds grow dangerously thin, with unpredictable portal openings causing chaos in both realms. Elena discovers that Lysandra plans to fully merge the worlds, which would grant her enormous power but cause catastrophic destruction in the process. Similarly, she learns that Director Castillo's organization aims to harvest the forgotten realm's energy, regardless of the consequences to its inhabitants.\n\nProfessor Harrington's condition is revealed to be a result of his mind partially existing in the forgotten realm. He sacrifices his last moments of clarity to give Elena crucial information about how the ancient people maintained balance between worlds.\n\nElena and Malik work to gather allies from both realms, including some of the less extreme deities and members of Castillo's organization who recognize the danger. In a climactic confrontation at an ancient nexus point, Elena uses her understanding of both worlds to establish a new form of controlled connection - not fully separated but not dangerously merged either.\n\nThe resolution leaves Elena as a permanent guardian of this balance, with the ability to travel between worlds but the responsibility to maintain their separation. Lysandra is diminished but not destroyed, and Director Castillo's organization is reformed with new oversight."
      }
    },
    episodes: {
      arcTitle: "Discovery",
      numberOfEpisodes: 5,
      episodeInfo: {
        "Episode 1: Unearthed": "Elena discovers the mysterious artifact during an archaeological dig in northern Turkey.",
        "Episode 2: Strange Occurrences": "Back at the university, Elena begins experiencing inexplicable phenomena linked to the artifact.",
        "Episode 3: The First Crossing": "The artifact activates, creating a portal that Elena steps through, experiencing the forgotten realm for the first time.",
        "Episode 4: The Guide": "Elena meets Malik, who explains the history of the connection between worlds.",
        "Episode 5: Ripple Effects": "Strange events in the normal world indicate that the barrier between realms is weakening."
      },
      episodeDetails: {
        "Episode 1: Unearthed": `FADE IN:

EXT. ARCHAEOLOGICAL DIG SITE - NORTHERN TURKEY - DAY

A sprawling excavation in a remote valley. Graduate students and workers carefully brush dirt from stone structures. DR. ELENA REYES (32), intense and focused, examines a tablet through a magnifying glass.

ELENA
(to herself)
This doesn't match any known Hittite or Phrygian symbolism.

Her assistant, DEVON (25), approaches.

DEVON
Dr. Reyes, you need to see this. We've found something in the lower chamber.

INT. UNDERGROUND CHAMBER - MOMENTS LATER

Elena descends on a rope ladder into a dust-filled room untouched for millennia. Her headlamp illuminates unusual architectural details.

ELENA
These support structures... they're not Roman or Greek. Not even Mesopotamian.

She approaches a stone altar in the center. On it lies a BRONZE DISC, about 8 inches in diameter, covered in strange symbols.

DEVON
Should I call Professor Harrington?

ELENA
(mesmerized by the disc)
Not yet. Let's document everything first.

She carefully photographs the disc from multiple angles.

ELENA
I've never seen this writing system before.

She puts down her camera and reaches for the disc.

DEVON
(worried)
Shouldn't you use gloves?

ELENA
Yes, I should.

She pulls gloves from her pocket, puts them on, then lifts the disc.

CLOSE ON: The disc GLOWS briefly when she touches it.

Elena's eyes unfocus momentarily, her expression one of shock.

DEVON
Dr. Reyes? Are you okay?

Elena blinks, returning to normal.

ELENA
(confused)
Did you see that?

DEVON
See what?

Elena stares at the disc, troubled.

ELENA
Nothing. Probably just dust in my eyes.

She carefully places the disc in a preservation container, but can't stop staring at it.

ELENA
Tell the team to pack up. We're taking this back to the university immediately.

OFF ELENA: Her usual scientific detachment replaced by an unfamiliar feeling - something between fear and fascination.

FADE OUT.`,
        "Episode 2: Strange Occurrences": `FADE IN:

INT. UNIVERSITY LABORATORY - NIGHT

Elena works alone, examining the bronze disc under specialized equipment. Various screens display analyses in progress.

ELENA
(frustrated)
Material composition inconclusive. Dating inconclusive. Symbols match no known language database.

She leans back, rubbing her tired eyes. When she looks up, for a split second, a SHADOWY FIGURE appears to be standing across the room. She jumps, but it's gone.

ELENA
Hello? Is someone there?

Silence. She shakes her head and returns to work.

CLOSE ON: The disc under a microscope. The symbols appear to SHIFT slightly, then return to normal.

Elena blinks, puzzled. She adjusts the microscope.

ELENA
That's impossible.

The lights FLICKER. A cold breeze passes through the sealed room.

Elena's phone RINGS, startling her. It's PROFESSOR HARRINGTON.

ELENA
(answering)
James, it's late. Why are you—

PROFESSOR HARRINGTON (O.S.)
(agitated)
Have they started speaking to you yet?

ELENA
What? Who?

PROFESSOR HARRINGTON (O.S.)
The ones who wait between. The forgotten ones.

Elena looks disturbed.

ELENA
James, you're not making sense. Are you taking your medication?

PROFESSOR HARRINGTON (O.S.)
Listen very carefully, Elena. The boundaries are thinning. You've found a key.

INT. ELENA'S APARTMENT - LATER THAT NIGHT

Elena tosses in her sleep. DREAM IMAGES flash: a landscape with purple skies, floating islands, figures with too many limbs.

She wakes with a gasp to find all the objects in her bedroom LEVITATING a few inches off their surfaces. When she sits up, everything crashes down simultaneously.

INT. UNIVERSITY LABORATORY - THE NEXT DAY

Elena enters to find PROFESSOR JAMES HARRINGTON (68), frail but with sharp eyes, examining the disc.

ELENA
James. I didn't expect you here.

HARRINGTON
(surprisingly lucid)
I had a good morning. The fog lifted.

He points to his notes - detailed drawings of symbols from the disc.

HARRINGTON
I've seen these before. In dreams, mostly. But also in fragments from digs across multiple continents.

ELENA
That's not possible. We ran comparisons—

HARRINGTON
Your computers wouldn't find them because they're not looking in the right places.

He pulls out an old journal, shows her sketches that indeed match some symbols.

HARRINGTON
These don't belong to our world, Elena.

As he says this, the disc VIBRATES slightly. Both notice.

ELENA
(whispering)
What is happening, James?

HARRINGTON
(his lucidity fading)
They're waking up. The old ones. They know you have their key.

His eyes go unfocused, his momentary clarity evaporating.

HARRINGTON
(confused)
Elena? When did you get here? Are we having tea?

Elena looks from her mentor to the disc, deeply troubled.

FADE OUT.`,
        "Episode 3: The First Crossing": `FADE IN:

INT. ELENA'S OFFICE - NIGHT

Elena works late, surrounded by research materials about the disc. Books on ancient mythology, printouts of similar symbols from around the world.

A KNOCK at her door.

ELENA
Come in.

DIRECTOR ISABELLE CASTILLO (50s), polished and authoritative, enters.

CASTILLO
Working late again, Dr. Reyes? Your dedication is admirable.

ELENA
(guarded)
Director Castillo. I didn't think anyone else was in the building.

CASTILLO
I'm always interested in our most promising research.

She approaches Elena's desk, eyes fixed on the bronze disc.

CASTILLO
May I?

Before Elena can answer, Castillo picks up the disc, examining it.

CASTILLO
Fascinating. The board would be quite interested in prioritizing this project. Additional funding, resources...

ELENA
I haven't prepared a formal proposal yet.

CASTILLO
Sometimes exceptional discoveries require... exceptional procedures.

She places the disc down.

CASTILLO
I'll expect a preliminary report by next week.

After Castillo leaves, Elena notices the disc is now positioned differently. She approaches it cautiously.

CLOSE ON: The symbols on the disc are GLOWING faintly.

ELENA
What the...

The glow intensifies. The disc begins to SPIN slowly on the desk by itself. Elena backs away.

The disc spins faster, the light grows brighter, then suddenly projects upward into a swirling VORTEX OF LIGHT about six feet tall.

ELENA
(whispered)
That's not possible.

The vortex stabilizes into something resembling a DOORWAY. Through it, Elena can see a landscape with a purple sky and floating rock formations.

Elena grabs her phone, starts recording. She approaches the portal cautiously, reaching toward it. Her hand passes through.

ELENA
It's not just light.

She looks around the empty office, then back at the portal. Scientific curiosity overtakes caution.

ELENA
Three minutes. Just three minutes, then I come back.

She steps through.

EXT. THE FORGOTTEN REALM - CONTINUOUS

Elena emerges onto a rocky plateau. The physics feel strange - gravity seems lighter. The sky is purple-hued with two small moons. In the distance, islands of rock FLOAT in the air.

ELENA
(breathless)
Oh my god.

She looks back at the portal still swirling behind her. Then turns to survey the impossible landscape.

Vegetation glows with bioluminescence. Strange bird-like creatures with too many wings circle overhead.

ELENA
(recording on her phone)
I appear to have entered... another dimension or reality. The physical laws seem altered. There are floating land masses and—

Her phone DIES suddenly.

A voice comes from behind her.

MALIK (O.S.)
Technology from your world doesn't work reliably here.

Elena spins around to see MALIK THORNE (40s), dressed in clothing that blends styles from various historical periods. Handsome, with an ageless quality.

ELENA
Who are you? What is this place?

MALIK
My name is Malik. And this... this is what your people once called the realm of gods.

ELENA
That's not possible. I must be hallucinating.

MALIK
(smiling)
You scientists always say that at first.

He approaches, studying her with intense interest.

MALIK
The better question is: who are you? Do you realize how rare it is for someone to cross over intentionally?

Before Elena can answer, the portal behind her PULSES erratically.

MALIK
(alarmed)
Your anchor is unstable.

ELENA
My what?

The portal begins to SHRINK.

MALIK
(urgent)
The disc! It's pulling you back!

Elena feels herself being TUGGED toward the portal.

MALIK
(wait! Tell me your name!)

ELENA
(being pulled backward)
Elena! Elena Reyes!

MALIK
I'll find you, Elena Reyes!

Elena is YANKED backward through the closing portal.

INT. ELENA'S OFFICE - CONTINUOUS

Elena CRASHES back into her office, falling to the floor. The portal SNAPS shut. The disc stops spinning and goes dark.

Elena, breathing heavily, stares at the now-ordinary looking disc.

ELENA
(in shock)
That was real. That was really real.

She touches her sleeve - a strange, glowing POLLEN from the other realm still clings to the fabric. Proof.

FADE OUT.`,
        "Episode 4: The Guide": `FADE IN:

INT. ELENA'S APARTMENT - NIGHT - ONE WEEK LATER

Elena has transformed her living room into a research center. Photos, notes, and diagrams cover the walls. The bronze disc sits in a special case under lights.

She's attempting to recreate the conditions that activated the portal, arranging crystals around the disc based on notes.

ELENA
(frustrated)
Come on. What was different?

She picks up the disc, turning it in her hands. Nothing happens.

ELENA
(to the disc)
What are you waiting for?

A KNOCK at the door startles her. Elena quickly hides the disc under some papers.

She opens the door to find a delivery man with a package.

DELIVERY MAN
Dr. Elena Reyes?

ELENA
Yes.

DELIVERY MAN
Sign here, please.

After he leaves, Elena opens the package. Inside is an ancient-looking LEATHER-BOUND BOOK. No sender information.

Elena flips through the book - it contains drawings similar to the symbols on the disc.

A note falls out: "The gate opens with intention, not tools. - M"

Elena stares at the note, then at the disc. She removes it from under the papers.

ELENA
Intention...

She holds the disc in both hands, closes her eyes, and focuses intensely on the memory of the other realm.

The disc begins to WARM in her hands. The symbols start to GLOW.

ELENA
(excited)
That's it!

The disc SPINS, and the portal FORMS. More stable this time.

Elena, prepared now, grabs a pre-packed bag and steps through.

EXT. THE FORGOTTEN REALM - CONTINUOUS

Elena emerges on the same rocky plateau. This time she carries a small backpack with supplies. She wears hiking boots and practical clothing.

MALIK (O.S.)
You're a quick learner.

She turns to see Malik sitting on a rock, as if he's been waiting.

ELENA
You sent the book.

MALIK
(standing)
I thought you might need some help getting back.

ELENA
How did you find me in my world?

MALIK
There are thin places between realms. I can't fully cross over, but I can reach through sometimes.

ELENA
What is this place? Really?

Malik gestures for her to walk with him. They head toward a path leading down from the plateau.

MALIK
It has many names. The Forgotten Realm. The Other Side. The world of gods and spirits. It exists alongside your world, separated by a barrier that was once much thinner.

ELENA
That's not scientifically possible.

MALIK
(amused)
Says the woman who just walked through a doorway between worlds.

They reach a ridge overlooking a vast landscape - floating islands connected by bridges of light, distant structures that defy physics, creatures of impossible forms moving through the air.

MALIK
Long ago, humans and this realm existed in balance. Your ancestors understood this world. They called its inhabitants gods, spirits, demons... they built rituals to communicate across the barrier.

ELENA
Mythology. Ancient religions.

MALIK
Not myths. Misunderstood truths. As human belief changed, as science replaced spiritual understanding, the connection weakened.

He points to areas of the landscape that appear to be FADING, becoming transparent.

MALIK
Parts of this realm are dying because they're no longer tethered to human consciousness.

ELENA
That sounds like you're saying they only exist because people believe in them.

MALIK
Reality is more complex than either of our worlds understand. Both exist independently, yet are influenced by each other.

Elena takes out a small device - a custom sensor.

ELENA
Do you mind if I take some readings?

MALIK
(smiling)
The scientist emerges. Go ahead.

As she takes readings, Malik watches her with intense interest.

ELENA
So if I'm understanding you... the portal, the disc... these are ways to physically cross between connected worlds that used to be accessible to humans?

MALIK
Yes. And you are the first human in centuries to activate a crossing intentionally. That makes you very special... and potentially very dangerous.

Elena looks up from her device.

ELENA
Dangerous? To whom?

MALIK
There are beings here who have been cut off from your world for a very long time. Some have been... plotting their return.

In the distance, a TOLLING BELL sound echoes.

MALIK
(urgently)
We need to move. That's a boundary weakening. Not safe to be out in the open.

ELENA
Boundary weakening? What does that mean?

MALIK
It means the barriers between worlds are starting to fail. And not just because of your disc.

He leads her quickly down the path toward shelter, leaving Elena filled with more questions than answers.

FADE OUT.`,
        "Episode 5: Ripple Effects": `FADE IN:

INT. UNIVERSITY HALLWAY - DAY

Elena walks briskly, looking tired but energized. DEVON catches up to her.

DEVON
Dr. Reyes! Did you hear about the incident in the physics lab?

ELENA
What incident?

DEVON
All their equipment went haywire yesterday. Readings off the charts, then everything electronic died simultaneously. They're saying it was some kind of EMP.

Elena stops walking, concerned.

ELENA
When exactly did this happen?

DEVON
Around 8:30 last night.

Elena checks her notes - the exact time she was crossing back from the Forgotten Realm.

INT. PROFESSOR HARRINGTON'S OFFICE - LATER

Elena enters to find Harrington standing at his window, staring outside with unusual intensity.

ELENA
James?

HARRINGTON
(without turning)
They're coming through the thin places, Elena. I can see them now.

Elena approaches cautiously. Harrington turns - his eyes are clear, more lucid than he's been in months.

ELENA
Who's coming through?

HARRINGTON
Echoes. Fragments. Look.

He points outside. At first, Elena sees nothing unusual. Then she notices: some people in the courtyard seem to FLICKER slightly, becoming momentarily transparent.

ELENA
(shocked)
What am I seeing?

HARRINGTON
The worlds are bleeding together. Has been happening slowly for years. That's why my mind wanders between them. But now... now it's accelerating.

He grabs her arm with surprising strength.

HARRINGTON
What did you do, Elena?

INT. ELENA'S LABORATORY - NIGHT

Elena has the disc connected to monitoring equipment. Data streams across multiple screens. A knock at the door.

DIRECTOR CASTILLO
(entering)
Dr. Reyes. Working late again?

ELENA
(covering the disc)
Director. Yes, just running some analyses.

CASTILLO
On your Turkish artifact? Any breakthroughs?

ELENA
(cautious)
Nothing conclusive yet.

Castillo circles the lab, studying the equipment.

CASTILLO
I've been getting some interesting reports. Power fluctuations. Equipment malfunctions. All centered around this building.

She turns to Elena.

CASTILLO
And specifically, around the times you're working in this lab.

Elena tries to appear calm.

ELENA
Old wiring in this building. I've complained about it before.

CASTILLO
Perhaps.

She reaches into her jacket and pulls out an old PHOTOGRAPH. It shows a dig site from the 1970s. Several researchers stand around a table containing artifacts. Among them is what appears to be ANOTHER BRONZE DISC, similar to Elena's.

CASTILLO
This was taken at a dig site in Peru, 1976. The artifacts were transported to our facility but reportedly "lost in transit."

Elena stares at the photo.

CASTILLO
My organization has been tracking these objects for generations, Dr. Reyes. We know what they can do.

ELENA
Your organization? I thought you meant the university.

CASTILLO
(smiling)
The university is just one branch of a much larger tree.

She sets down her card.

CASTILLO
When you're ready to discuss what's really happening, call me directly. Day or night.

After Castillo leaves, Elena's phone RINGS - an unknown number.

ELENA
Hello?

MALIK'S VOICE
Elena. Can you hear me?

ELENA
(shocked)
Malik? How are you calling me?

MALIK'S VOICE
No time to explain. Something's happening. The boundaries are weakening faster than I anticipated.

ELENA
I know. I'm seeing effects here too.

MALIK'S VOICE
It's not just your disc. Something else is causing this. Something bigger.

ELENA
What should I do?

MALIK'S VOICE
Don't trust anyone who's too interested in your work. And be ready. I think you're about to have visitors.

ELENA
Visitors? From your side?

MALIK'S VOICE
The barriers work both ways, Elena. If you can come here—

The call cuts off abruptly.

EXT. ELENA'S APARTMENT BUILDING - NIGHT

Elena approaches her building. She stops, noticing a strange SHIMMER in the air near the entrance.

The shimmer coalesces into a FIGURE - humanoid but not quite human, its edges blurry as if not fully materialized.

It turns toward Elena, revealing a face that's hauntingly beautiful yet alien.

LYSANDRA
(voice echoing slightly)
Dr. Elena Reyes. At last we meet in your realm.

Elena takes a step back.

ELENA
Who are you?

LYSANDRA
I am Lysandra. In ancient times, your people called me the goddess of wisdom.

She smiles, her form becoming more solid.

LYSANDRA
And I've been waiting a very long time to return.

FADE OUT.`
      }
    },
    finalEpisode: {
      detailedEpisode: "Complete and detailed script for the final episode including all character lines and stage directions."
    }
  });
  
  // Convert stages to a state variable
  const [stages, setStages] = useState<Stage[]>([
    {
      id: "basic-info",
      name: "Story Basic Info",
      description: "Set your story's title, genre, and basic details",
      status: StageStatus.CURRENT,
      component: BasicInfoStage,
    },
    {
      id: "outline",
      name: "Story Outline",
      description: "Review and refine your story's structure",
      status: StageStatus.LOCKED,
      component: OutlineStage,
    },
    {
      id: "characters",
      name: "Characters",
      description: "Develop your story's cast",
      status: StageStatus.LOCKED,
      component: CharactersStage,
    },
    {
      id: "arcs",
      name: "Story Arcs",
      description: "Structure your story into major arcs",
      status: StageStatus.LOCKED,
      component: ArcStage,
    },
    {
      id: "episodes",
      name: "Episodes",
      description: "Create episodes within your story arcs",
      status: StageStatus.LOCKED,
      component: EpisodeStage,
    },
    {
      id: "final-episode",
      name: "Final Episode",
      description: "Create the final episode of your story",
      status: StageStatus.LOCKED,
      component: FinalEpisodeStage,
    }
  ]);
  
  // Update the useEffect to use setStages to update the state
  useEffect(() => {
    setStages(prevStages => 
      prevStages.map((stage, index) => ({
        ...stage,
        status: index < currentStageIndex 
          ? StageStatus.COMPLETED 
          : index === currentStageIndex 
            ? StageStatus.CURRENT 
            : StageStatus.LOCKED
      }))
    );
  }, [currentStageIndex]);
  
  const handleStageSelect = (index: number) => {
    if (stages[index].status === StageStatus.LOCKED) {
      toast({
        title: "Stage Locked",
        description: "Complete the current stage to unlock this one",
        variant: "destructive",
      });
      return;
    }
    
    setCurrentStageIndex(index);
  };
  
  const handleNextStage = () => {
    if (currentStageIndex < stages.length - 1) {
      setCurrentStageIndex(prevIndex => prevIndex + 1);
      
      toast({
        title: "Stage Complete",
        description: `Moving to ${stages[currentStageIndex + 1].name}`,
      });
    } else {
      toast({
        title: "Story Creation Complete",
        description: "Your story has been successfully created!",
      });
    }
  };
  
  const updateStoryData = (data: any) => {
    setStoryData(prevData => {
      const currentStageId = stages[currentStageIndex].id;
      
      switch (currentStageId) {
        case "basic-info":
          return { ...prevData, basicInfo: { ...prevData.basicInfo, ...data } };
        case "outline":
          return { ...prevData, outline: { ...prevData.outline, ...data } };
        case "characters":
          return { ...prevData, characters: { ...prevData.characters, ...data } };
        case "arcs":
          return { ...prevData, arcs: { ...prevData.arcs, ...data } };
        case "episodes":
          return { ...prevData, episodes: { ...prevData.episodes, ...data } };
        case "final-episode":
          return { ...prevData, finalEpisode: { ...prevData.finalEpisode, ...data } };
        default:
          return prevData;
      }
    });
  };

  const CurrentStageComponent = stages[currentStageIndex].component;
  
  const generateOutline = async (basicInfo: StoryBasicInfo): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const outlineMarkdown = `# ${basicInfo.title || "Your Story"} - Story Outline

## Introduction
${basicInfo.description || "A compelling story awaits..."}

## Genre
${basicInfo.genres.join(", ")}

## Main Plot Points

1. **Inciting Incident**
   - The protagonist discovers a hidden truth that changes everything.

2. **Rising Action**
   - Obstacles increase as the protagonist goes deeper into the journey.
   - New allies are found, but enemies lurk in unexpected places.

3. **Midpoint Twist**
   - A major revelation changes the protagonist's understanding.

4. **Darkest Hour**
   - All seems lost as the protagonist faces their greatest challenge.

5. **Climax**
   - The final confrontation between the protagonist and antagonistic forces.

6. **Resolution**
   - How the story wraps up and what changes for the characters.

## Key Themes
- Identity and self-discovery
- The price of knowledge
- Courage in the face of adversity

## Additional Notes
${basicInfo.instructions || ""}`;

    setStoryData(prevData => ({
      ...prevData,
      outline: {
        ...prevData.outline,
        markdown: outlineMarkdown,
        question: "Would you like to focus on any particular theme for your story?"
      }
    }));
    
    return outlineMarkdown;
  };
  
  const getCurrentStageData = () => {
    switch (stages[currentStageIndex].id) {
      case "basic-info":
        return { basicInfo: storyData.basicInfo };
      case "outline":
        return { outline: storyData.outline };
      case "characters":
        return { 
          outline: storyData.outline,
          characters: storyData.characters
        };
      case "arcs":
        return { 
          outline: storyData.outline,
          title: storyData.basicInfo.title,
          arcs: storyData.arcs
        };
      case "episodes":
        return { 
          title: storyData.basicInfo.title,
          arcTitle: storyData.arcs.arcTitle || "Introduction Arc",
          arcOverview: storyData.arcs.arcInfo["Introduction Arc"],
          episodes: storyData.episodes
        };
      case "final-episode":
        return { 
          title: storyData.basicInfo.title,
          arcs: storyData.arcs,
          finalEpisode: storyData.finalEpisode,
          episodes: storyData.episodes
        };
      default:
        return storyData;
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-20">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              className="flex items-center mr-4" 
              onClick={() => navigate("/")}
            >
              <ChevronLeft className="h-5 w-5 mr-2" />
              Back to Dashboard
            </Button>
            
            <div className="hidden md:flex items-center">
              <BookOpen className="h-5 w-5 text-primary mr-2" />
              <h1 className="text-lg font-serif font-medium">Story Forge Studio</h1>
            </div>
          </div>
          
          <HoverCard>
            <HoverCardTrigger asChild>
              <div className="flex items-center space-x-2 cursor-pointer">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`} alt={user?.name} />
                  <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium hidden sm:inline-block">{user?.name}</span>
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-64">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`} alt={user?.name} />
                    <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">{user?.name}</h4>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                  </div>
                </div>
                <div className="flex justify-between">
                  <Button variant="outline" size="sm" className="w-full" onClick={() => navigate("/")}>
                    Dashboard
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full" onClick={() => navigate("/profile")}>
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Button>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div 
          className={cn(
            "bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex-shrink-0 overflow-y-auto transition-all duration-300",
            sidebarCollapsed ? "w-16" : "w-64"
          )}
        >
          <div className="p-4 border-b border-sidebar-border flex justify-between items-center">
            {!sidebarCollapsed && (
              <h2 className="font-serif text-lg font-medium text-sidebar-foreground/90">Story Creation</h2>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              className="ml-auto"
              onClick={() => setSidebarCollapsed(prev => !prev)}
            >
              {sidebarCollapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
            </Button>
          </div>
          
          <nav className="p-2">
            {stages.map((stage, index) => {
              let StatusIcon;
              switch (stage.status) {
                case StageStatus.COMPLETED:
                  StatusIcon = CheckCircle;
                  break;
                case StageStatus.CURRENT:
                  StatusIcon = CircleEllipsis;
                  break;
                default:
                  StatusIcon = Lock;
              }
              
              return (
                <button
                  key={stage.id}
                  title={stage.name}
                  className={cn(
                    "w-full text-left p-3 mb-1 rounded-md flex items-start transition-colors",
                    stage.status === StageStatus.CURRENT && "bg-sidebar-accent text-sidebar-accent-foreground",
                    stage.status === StageStatus.COMPLETED && "text-sidebar-foreground/90 hover:bg-sidebar-accent/50",
                    stage.status === StageStatus.LOCKED && "opacity-60 cursor-not-allowed",
                    sidebarCollapsed && "justify-center p-2"
                  )}
                  onClick={() => handleStageSelect(index)}
                  disabled={stage.status === StageStatus.LOCKED}
                >
                  <StatusIcon className={cn(
                    "h-5 w-5",
                    !sidebarCollapsed && "mr-3 mt-0.5",
                    stage.status === StageStatus.COMPLETED && "text-green-400",
                    stage.status === StageStatus.CURRENT && "text-sidebar-primary animate-pulse"
                  )} />
                  
                  {!sidebarCollapsed && (
                    <div>
                      <div className="font-medium leading-none mb-1">{stage.name}</div>
                      <div className="text-xs opacity-80">{stage.description}</div>
                    </div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          <CurrentStageComponent 
            storyData={getCurrentStageData()} 
            updateStoryData={updateStoryData}
            onNextStage={handleNextStage}
            generateOutline={generateOutline}
          />
        </div>
      </div>
    </div>
  );
};

export default StoryCreation;
