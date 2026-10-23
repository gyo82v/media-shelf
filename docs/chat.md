here is an updated recap of the review system:

- reviewProfiles: "Rpg", "Action", "Strategy", "Horror", "Survival", "Mmorpg", "RogueLike",
                  "Sports", "Platformer", "Adventure"
- production: "Indie", "Studio";

criteria: points: 0/100
- gameplay; 0/10;
- StoryLine; 0/10;
- Ending; 0/10;
- Characters; 0/10;
- Audio; 0/10;
- Performance; 0/10;
- Replaybility; 0/10;
- longevity; 0/10;
- Graphic; 0/10;
- Art style; 0/10;
- World design; 0/10;
- Ai; 0/10 (in particular enemy ai for strategy games)
- Athmospere: 0/10;
- Prograssion; 0/10;
- Control; 0/10;
- Difficulty balance; 0/10
- Online; 0/10;

modifiers:
- Monetization: 0/5; deduct;
- bugs: 0/5; deduct;
- grind: 0/5; deduct;
- price value: 0/5; add;
- originality: 0/5: add;

questions:
- what do you think about the updated review system ?
- should i add a "open world" reviewProfile ?
- should we immediately include the production element ? and then base the review 
  criteria on both reviewProfile and production ?
- for later: some games have multile genre, should we add later on the possibility
  to have multiple review profile per game ?
- any other modifires or criteria worth adding ?



MEDIA ITEM
│
├── reviewProfile
│
├── production
│
├── normal criteria
│   ├── Gameplay
│   ├── StoryLine
│   ├── Ending
│   ├── Characters
│   ├── Audio
│   ├── Performance
│   ├── Replayability
│   ├── Longevity
│   ├── Graphic
│   ├── Art Style
│   ├── World Design
│   ├── AI
│   ├── Atmosphere
│   ├── Progression
│   ├── Controls
│   └── Difficulty / Balance
│
├── modifiers
│   ├── Monetization        -
│   ├── Bugs                -
│   ├── Grind               -
│   ├── Price Value         +
│   └── Originality         +
│
└── finalScore



final version 1 structure:

- reviewProfiles: "Rpg", "Action", "Strategy", "Horror", "Survival", "Mmorpg", "RogueLike",
                  "Sports", "Platformer", "Adventure"
- production: "Indie", "Studio";

criteria: points: 0/100
- Gameplay; 0/10;
- Storyline; 0/10;
- Ending; 0/10;
- Characters; 0/10;
- Audio; 0/10;
- Performance; 0/10;
- Replayability; 0/10;
- Longevity; 0/10;
- Graphics; 0/10;
- Art style; 0/10;
- World design; 0/10;
- AI; 0/10;
- Atmosphere: 0/10;
- Prograssion; 0/10;
- Control; 0/10;
- Difficulty balance; 0/10
- Online; 0/10;

modifiers:
- Monetization: 0/5; deduct;
- bugs: 0/5; deduct;
- grind: 0/5; deduct;
- price value: 0/5; add;
- originality: 0/5: add;


do you think we can proceed and try one  review profile for example Rpg?
which criteria whould you add and how much should each criteria be worth ?

- possibly later, about indie and studio i would keep it very simple.
  simply if it is an indie game i will get rid of the Graphics criteria or 
  make it worth very little and make the art style more important;
  and maybe modify the performace to be less important in an indie game. the rest stay the same.
  what do you think about this ?

about step 1:

the current firebase strucure is:

"users"/uid/media/uid/

here i have many fields about the media.
the relevant for the review are:

reviewScore : {
  criteria: {}
}
reviewProfile : ""
genre: ""

i have both genre and reviewProfile because is possible the multiple genre will have the 
same reviewProfile. this is not inside the review object.
what do you suggest we do here ?
when the media is created but  the review is not immediately submitted the criteria object will be empty;

reviewProfile : ""
reviewScore
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

this can be a valid solution ? what do you think.

also should we write immediatle the reviewType and add it in my type folder ?


this is the data structure:

reviewProfile: "Rpg"
production: "indie"

reviewScore: {
    criteria: {
      
    },
    modifiers: {
    },
    baseScore: 84.7,
    totalScore: 90.7
}


ok action profile is done.
we dont have an adveture profile yet but we can add it.

this are the profile i have now in the review profile:

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

    what do you think ? should we add more ?

    for example we can have . "4x", "rts", "simulation" etc but if we add every game genre 
    we will never finish.

    plase advise me on which profile to have for the version 1, considering that it doesnt take 
    a long time to build one we can have all the main one



next step:

- add production
- add multiple review profiles: main and secondary;
- add gotcha mechanins to the negative modifiers or the monetization  
  should include it ?

we are done with the book review;


what do you think should be our next step now:

1 implement the tvShow type review;
  this is the last remaining review type.
  this will be more complex than movies and books.
  it will have similar criteria than movies, with no modifiers 
  or production section but we need to decide how to do it.
  there are three layers: tvShow overall, season, single episode;

2 add production to the games review.
  we can make this very simple: if "studio" is selected we use the values we have now,
  if "indie" is selected we change the graphic and art style criteria a bit; 
  probably all other criteria will be untouched;

3 add extra profiles to the already existing types configuration;
  no code now, please just a plan on our next steps. And please  
  if you have any other steps you think we should implement now please share



steps:

1 Types and Firebase structure

2 Criteria and profiles

3 Scoring function

4 Overall review flow

5 Season management

6 Episode rating

7 Series status and badge

8 Integration and regression testing




before i post any components lets make it clear whar we have to do now.
please note:
- there are two places where i render the media items:
1) In the media, wishList and In-progress pages:
here i use the component <MediaListPage />;
and in this component i use:
<MediaItem /> for the item not reviewed yet;
<MediaReviewedItem /> for the  completed media;

2) in the media/[slug]/
 here i use the component: <MediaItemCard />

these components are very differents: 
MediaitemCard is the very detailed card that render all the details of the media;
this can be either completed, wishlist or in-progress;

i think for the tv series we should create a specific card for the tv series or add an extra component 
to the existing <MediaOtemCard > that will render the data specific for the tvSeries;

- at the moment i havent implemented yet the add review form the cards nor the rating display 
  for the completed items;

questions:
- should the user be able to add a review form both thses places or just form the detailed page ?
- should we focus on the <MediaItemCard /> now and later update the card in the lists ?


look like it is working correctly.
 when a season is created i can see for example the title "Season 1" and 
 the description "8 episodes".
 below the star rating and detail rating with not rated yet;

 before we proceed please try to fix the TvShowSeasonsSection
 i have this error:
 useEffect(() => {
        void loadSeasons();
    }, [loadSeasons]);

error: Error: Calling setState synchronously within an effect can trigger cascading renders







