
import { calculateReviewScore } from "@/lib/scoring";
import type {
    ReviewCriteria,
    ReviewModifiers,
} from "@/types";

export default function ReviewScoreTest() {

    const criteria: ReviewCriteria = {
        gameplay: 0,
        storyline: 0,
        ending: 0,
        characters: 0,
        audio: 0,
        performance:0,
        replayability: 0,
        longevity: 0,
        graphics: 0,
        artStyle: 0,
        worldDesign: 0,
        ai: 0,
        atmosphere: 0,
        progression: 0,
        controls: 0,
        difficultyBalance: 0,
    };

    const modifiers: ReviewModifiers = {
        monetization: 5,
        bugs: 5,
        grind: 5,
        priceValue: 0,
        originality: 0,
    };

    const result = calculateReviewScore(
        "Rpg",
        criteria,
        modifiers
    );

    console.log("results:", result);

    return (
        <div>
            <p>Base Score: {result?.baseScore ?? "Incomplete"}</p>
            <p>Final Score: {result?.totalScore ?? "Incomplete"}</p>
        </div>
    );
}
