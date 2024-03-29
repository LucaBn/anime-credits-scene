<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://github.com/LucaBn/anime-credits-scene/blob/main/logo/anime-credits-scene--logo-dark.png?raw=true">
    <source media="(prefers-color-scheme: light)" srcset="https://github.com/LucaBn/anime-credits-scene/blob/main/logo/anime-credits-scene--logo-light.png?raw=true">
    <img alt="Anime Credits Scene" src="https://github.com/LucaBn/anime-credits-scene/blob/main/logo/anime-credits-scene--logo-dark.png?raw=true" width="350" height="147" style="max-width: 100%;">
  </picture>
</p>

# What's this?!

Add an anime-style credits scene to your website.

Set a background picture, a song and the names to display in the credits list; then enjoy the experience.

## How to use

Download the project.

Fill the `/assets/anime-credits-scene-data.json` file with your data.

> Assign to **zIndex** the numeric value of z-index css property to let the Anime Credits Scene appear on top of every other element of the page in which you want to run the script, so be sure its value is not smaller then other elements' z-index value in the same page, otherwise you can leave it equal to null.

> Assign to **bgImage** and **bgSong** strings with absolute paths of the image resource and of the audio resource, otherwise you can leave them equal to null.

> Assign to **fontSizeTitle** a string with title's font-size css property value, otherwise you can leave it equal to null.

> Assign to **fontSizeSubtitle** a string with subtitle's font-size css property value, otherwise you can leave it equal to null.

> Assign to **fontSizeNames** a string with names' font-size css property value, otherwise you can leave it equal to null.

> Assign to **textColor** a string with css valid value for color property, otherwise you can leave it equal to null.

> Assign to **addRandomKanjisToNames** a boolean value to determine if names in the name list need to be rendered with random [kanjis](https://en.wikipedia.org/wiki/Kanji) on the right, otherwise you can leave it equal to null (I know, it's nonsense, but I liked it the idea).

> In the nameList array **Title** and **Subtitle** properties can be set equal to null to hide them

Take the `index.js` file and the `/assets` folder and use them wherever you need them (remember to delete unused resources in `/assets` folder to save disc space).

Include the library in your page(s) and add class `${LIBRARY_NAME}--run` to the html elements that need to trigger the anime-credit-scene effect.
`${LIBRARY_NAME}` is equal to `"anime-credits-scene"` by default.

Example:
```html
<button class="anime-credit-scene--run">
  This button starts the Anime Credit Scene effect!
</button>
```

## Local installation

Requirements:
- Node.js >= 16.14.0
- npm >= 8.3.1
- IQ > 50

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

Change the code to meet your needs.

## Pro tip

You can speed up the Anime Credit Scene experience by writing your data directly in the `index.js` file by filling the `configInJS` variable at line 1.

Just copy-paste the JSON object and the script will prevent fetching config data from the `/assets/anime-credits-scene-data.json` file since it's already set in the JS file.

You can also leave that field set as an empty object if you prefer to store your data in the `/assets/anime-credits-scene-data.json` file.

## CDN

```
https://cdn.jsdelivr.net/gh/lucabn/anime-credits-scene/index.js
```
