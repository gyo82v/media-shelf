
import type {
    ReviewCriterion,
    ReviewModifier,
} from "@/types";

type ReviewCriterionInfo = {
    label: string;
    description: string;
};

type ReviewModifierInfo = {
    label: string;
    description: string;
    direction: "add" | "deduct";
    minLabel: string;
    middleLabel: string;
    maxLabel: string;
};

export const reviewCriteria: Record<
    ReviewCriterion,
    ReviewCriterionInfo
> = {
    gameplay: {
        label: "Gameplay",
        description:
            "How enjoyable and well-designed are the core mechanics and moment-to-moment experience?",
    },
    storyline: {
        label: "Storyline",
        description:
            "How well-written, engaging and coherent is the narrative, including its pacing and storytelling?",
    },
    ending: {
        label: "Ending",
        description:
            "How satisfying, effective and appropriate is the conclusion to the experience?",
    },
    characters: {
        label: "Characters",
        description:
            "How well-developed, believable and memorable are the characters?",
    },
    audio: {
        label: "Audio",
        description:
            "How effective are the music, sound effects, voice acting and overall sound presentation?",
    },
    performance: {
        label: "Performance",
        description:
            "How stable and technically responsive is the game, including frame rate, loading and stuttering?",
    },
    replayability: {
        label: "Replayability",
        description:
            "How compelling is the game to replay or revisit through different approaches, challenges or outcomes?",
    },
    longevity: {
        label: "Longevity",
        description:
            "How much meaningful content does the game offer, considering its length and variety of activities?",
    },
    graphics: {
        label: "Graphics",
        description:
            "How strong is the technical visual presentation, including detail, lighting, effects and rendering quality?",
    },
    artStyle: {
        label: "Art Style",
        description:
            "How distinctive, cohesive and effective is the game's visual identity?",
    },
    worldDesign: {
        label: "World Design",
        description:
            "How well-designed are the environments, levels, maps and spaces in which the game takes place?",
    },
    ai: {
        label: "AI",
        description:
            "How intelligently and convincingly do computer-controlled characters or opponents behave?",
    },
    atmosphere: {
        label: "Atmosphere",
        description:
            "How effectively does the game create its intended mood, tension, immersion or emotional feeling?",
    },
    progression: {
        label: "Progression",
        description:
            "How satisfying and meaningful is the player's development through upgrades, skills, unlocks or new capabilities?",
    },
    controls: {
        label: "Controls",
        description:
            "How responsive, precise and comfortable is it to perform the intended actions?",
    },
    difficultyBalance: {
        label: "Difficulty & Balance",
        description:
            "How fair and well-paced is the challenge, and how balanced are the available options and strategies?",
    },
    online: {
        label: "Online & Social Experience",
        description:
            "How well does the game support online play, multiplayer activities, matchmaking and social interaction where applicable?",
    },
    strategicDepth: {
        label: "Strategic Depth",
        description:
            "How meaningful are the decisions, trade-offs, planning and alternative strategies available to the player?",
    },
    resourceManagement: {
        label: "Resource Management",
        description:
            "How well-designed and engaging are the systems for acquiring, allocating, storing and using resources?",
    },
    runVariety: {
        label: "Run & Build Variety",
        description:
            "How many meaningfully different and viable runs, builds, combinations or approaches does the game support?",
    },
    sportMechanics: {
        label: "Sport Mechanics",
        description:
            "How well does the game implement the defining actions, rules and physical behaviours of its sport?",
    },
    rosterVariety: {
        label: "Roster Variety",
        description:
            "How varied and meaningfully differentiated are the available characters, athletes, teams or competitors?",
    },
    systemsDepth: {
        label: "Systems Depth",
        description:
            "How detailed, coherent and interconnected are the game's systems, and how meaningfully do they respond to player actions?",
    },
    colonyManagement: {
        label: "Colony Management",
        description:
            "How well does the game handle population needs, jobs, housing, morale and settlement development?",
    },
    shootingMechanics: {
        label: "Shooting Mechanics",
        description:
            "How satisfying and well-designed are aiming, weapon handling, recoil, hit feedback and shooting mechanics?",
    },
    drivingMechanics: {
        label: "Driving Mechanics",
        description:
            "How satisfying and consistent are vehicle handling, acceleration, braking, traction and driving physics?",
    },
    trackDesign: {
        label: "Track Design",
        description:
            "How well-designed are the routes, corners, racing lines, track flow and opportunities for competition?",
    },
    puzzleDesign: {
        label: "Puzzle Design",
        description:
            "How logical, varied, clearly presented and satisfying are the puzzles and their solutions?",
    },
    fightingMechanics: {
        label: "Fighting Mechanics",
        description:
            "How well-designed and satisfying are the combat system, moves, combos, blocking, counters and hit detection?",
    },
    combatMechanics: {
        label: "Combat Mechanics",
        description:
            "How satisfying and well-integrated are the combat abilities, encounters, enemy interactions and combat systems?",
    },
    lootItemization: {
        label: "Loot & Itemization",
        description:
            "How interesting, varied and meaningful are equipment choices, item effects, loot drops and rewards?",
    },
    buildVariety: {
        label: "Build Variety",
        description:
            "How many distinct, viable character builds and playstyles can the player create?",
    },
    managementSystems: {
        label: "Management Systems",
        description:
            "How useful, detailed and well-designed are the systems available to manage people, teams, businesses or operations?",
    },
    interfaceUsability: {
        label: "Interface & Usability",
        description:
            "How clearly does the interface present information, support navigation and make complex actions easy to manage?",
    },
};

export const reviewModifiers: Record<
    ReviewModifier,
    ReviewModifierInfo
> = {
    monetization: {
        label: "Monetization",
        description:
            "How intrusive or unfair are the game's monetization practices, including microtransactions, pay-to-win advantages and pressure to spend?",
        direction: "deduct",
        minLabel: "No issue",
        middleLabel: "Moderate",
        maxLabel: "Severe",
    },
    bugs: {
        label: "Bugs",
        description:
            "How frequent or serious are bugs, glitches, crashes, broken quests and other defects?",
        direction: "deduct",
        minLabel: "No issues",
        middleLabel: "Some issues",
        maxLabel: "Severe",
    },
    grind: {
        label: "Grind",
        description:
            "How much does progression rely on repetitive, tedious or unnecessarily padded activities?",
        direction: "deduct",
        minLabel: "No grind",
        middleLabel: "Noticeable",
        maxLabel: "Excessive",
    },
    priceValue: {
        label: "Price Value",
        description:
            "How worthwhile is the game relative to the price you actually paid, considering its quality and meaningful content?",
        direction: "add",
        minLabel: "No bonus",
        middleLabel: "Good value",
        maxLabel: "Exceptional",
    },
    originality: {
        label: "Originality",
        description:
            "How much does the game bring fresh ideas, distinctive mechanics or creative approaches compared with similar games?",
        direction: "add",
        minLabel: "No bonus",
        middleLabel: "Distinctive",
        maxLabel: "Highly original",
    },
};
