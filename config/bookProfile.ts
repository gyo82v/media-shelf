import type { BookCriterionKey } from "./bookCriteria";

export type BookProfileConfig = {
    label: string;
    criteriaWeights: Record<BookCriterionKey, number>;
    criteriaDescription?: Partial<
        Record<BookCriterionKey, string>
    >;
};

export const bookProfileConfigs = {
    general: {
        label: "General",

        criteriaWeights: {
            writingStyle: 15,
            storyStructure: 20,
            charactersPeople: 15,
            worldContext: 10,
            themesIdeas: 10,
            pacingFlow: 10,
            originalityInsight: 10,
            impactResonance: 10,
        },

        criteriaDescription: {},
    },

    fantasy: {
        label: "Fantasy",

        criteriaWeights: {
            writingStyle: 10,
            storyStructure: 15,
            charactersPeople: 15,
            worldContext: 20,
            themesIdeas: 10,
            pacingFlow: 10,
            originalityInsight: 10,
            impactResonance: 10,
        },

        criteriaDescription: {
            storyStructure:
                "Evaluates the strength and coherence of the plot, how effectively the central conflicts develop, and how well the story uses its imaginative premise.",

            worldContext:
                "Evaluates the richness, internal consistency, lore, cultures, settings, and imaginative elements of the fantasy world.",

            originalityInsight:
                "Evaluates the inventiveness of the world, magic systems, creatures, concepts, and the freshness of the author's approach to familiar fantasy ideas.",
        },
    },

    scienceFiction: {
        label: "Sci-Fi",

        criteriaWeights: {
            writingStyle: 10,
            storyStructure: 15,
            charactersPeople: 10,
            worldContext: 20,
            themesIdeas: 15,
            pacingFlow: 10,
            originalityInsight: 10,
            impactResonance: 10,
        },

        criteriaDescription: {
            worldContext:
                "Evaluates the coherence and depth of the speculative setting, including its science, technology, societies, and the consequences of its central premise.",

            themesIdeas:
                "Evaluates how effectively the book explores scientific, ethical, philosophical, or social ideas through its speculative concepts.",

            originalityInsight:
                "Evaluates the freshness of the central premise, speculative concepts, and the author's approach to established science-fiction ideas.",
        },
    },

    mysteryThriller: {
        label: "Mystery / Thriller",

        criteriaWeights: {
            writingStyle: 10,
            storyStructure: 25,
            charactersPeople: 10,
            worldContext: 5,
            themesIdeas: 5,
            pacingFlow: 20,
            originalityInsight: 10,
            impactResonance: 15,
        },

        criteriaDescription: {
            storyStructure:
                "Evaluates the construction of the mystery or central conflict, the placement of clues, the fairness and effectiveness of reveals, and the coherence of the resolution.",

            pacingFlow:
                "Evaluates suspense, momentum, chapter endings, the timing of revelations, and how effectively the book maintains the reader's curiosity.",

            originalityInsight:
                "Evaluates how fresh the premise, investigation, twists, and resolution feel compared with familiar mystery and thriller conventions.",
        },
    },

    romance: {
        label: "Romance",

        criteriaWeights: {
            writingStyle: 10,
            storyStructure: 15,
            charactersPeople: 25,
            worldContext: 5,
            themesIdeas: 10,
            pacingFlow: 10,
            originalityInsight: 10,
            impactResonance: 15,
        },

        criteriaDescription: {
            storyStructure:
                "Evaluates the development of the relationship, the believability of its obstacles, and how satisfying and well-earned its progression and resolution feel.",

            charactersPeople:
                "Evaluates the chemistry between characters, their emotional development, motivations, relationship dynamics, and the believability of their connection.",

            impactResonance:
                "Evaluates the emotional investment the relationship creates and how satisfying, moving, or memorable its outcome feels.",
        },
    },

    nonfiction: {
        label: "Nonfiction",

        criteriaWeights: {
            writingStyle: 15,
            storyStructure: 20,
            charactersPeople: 0,
            worldContext: 10,
            themesIdeas: 25,
            pacingFlow: 10,
            originalityInsight: 10,
            impactResonance: 10,
        },

        criteriaDescription: {
            writingStyle:
                "Evaluates how clearly, accurately, and engagingly the author communicates information, explains complex concepts, and presents their ideas.",

            storyStructure:
                "Evaluates the organization of the material, the logical progression of the argument or narrative, and how effectively the chapters build on one another.",

            worldContext:
                "Evaluates the quality and relevance of the historical, cultural, scientific, or real-world context that supports the book's subject.",

            themesIdeas:
                "Evaluates the depth, clarity, reasoning, and development of the book's main ideas, arguments, evidence, and conclusions.",

            originalityInsight:
                "Evaluates whether the book offers a distinctive perspective, meaningful new insights, or a particularly effective interpretation of its subject.",

            impactResonance:
                "Evaluates how much the book informs, challenges, changes, or deepens the reader's understanding of its subject.",
        },
    },
} as const satisfies Record<string, BookProfileConfig>;

export type BookReviewProfileKey =
    keyof typeof bookProfileConfigs;