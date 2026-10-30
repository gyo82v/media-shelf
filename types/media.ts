import { Timestamp } from "firebase/firestore";
import type { MovieReviewProfileKey } from "@/config/movieProfile";
import type { BookReviewProfileKey } from "@/config/bookProfile";
import type {TvShowReviewProfileKey} from "@/config/tvShowProfile";

export type MediaReviewCriteria =
    Partial<Record<string, number>>;

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
    | "Adventure"
    | "Colony"
    | "Shooter"
    | "Racing"
    | "Simulation"
    | "Puzzle"
    | "Fighting"
    | "ActionRpg"
    | "Management"

export type MediaReviewProfile =
    | ReviewProfile
    | MovieReviewProfileKey
    | BookReviewProfileKey
    | TvShowReviewProfileKey

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
    | "online"
    | "strategicDepth"
    | "resourceManagement"
    | "runVariety"
    | "sportMechanics"
    | "rosterVariety"
    | "systemsDepth"
    | "colonyManagement"
    | "shootingMechanics"
    | "drivingMechanics"
    | "trackDesign"
    | "puzzleDesign"
    | "fightingMechanics"
    | "combatMechanics"
    | "lootItemization"
    | "buildVariety"
    | "managementSystems"
    | "interfaceUsability"

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
    criteria: MediaReviewCriteria;
    modifiers: ReviewModifiers;
    baseScore: number | null;
    totalScore: number | null;
}

export interface ReviewProfileConfig {
    criteriaWeights: Partial<Record<ReviewCriterion, number>>;
    criteriaDescriptions?: Partial<Record<ReviewCriterion, string>>;
}

export interface ReviewCalculation {
    criterionPoints: Partial<Record<ReviewCriterion, number>>;
    modifierPoints: Record<ReviewModifier, number>;
    modifierAdjustment: number;
    baseScore: number;
    totalScore: number;
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
    reviewProfile: MediaReviewProfile | ""
    production?: GameProduction
    image: string
    country?: string
    year?: number
    slug: string

    starRating: number | null
    notes?: string

    reviewScore?: ReviewScore

    seriesStatus?: TvShowSeriesStatus;

    seasons?: {
        number: number
        starRating: number | null
        reviewScore?: ReviewScore
    }[]
}

export type TvShowSeriesStatus = "ongoing" | "ended";

export type TvShowSeason = {
    id: string;
    number: number;
    episodeCount: number;
    starRating: number | null;
    reviewScore?: ReviewScore;
};

export type TvShowEpisode = {
    id: string;
    number: number;
    starRating: number | null;
};

export type DashboardStats = {
    total: number,
    inProgress: {
        total: number,
        movies: number,
        tvShows: number,
        games: number,
        books: number
    },
    wishList: {
        total: number,
        movies: number,
        tvShows: number,
        games: number,
        books: number
    },
    completed: {
        total: number,
        movies: number,
        tvShows: number,
        games: number,
        books: number
    }
}
