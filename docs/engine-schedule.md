Engine shedule:


Step 1 — Finalize the review data model:

review
├── profile: Rpg
├── production: Indie | Studio
├── criteria
│   ├── gameplay: 8
│   ├── storyline: 9
│   ├── characters: 8
│   └── ...
├── modifiers
│   ├── monetization: 1
│   ├── bugs: 0
│   ├── grind: 2
│   ├── priceValue: 4
│   └── originality: 5
├── baseScore: 84.7
└── totalScore: 90.7

Step 2 — Create the RPG configuration

Gameplay             20
Storyline            13
Ending                3
Characters           10
Audio                 5
Performance           3
Replayability         3
Longevity             3
Graphics              4
Art Style             4
World Design          9
AI                    2
Atmosphere            5
Progression           9
Controls              3
Difficulty & Balance  4

Step 3 — Build the scoring engine

0–10 grades
      ↓
weighted criteria
      ↓
base score 0–100
      ↓
modifiers
      ↓
final score

Step 4 — Decide the modifier semantics

for example:

Monetization 0–5 → -0 to -5
Bugs          0–5 → -0 to -5
Grind         0–5 → -0 to -5
Price Value   0–5 → +0 to +5
Originality   0–5 → +0 to +5

Step 5 — Build the review form UI

Step 6 — Show the score while reviewing

Step 7 — Save the completed review to Firebase

step 8 — Display the review on the media detail page

Step 9 — Add production adjustments, indi and studio

Step 10 — Stress-test RPG

Step 11 — Add the other profiles as configurations

Step 12 — Add profile-specific production adjustments

Step 13 — Multiple profiles later