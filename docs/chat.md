i have tested both version but none are working as especetd.
i have tested like this:

<div>
    <p>Rating test:</p>
    <StarRating rating={10} />
</div>

test outcome version 1:

- rating 0.5: all empty star: incorrect;
- rating 1: half star yellow: incorrect;
- rating 1.5: all empty stars: incorrect;
- rating 2: one full star: incorrect;
- rating 4.5: two yellow stars, three empty: incorrect;
- rating 5: two purple stars, one half yellow star: incorrect;
- rating 5.5: two purple stars, three empty stars; incorrect;
- rating 8: four purple stars, one empty star: incorrect;
- rating 9: four purple stars, one half purple half empty star: incorrect;
- rating 10: five purple stars: correct; 

test outcome version 2:
- 