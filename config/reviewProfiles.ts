import type {ReviewProfile, ReviewProfileConfig} from "@/types";

export const reviewProfileConfigs: Partial<Record<ReviewProfile, ReviewProfileConfig>> = {
    Rpg: {
        criteriaWeights: {
            gameplay: 20,
            storyline: 13,
            ending: 3,
            characters: 10,
            audio: 5,
            performance: 3,
            replayability: 3,
            longevity: 3,
            graphics: 4,
            artStyle: 4,
            worldDesign: 9,
            ai: 2,
            atmosphere: 5,
            progression: 9,
            controls: 3,
            difficultyBalance: 4,
        },
    },
};