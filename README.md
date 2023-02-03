# Anime Credits Scene

Add an anime-style credits scene to your website.

Set a background picture, a song and the names to display in the credits list; then enjoy the experience.

---

## How to use

Download the project.

Fill the `/assets/anime-credits-scene-data.json` file with your data.

> Property **zIndex** is used to let the Anime Credits Scene appear on top of every other element of the page in which you want to run the script, so be sure its value is not smaller then other elements' z-index value in the same page.

> You can leave **bgImage** and **bgSong** properties equal to null to use the default ones, otherwise you can assign strings with absolute paths of the image resource and of the audio resource.

> Fields **Title** and **Subtitle** can be set equal to null to hide them

Now take the `index.js` file and the `/assets` folder and use them wherever you need them (remember to delete unused resources in `/assets` folder to save disc space).

---

## Requirements for local installation

- Node.js >= 16.14.0

---

## Local installation

Clone the project.

Fill the `/assets/anime-credits-scene-data.json` file with your data as explained in the "How to use" section.

To install all required packages run

```
npm i
```

To generate the index.js file run

```
npx tsc
```

(Optional) You like unit tests? Just run

```
npm run test
```

Change the code to meet your needs.
