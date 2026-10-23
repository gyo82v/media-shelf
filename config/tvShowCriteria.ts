export const tvShowCriteria = {
    writingStorytelling: {
        label: "Writing & Storytelling",
        description:
            "Evaluates the quality of the writing, dialogue, plotlines, narrative structure, and how effectively episodic stories and longer story arcs are developed.",
    },

    charactersDevelopment: {
        label: "Characters & Development",
        description:
            "Evaluates character depth, motivations, relationships, consistency, and how convincingly characters develop throughout the story.",
    },

    performances: {
        label: "Performances",
        description:
            "Evaluates the quality, range, and authenticity of the cast's performances, including acting, voice acting, and ensemble chemistry.",
    },

    direction: {
        label: "Direction",
        description:
            "Evaluates the creative vision and execution of scenes, the handling of performances, tone, and the overall visual storytelling.",
    },

    visualPresentation: {
        label: "Visual Presentation",
        description:
            "Evaluates cinematography, lighting, composition, production design, visual effects, animation where applicable, and the consistency of the visual style.",
    },

    episodeStructurePacing: {
        label: "Episode Structure & Pacing",
        description:
            "Evaluates episode structure, narrative rhythm, transitions, momentum, and how effectively the story balances individual episodes with longer arcs.",
    },

    soundMusic: {
        label: "Sound & Music",
        description:
            "Evaluates dialogue clarity, sound design, sound effects, musical score, and how effectively audio supports the scenes and overall experience.",
    },

    consistencyPayoff: {
        label: "Consistency & Payoff",
        description:
            "Evaluates continuity, consistency in quality, follow-through on storylines, and how effectively character arcs and narrative setups pay off within the scope being reviewed.",
    },
} as const;

export type TvShowCriterionKey = keyof typeof tvShowCriteria;