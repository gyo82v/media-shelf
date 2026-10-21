export const movieReviewCriteria = {
    storyScreenplay: {
        label: "Story & Screenplay",
        description:
            "Evaluates the plot, dialogue, narrative structure, coherence, themes, and overall quality of the writing.",
    },

    characters: {
        label: "Characters",
        description:
            "Evaluates the depth, motivations, believability, relationships, and development of the characters.",
    },

    performances: {
        label: "Performances",
        description:
            "Evaluates the quality, range, and authenticity of the cast's performances, including voice acting in animated films.",
    },

    direction: {
        label: "Direction",
        description:
            "Evaluates how effectively the director brings the creative vision to life through scene execution, tone, and the overall cinematic experience.",
    },

    visualPresentation: {
        label: "Visual Presentation",
        description:
            "Evaluates cinematography, composition, lighting, production design, visual effects, animation, and the overall visual style.",
    },

    editingPacing: {
        label: "Editing & Pacing",
        description:
            "Evaluates how scenes are assembled, timed, and connected, including the movie's rhythm, flow, and use of its runtime.",
    },

    soundMusic: {
        label: "Sound & Music",
        description:
            "Evaluates dialogue clarity, sound effects, sound design, musical score, songs, and how effectively the audio supports the film.",
    },

    atmosphereImpact: {
        label: "Atmosphere & Impact",
        description:
            "Evaluates how effectively the movie creates its intended mood, immerses the viewer, and leaves an emotional, intellectual, or lasting impression.",
    },
} as const

export type MovieCriterionKey = keyof typeof movieReviewCriteria