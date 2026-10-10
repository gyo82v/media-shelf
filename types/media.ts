import { Timestamp } from "firebase/firestore";

export type ReviewProfile =
    | "Rpg"
    | "Action"
    | "Strategy"
    | "Horror"
    | "Survival"
    | "Mmorpg"
    | "RogueLike"
    | "Sports"
    | "Platformer"
    | "Adventure";

export type GameProduction = "indie" | "studio";

export type ReviewCriterion =
    | "gameplay"
    | "storyline"
    | "ending"
    | "characters"
    | "audio"
    | "performance"
    | "replayability"
    | "longevity"
    | "graphics"
    | "artStyle"
    | "worldDesign"
    | "ai"
    | "atmosphere"
    | "progression"
    | "controls"
    | "difficultyBalance"
    | "online";

export type ReviewModifier =
    | "monetization"
    | "bugs"
    | "grind"
    | "priceValue"
    | "originality";

export type ReviewCriteria =
    Partial<Record<ReviewCriterion, number>>;

export type ReviewModifiers =
    Partial<Record<ReviewModifier, number>>;

export interface ReviewScore {
    criteria: ReviewCriteria;
    modifiers: ReviewModifiers;
    baseScore: number | null;
    totalScore: number | null;
}

export interface ReviewProfileConfig {
    criteriaWeights: Partial<Record<ReviewCriterion, number>>;
}

export interface MediaItemType {
    id: string
    name: string
    type: "movie" | "book" | "game" | "tvShow"
    status: "completed" | "inProgress" | "wishList"

    createdAt: Timestamp
    updatedAt: Timestamp
    startedAt: Timestamp | null
    finishedAt: Timestamp | null

    description?: string
    genre: string
    reviewProfile: ReviewProfile | ""
    production?: GameProduction
    image: string
    country?: string
    year?: number
    slug: string

    starRating: number | null
    notes?: string

    reviewScore?: ReviewScore

    seasons?: {
        number: number
        starRating: number | null
        reviewScore?: ReviewScore
    }[]
}
