export const bookCriteria = {
    writingStyle: {
        label: "Writing Style & Prose",
        description:
            "Evaluates the clarity, readability, vocabulary, prose quality, narrative voice, and effectiveness of the author's writing.",
    },

    storyStructure: {
        label: "Story & Structure",
        description:
            "Evaluates how well the book is organized and developed, including plot construction in fiction or the structure and progression of a narrative or argument in nonfiction.",
    },

    charactersPeople: {
        label: "Characters & People",
        description:
            "Evaluates the depth, complexity, believability, and development of fictional characters or real people portrayed in the book.",
    },

    worldContext: {
        label: "World & Context",
        description:
            "Evaluates the richness and consistency of a fictional setting or the clarity, relevance, and depth of the real-world context.",
    },

    themesIdeas: {
        label: "Themes & Ideas",
        description:
            "Evaluates how thoughtfully and effectively the book explores its central themes, questions, concepts, or arguments.",
    },

    pacingFlow: {
        label: "Pacing & Flow",
        description:
            "Evaluates the rhythm and flow of the book, how effectively it maintains engagement, and whether its length and chapter progression serve the material.",
    },

    originalityInsight: {
        label: "Originality & Insight",
        description:
            "Evaluates the freshness of the book's ideas, perspective, approach, world, or treatment of familiar topics.",
    },

    impactResonance: {
        label: "Impact & Resonance",
        description:
            "Evaluates the book's emotional or intellectual effect, how engaging or meaningful it feels, and the impression it leaves afterward.",
    },
} as const;

export type BookCriterionKey = keyof typeof bookCriteria;