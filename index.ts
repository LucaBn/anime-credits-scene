// Const
const assetsPath = "assets";
const libraryName = "anime-credits-scene";

// Types
type NameListType = {
  title: string | null;
  subtitle: string | null;
  nameList: string[];
};

type ConfigDataFromJsonType = {
  zIndex: number;
  bgImage: string;
  bgSong: string;
  nameList: NameListType[];
};

type ConfigDataType = ConfigDataFromJsonType & {
  bgSongDuration: number;
  bgSongBuffer: AudioBufferSourceNode;
};

// Interfaces
interface ISetConfigData {
  configData: ConfigDataFromJsonType;
}

// Logic
const animeCreditsScene = {
  configData: <ConfigDataType>{
    zIndex: 9999,
    bgImage: `${assetsPath}/img/default.jpg`,
    bgSong: `${assetsPath}/audio/default.mp3`,
    bgSongDuration: 0,
    bgSongBuffer: null,
    nameList: [],
  },

  getConfigJSON: (): Promise<ConfigDataFromJsonType> => {
    const configJSON = fetch(`${assetsPath}/anime-credits-scene-data.json`)
      .then((response) => response.json())
      .then((configData) => configData)
      .catch((error) =>
        console.error(`Error with retrieving configuration file: ${error}`)
      );

    return configJSON;
  },

  setConfigData: ({ configData }: ISetConfigData): void => {
    Object.entries(configData)
      .filter((configDataProperty) => configDataProperty[1])
      .forEach((configDataProperty) => {
        animeCreditsScene.configData[configDataProperty[0]] =
          configDataProperty[1];
      });
  },

  handleAudioData: (): Promise<void> => {
    return new Promise((resolve) => {
      fetch(animeCreditsScene.configData.bgSong)
        .then((audioObject) => audioObject.arrayBuffer())
        .then((audioObject) => {
          const audioContext = new window.AudioContext();
          const bufferSource = audioContext.createBufferSource();

          audioContext.decodeAudioData(
            audioObject,
            (buffer) => {
              animeCreditsScene.configData.bgSongDuration = buffer.duration;

              bufferSource.buffer = buffer;
              bufferSource.connect(audioContext.destination);
              animeCreditsScene.configData.bgSongBuffer = bufferSource;

              resolve();
            },
            (error) => console.error(`Error with decoding audio data: ${error}`)
          );
        })
        .catch((error) =>
          console.error(`Error with handling audio file: ${error}`)
        );
    });
  },

  appendStyleTagToHead: (): void => {
    document.head.insertAdjacentHTML(
      "beforeend",
      `
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
    `
    );
  },

  appendOverlayElementToBody: (): void => {
    var overlayElement = document.createElement("div");
    overlayElement.id = `${libraryName}--container`;
    overlayElement.className = `${libraryName}--hidden`;
    overlayElement.innerHTML = `<span id="${libraryName}--close">✕</span>`;

    animeCreditsScene.appendStyleTagToHead();

    document.body.appendChild(overlayElement);
  },

  handleOverlayElement: (): Promise<void> => {
    return new Promise((resolve) => {
      const overlayElement = document.getElementById(
        `${libraryName}--container`
      );
      overlayElement === null && animeCreditsScene.appendOverlayElementToBody();

      const bgImage = new Image();
      bgImage.src = animeCreditsScene.configData.bgImage;
      bgImage.onload = () => {
        resolve();
      };
    });
  },

  addCloseEvent: (): void => {
    document.addEventListener("click", (event) => {
      const eventTarget = event.target as HTMLElement;

      if (eventTarget.id === `${libraryName}--close`) {
        eventTarget.parentElement.classList.add(`${libraryName}--hidden`);
        animeCreditsScene.configData.bgSongBuffer.stop();

        Array.from(animeCreditsSceneTriggererList).forEach(
          (animeCreditsSceneTriggerer) =>
            animeCreditsSceneTriggerer.classList.remove(
              `${libraryName}--running`
            )
        );
      }
    });
  },

  run: (): void => {
    const runPipe = Promise.resolve();

    runPipe
      .then(() => animeCreditsScene.getConfigJSON())
      .then((configData) => animeCreditsScene.setConfigData({ configData }))
      .then(() => animeCreditsScene.handleAudioData())
      .then(() => animeCreditsScene.handleOverlayElement())
      .then(() => {
        document
          .getElementById(`${libraryName}--container`)
          .classList.remove(`${libraryName}--hidden`);
        animeCreditsScene.configData.bgSongBuffer.start();
      })
      .then(() => animeCreditsScene.addCloseEvent())
      .catch((error) => console.error(`Error: ${error}`));
  },
};

// Bind onClick event
const animeCreditsSceneTriggererList = document.getElementsByClassName(
  `${libraryName}--run`
);
Array.from(animeCreditsSceneTriggererList).forEach(
  (animeCreditsSceneTriggerer) =>
    animeCreditsSceneTriggerer.addEventListener("click", (event) => {
      const eventTarget = event.target as HTMLElement;
      if (!eventTarget.classList.contains(`${libraryName}--running`)) {
        animeCreditsScene.run();
        eventTarget.classList.add(`${libraryName}--running`);
      }
    })
);
