import type { TvShowCriterionKey } from "./tvShowCriteria";

export type TvShowProfileConfig = {
    label: string;
    criteriaWeights: Record<TvShowCriterionKey, number>;
    criteriaDescription?: Partial<
        Record<TvShowCriterionKey, string>
    >;
};

export const tvShowProfileConfigs = {
    general: {
        label: "General",

        criteriaWeights: {
            writingStorytelling: 20,
            charactersDevelopment: 15,
            performances: 15,
            direction: 10,
            visualPresentation: 10,
            episodeStructurePacing: 10,
            soundMusic: 10,
            consistencyPayoff: 10,
        },

        criteriaDescription: {},
    },

    drama: {
        label: "Drama",

        criteriaWeights: {
            writingStorytelling: 20,
            charactersDevelopment: 20,
            performances: 20,
            direction: 10,
            visualPresentation: 5,
            episodeStructurePacing: 5,
            soundMusic: 5,
            consistencyPayoff: 15,
        },

        criteriaDescription: {
            writingStorytelling:
                "Evaluates the depth of the writing, emotional complexity, dialogue, and how effectively the story develops its central conflicts and themes.",

            charactersDevelopment:
                "Evaluates psychological depth, motivations, relationships, and whether character changes feel convincing and earned over time.",

            performances:
                "Evaluates emotional authenticity, subtlety, range, and the cast's ability to bring complex characters and relationships to life.",

            consistencyPayoff:
                "Evaluates the consistency of the drama, the development of long-term conflicts, and whether emotional arcs and major revelations feel earned.",
        },
    },

    comedy: {
        label: "Comedy",

        criteriaWeights: {
            writingStorytelling: 20,
            charactersDevelopment: 15,
            performances: 20,
            direction: 10,
            visualPresentation: 5,
            episodeStructurePacing: 15,
            soundMusic: 5,
            consistencyPayoff: 10,
        },

        criteriaDescription: {
            writingStorytelling:
                "Evaluates comedic writing, dialogue, setups, payoffs, recurring jokes, and how effectively humour is integrated into the story.",

            performances:
                "Evaluates comedic timing, delivery, expression, chemistry, and how effectively the cast brings the humour to life.",

            episodeStructurePacing:
                "Evaluates the rhythm of jokes, the timing of pauses and punchlines, and how effectively episodes balance humour with story development.",

            consistencyPayoff:
                "Evaluates the consistency of the humour, the effectiveness of recurring jokes and storylines, and whether character and narrative developments pay off.",
        },
    },

    crimeMystery: {
        label: "Crime / Mystery",

        criteriaWeights: {
            writingStorytelling: 20,
            charactersDevelopment: 15,
            performances: 10,
            direction: 10,
            visualPresentation: 5,
            episodeStructurePacing: 15,
            soundMusic: 10,
            consistencyPayoff: 15,
        },

        criteriaDescription: {
            writingStorytelling:
                "Evaluates the construction of mysteries and investigations, the use of clues, the development of suspects, and the coherence of revelations.",

            episodeStructurePacing:
                "Evaluates suspense, narrative momentum, the placement of clues and revelations, and how effectively episodes maintain curiosity without unnecessary delays.",

            consistencyPayoff:
                "Evaluates continuity of evidence and investigations, the fairness of reveals, the resolution of mysteries, and whether long-term storylines pay off convincingly.",
        },
    },

    sciFiFantasy: {
        label: "Sci-Fi / Fantasy",

        criteriaWeights: {
            writingStorytelling: 15,
            charactersDevelopment: 15,
            performances: 10,
            direction: 10,
            visualPresentation: 20,
            episodeStructurePacing: 10,
            soundMusic: 10,
            consistencyPayoff: 10,
        },

        criteriaDescription: {
            writingStorytelling:
                "Evaluates the use of speculative ideas, fictional concepts, world-specific conflicts, and how effectively the story develops its imaginative premise.",

            visualPresentation:
                "Evaluates the visual identity of the world, production design, effects, environments, creatures, technology, and the consistency of their presentation.",

            consistencyPayoff:
                "Evaluates the consistency of the world's rules and lore, the development of speculative ideas, and whether major storylines and world-building elements pay off.",
        },
    },
} as const satisfies Record<string, TvShowProfileConfig>;

export type TvShowReviewProfileKey =
    keyof typeof tvShowProfileConfigs;