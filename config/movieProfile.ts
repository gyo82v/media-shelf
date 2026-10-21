import type { MovieCriterionKey } from "./movieReviewCriteria"

type MovieProfileConfig = {
    label: string
    description: string
    criteriaWeights: Record<MovieCriterionKey, number>
    criteriaDescriptions?: Partial<Record<MovieCriterionKey, string>>
}

export const movieProfileConfigs = {
    general: {
        label: "General",
        description:
            "A balanced review profile suitable for most movies.",

        criteriaWeights: {
            storyScreenplay: 20,
            characters: 15,
            performances: 15,
            direction: 10,
            visualPresentation: 10,
            editingPacing: 10,
            soundMusic: 10,
            atmosphereImpact: 10,
        },
    },

    action: {
        label: "Action",
        description:
            "Emphasizes directing, visual spectacle, editing, and sound.",

        criteriaWeights: {
            storyScreenplay: 10,
            characters: 10,
            performances: 10,
            direction: 15,
            visualPresentation: 15,
            editingPacing: 15,
            soundMusic: 15,
            atmosphereImpact: 10,
        },

        criteriaDescriptions: {
            direction:
                "Evaluates how effectively action sequences are directed, choreographed, and integrated into the movie.",

            visualPresentation:
                "Evaluates the visual execution of action sequences, including cinematography, choreography on screen, visual effects, and clarity of movement.",

            editingPacing:
                "Evaluates the rhythm, timing, and clarity of action sequences, as well as the movie's overall momentum.",

            soundMusic:
                "Evaluates the impact of sound effects, impacts, explosions, and music throughout the action sequences.",
        },
    },

    drama: {
        label: "Drama",
        description:
            "Emphasizes storytelling, character development, performances, and emotional impact.",

        criteriaWeights: {
            storyScreenplay: 20,
            characters: 20,
            performances: 20,
            direction: 10,
            visualPresentation: 5,
            editingPacing: 5,
            soundMusic: 5,
            atmosphereImpact: 15,
        },

        criteriaDescriptions: {
            storyScreenplay:
                "Evaluates the depth of the narrative, dialogue, themes, and how effectively the screenplay explores its subject matter.",

            characters:
                "Evaluates the complexity of the characters, their motivations, relationships, personal struggles, and development.",

            performances:
                "Evaluates the emotional authenticity, subtlety, and depth of the actors' portrayals.",

            atmosphereImpact:
                "Evaluates the emotional resonance of the movie and how effectively it connects the viewer with its themes and characters.",
        },
    },

    comedy: {
        label: "Comedy",
        description:
            "Emphasizes comedic writing, performances, timing, and entertainment value.",

        criteriaWeights: {
            storyScreenplay: 20,
            characters: 15,
            performances: 20,
            direction: 10,
            visualPresentation: 5,
            editingPacing: 10,
            soundMusic: 5,
            atmosphereImpact: 15,
        },

        criteriaDescriptions: {
            storyScreenplay:
                "Evaluates the quality of the comedic writing, including jokes, dialogue, situations, and how effectively the story supports the humor.",

            performances:
                "Evaluates comedic timing, delivery, physical comedy, chemistry, and how effectively the cast brings the humor to life.",

            editingPacing:
                "Evaluates comedic timing, rhythm, pauses, and how effectively scenes deliver their intended punchlines.",

            atmosphereImpact:
                "Evaluates how successfully the movie creates an entertaining experience and achieves its intended comedic tone.",
        },
    },

    horror: {
        label: "Horror",
        description:
            "Emphasizes atmosphere, tension, sound, and the effectiveness of frightening scenes.",

        criteriaWeights: {
            storyScreenplay: 10,
            characters: 10,
            performances: 10,
            direction: 15,
            visualPresentation: 10,
            editingPacing: 10,
            soundMusic: 15,
            atmosphereImpact: 20,
        },

        criteriaDescriptions: {
            direction:
                "Evaluates how effectively scenes are directed to create suspense, dread, uncertainty, or fear.",

            editingPacing:
                "Evaluates how the movie controls tension through timing, pauses, reveals, and the rhythm of frightening scenes.",

            soundMusic:
                "Evaluates how effectively sound design, silence, audio cues, and music create tension, dread, and unease.",

            atmosphereImpact:
                "Evaluates how effectively the movie creates its intended sense of fear, dread, suspense, or psychological unease.",
        },
    },
} satisfies Record<string, MovieProfileConfig>


export type MovieReviewProfileKey = keyof typeof movieProfileConfigs