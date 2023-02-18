const assetsPath = "assets";
const libraryName = "anime-credits-scene";
const fetchOptions = { cache: "force-cache" };
const animeCreditsScene = {
    configData: {
        zIndex: 9999,
        bgImage: `${assetsPath}/img/default.jpg`,
        bgSong: `${assetsPath}/audio/default.mp3`,
        bgSongDuration: 0,
        bgSongBuffer: null,
        nameList: [],
    },
    currentAnimationSetTimeoutId: null,
    getConfigJSON: () => {
        const configJSON = fetch(`${assetsPath}/anime-credits-scene-data.json`, fetchOptions)
            .then((response) => response.json())
            .then((configData) => configData)
            .catch((error) => console.error(`Error with retrieving configuration file: ${error}`));
        return configJSON;
    },
    setConfigData: ({ configData }) => {
        Object.entries(configData)
            .filter((configDataProperty) => configDataProperty[1])
            .forEach((configDataProperty) => {
            animeCreditsScene.configData[configDataProperty[0]] =
                configDataProperty[1];
        });
    },
    handleAudioData: () => {
        return new Promise((resolve) => {
            fetch(animeCreditsScene.configData.bgSong, fetchOptions)
                .then((audioObject) => audioObject.arrayBuffer())
                .then((audioObject) => {
                const audioContext = new window.AudioContext();
                const bufferSource = audioContext.createBufferSource();
                audioContext.decodeAudioData(audioObject, (buffer) => {
                    animeCreditsScene.configData.bgSongDuration = buffer.duration;
                    bufferSource.buffer = buffer;
                    bufferSource.connect(audioContext.destination);
                    animeCreditsScene.configData.bgSongBuffer = bufferSource;
                    resolve();
                }, (error) => console.error(`Error with decoding audio data: ${error}`));
            })
                .catch((error) => console.error(`Error with handling audio file: ${error}`));
        });
    },
    appendOverlayElementStyleTagToHead: () => {
        document.head.insertAdjacentHTML("beforeend", `
      <style>
        #${libraryName}--container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: #000;
          background-image: url("${animeCreditsScene.configData.bgImage}");
          background-repeat: no-repeat;
          background-position: center center;
          background-size: cover;
          z-index: ${animeCreditsScene.configData.zIndex};
          transition: opacity .35s ease-in-out;
        }
        #${libraryName}--container span {
          position: absolute;
          top: 1rem;
          right: 1rem;
          color: rgba(255,255,255,.75);
          font-size: 40px;
          line-height: 40px;
          cursor: pointer;
          filter: drop-shadow(0 0 3px #000);
        }
        .${libraryName}--hidden {
          opacity: 0;
          pointer-events: none;
        }
      </style>
    `);
    },
    appendOverlayElementToBody: () => {
        const overlayElement = document.createElement("div");
        overlayElement.id = `${libraryName}--container`;
        overlayElement.className = `${libraryName}--hidden`;
        overlayElement.innerHTML = `<span id="${libraryName}--close">✕</span>`;
        animeCreditsScene.appendOverlayElementStyleTagToHead();
        document.body.appendChild(overlayElement);
    },
    handleOverlayElement: () => {
        return new Promise((resolve) => {
            const overlayElement = document.getElementById(`${libraryName}--container`);
            overlayElement === null && animeCreditsScene.appendOverlayElementToBody();
            const bgImage = new Image();
            bgImage.src = animeCreditsScene.configData.bgImage;
            bgImage.onload = () => {
                resolve();
            };
        });
    },
    getNameListBlockHTML: (nameListBlock) => {
        return `
      <ul>
        ${nameListBlock.title
            ? `<li class="${libraryName}--name-list__title">${nameListBlock.title}</li>`
            : ``}
        ${nameListBlock.subtitle
            ? `<li class="${libraryName}--name-list__subtitle">${nameListBlock.subtitle}</li>`
            : ``}
        ${nameListBlock.nameList.length &&
            nameListBlock.nameList
                .map((nameString) => nameString
                ? `<li class="${libraryName}--name-list__name">${nameString}</li>`
                : ``)
                .join("")}
      </ul>
    `;
    },
    appendNameListElementToBody: () => {
        const nameListElement = document.createElement("div");
        nameListElement.id = `${libraryName}--name-list`;
        animeCreditsScene.configData.nameList.forEach((nameListBlock) => {
            nameListElement.innerHTML +=
                animeCreditsScene.getNameListBlockHTML(nameListBlock);
        });
        const overlayElement = document.getElementById(`${libraryName}--container`);
        overlayElement.appendChild(nameListElement);
    },
    appendNameListStyleTagToHead: () => {
        document.head.insertAdjacentHTML("beforeend", `
      <style>
        @keyframes ${libraryName}--name-list-animation {
          from { transform: translateY(100vh); }
          to { transform: translateY(-100%); }
        }

        #${libraryName}--name-list {
          position: absolute;
          top: 0px;
          left: 10%;
          width: 80%;
          font-family: monospace;
          color: #fff;
          text-align: center;
          filter: drop-shadow(0 0 3px #000);
          user-select: none;
          animation: ${libraryName}--name-list-animation ${animeCreditsScene.configData.bgSongDuration - 0.5}s linear;
          animation-fill-mode: forwards;
        }
        #${libraryName}--name-list ul {
          display: block;
          max-width: 750px;
          list-style: none;
          margin-left: auto;
          margin-right: auto;
          margin-block-end: 65px;
          padding: 0;
        }
        #${libraryName}--name-list ul:last-child {
          margin-block-end: 0;
        }
        .${libraryName}--name-list__title {
          font-size: clamp(1.7rem, 10vw, 2.55rem);
          line-height: 1;
          margin-block-end: 20px;
          word-break: break-word;
        }
        .${libraryName}--name-list__subtitle {
          font-size: clamp(1.1rem, 6vw, 1.65rem);
          font-style: oblique;
          line-height: 1;
          margin-block-start: -5px;
          margin-block-end: 20px;
          word-break: break-word;
        }
        .${libraryName}--name-list__name {
          font-size: clamp(1rem, 5vw, 1.5rem);
          line-height: 1;
          margin-block-end: 5px;
          word-break: break-word;
        }
      </style>
    `);
    },
    handleNameList: () => {
        animeCreditsScene.appendNameListElementToBody();
        animeCreditsScene.appendNameListStyleTagToHead();
    },
    addCloseEvent: () => {
        document.addEventListener("click", (event) => {
            const eventTarget = event.target;
            if (eventTarget.id === `${libraryName}--close`) {
                eventTarget.parentElement.classList.add(`${libraryName}--hidden`);
                animeCreditsScene.configData.bgSongBuffer.stop();
                Array.from(animeCreditsSceneTriggererList).forEach((animeCreditsSceneTriggerer) => animeCreditsSceneTriggerer.classList.remove(`${libraryName}--running`));
                clearTimeout(animeCreditsScene.currentAnimationSetTimeoutId);
                document.getElementById(`${libraryName}--name-list`).remove();
            }
        });
    },
    startScene: () => {
        document
            .getElementById(`${libraryName}--container`)
            .classList.remove(`${libraryName}--hidden`);
        animeCreditsScene.configData.bgSongBuffer.start();
        const currentSetTimeout = setTimeout(() => {
            document.getElementById(`${libraryName}--name-list`).remove();
            document.getElementById(`${libraryName}--close`).click();
        }, animeCreditsScene.configData.bgSongDuration * 1000);
        animeCreditsScene.currentAnimationSetTimeoutId = currentSetTimeout;
    },
    run: () => {
        const runPipe = Promise.resolve();
        runPipe
            .then(() => animeCreditsScene.getConfigJSON())
            .then((configData) => animeCreditsScene.setConfigData({ configData }))
            .then(() => animeCreditsScene.handleAudioData())
            .then(() => animeCreditsScene.handleOverlayElement())
            .then(() => animeCreditsScene.handleNameList())
            .then(() => animeCreditsScene.addCloseEvent())
            .then(() => animeCreditsScene.startScene())
            .catch((error) => console.error(`Error: ${error}`));
    },
};
const animeCreditsSceneTriggererList = document.getElementsByClassName(`${libraryName}--run`);
Array.from(animeCreditsSceneTriggererList).forEach((animeCreditsSceneTriggerer) => animeCreditsSceneTriggerer.addEventListener("click", (event) => {
    const eventTarget = event.target;
    if (!eventTarget.classList.contains(`${libraryName}--running`)) {
        animeCreditsScene.run();
        eventTarget.classList.add(`${libraryName}--running`);
    }
}));
