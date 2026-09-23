# Team Quiz Live — Working Prototype

This repository contains the current v0.5 prototype of the Quizlet Live-style team vocabulary game.

## Current features

- teacher-created six-digit game codes
- study-set library with tab-delimited and CSV import
- four modes: JPN Meaning, ENG Meaning, Synonyms, and Cloze
- 12 answer choices distributed among teammates
- correct overlay shown to the whole team
- English term, Japanese meaning, optional definition and synonyms, completed sentence, and optional Japanese translation
- overlay remains until any teammate presses Continue
- incorrect answers do not reveal the answer
- missed items return later with redistributed choices
- live teacher race bars
- automatically balanced teams of three or four
- randomized fruit and vegetable team names with matching emoji badges
- teacher button to randomize lobby groupings
- later arrivals placed into the most suitable team automatically
- compact icon-only multi-team race ticker on student gameplay screens
- return-to-zero, minus-one, or no progress penalty
- winner popup and confetti animation
- synchronized final leaderboard
- viewport-fitted student gameplay designed to avoid scrolling during ordinary questions
- another study set can be loaded while retaining connected players

## Study-set import

Preferred format: tab-delimited, one item per line.

```text
term    Japanese meaning    English definition    English synonyms    English sentence    Japanese translation
budget  予算                a plan for spending money    spending plan, allowance    Making a budget before a trip helps...    旅行前に予算を立てると…
```

The first two columns are required. The final four are optional.

A mode becomes selectable when the set contains at least 12 usable entries for that mode:

- **JPN Meaning:** Japanese meaning → English term
- **ENG Meaning:** English definition → English term
- **Synonyms:** English synonym or synonym group → English term
- **Cloze:** English sentence with a blank → English term

## Current hosting mode

`firebase-config.js` is currently set to local/demo synchronization. When hosted on GitHub Pages, the interface can be viewed from the public site, but genuine cross-device game synchronization still requires Firebase Realtime Database plus Anonymous Authentication.

To enable multi-device mode later:

1. Create a Firebase project.
2. Register a Web app and copy its configuration object.
3. Create a Realtime Database.
4. Enable Anonymous Authentication.
5. Replace `window.FIREBASE_CONFIG = null` in `firebase-config.js` with the Firebase configuration object.
6. Apply the rules in `database.rules.json` for development testing.

The frontend can continue to be hosted through GitHub Pages while Firebase handles live game state.
