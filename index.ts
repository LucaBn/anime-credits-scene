// Config
const configInJS: ConfigDataFromJsonType | {} = {};

// Consts
const ASSETS_PATH: string = "assets";
const LIBRARY_NAME: string = "anime-credits-scene";
const FETCH_OPTIONS: RequestInit = { cache: "force-cache" };
const KANJI_LIST =
  "ぁあぃいぅうぇえぉおかがきぎくぐけげこごさざしじすずせぜそぞただちぢっつづてでとどなにぬねのはばぱひびぴふぶぷへべぺほぼぽまみむめもゃやゅゆょよらりるれろゎわゐゑをんァアィイゥウェエォオカガキギクグケゲコゴサザシジスズセゼソゾタダチヂッツヅテデトドナニヌネノハバパヒビピフブプヘベペホボポマミムメモャヤュユョヨラリルレロヮワヰヱヲンヴヵヶ";

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
  fontSizeTitle: string;
  fontSizeSubtitle: string;
  fontSizeNames: string;
  textColor: string;
  addRandomKanjisToNames: boolean;
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
    bgImage: `${ASSETS_PATH}/img/default.jpg`,
    bgSong: `${ASSETS_PATH}/audio/default.mp3`,
    bgSongDuration: 0,
    bgSongBuffer: null,
    nameList: [],
    fontSizeTitle: "clamp(1.7rem, 10vw, 2.55rem)",
    fontSizeSubtitle: "clamp(1.1rem, 6vw, 1.65rem)",
    fontSizeNames: "clamp(1rem, 5vw, 1.5rem)",
    textColor: "#fff",
    addRandomKanjisToNames: false,
  },

  currentAnimationSetTimeoutId: null,
  nameListStyleIsAppended: false,

  getConfigJSON: (): Promise<ConfigDataFromJsonType> => {
    if (Object.keys(configInJS).length > 0) {
      return new Promise((resolve) => {
        resolve(<ConfigDataFromJsonType>configInJS);
      });
    }

    const configJSON = fetch(
      `${ASSETS_PATH}/anime-credits-scene-data.json`,
      FETCH_OPTIONS
    )
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
      fetch(animeCreditsScene.configData.bgSong, FETCH_OPTIONS)
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

  appendOverlayElementStyleTagToHead: (): void => {
    document.head.insertAdjacentHTML(
      "beforeend",
      `
      <style>
        #${LIBRARY_NAME}__container {
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
        #${LIBRARY_NAME}__container span {
          position: absolute;
          top: 1rem;
          right: 1rem;
          color: rgba(255,255,255,.75);
          font-size: 40px;
          line-height: 40px;
          cursor: pointer;
          filter: drop-shadow(0 0 3px #000);
          z-index: 1;
        }
        .${LIBRARY_NAME}--hidden {
          opacity: 0;
          pointer-events: none;
        }
      </style>
    `
    );
  },

  appendOverlayElementToBody: (): void => {
    const overlayElement = document.createElement("div");
    overlayElement.id = `${LIBRARY_NAME}__container`;
    overlayElement.className = `${LIBRARY_NAME}--hidden`;
    overlayElement.innerHTML = `<span id="${LIBRARY_NAME}__close-button">✕</span>`;

    animeCreditsScene.appendOverlayElementStyleTagToHead();

    document.body.appendChild(overlayElement);
  },

  handleOverlayElement: (): Promise<void> => {
    return new Promise((resolve) => {
      const overlayElement = document.getElementById(
        `${LIBRARY_NAME}__container`
      );
      overlayElement === null && animeCreditsScene.appendOverlayElementToBody();

      const bgImage = new Image();
      bgImage.src = animeCreditsScene.configData.bgImage;
      bgImage.onload = () => {
        resolve();
      };
    });
  },

  getRandomKanji: (length: number): string => {
    const kanjiString = Array.from(
      { length },
      () => KANJI_LIST[Math.floor(Math.random() * KANJI_LIST.length)]
    ).join("");
    return kanjiString;
  },

  handleNameString: (nameString: string): string => {
    return animeCreditsScene.configData.addRandomKanjisToNames
      ? `${nameString} ${animeCreditsScene.getRandomKanji(2)}`
      : nameString;
  },

  getNameListBlockHTML: (nameListBlock: NameListType): string => {
    return `
      <ul>
        ${
          nameListBlock.title
            ? `<li class="${LIBRARY_NAME}__name-list-title">${nameListBlock.title}</li>`
            : ``
        }
        ${
          nameListBlock.subtitle
            ? `<li class="${LIBRARY_NAME}__name-list-subtitle">${nameListBlock.subtitle}</li>`
            : ``
        }
        ${
          nameListBlock.nameList.length &&
          nameListBlock.nameList
            .map((nameString) =>
              nameString
                ? `<li class="${LIBRARY_NAME}__name-list-name">${animeCreditsScene.handleNameString(
                    nameString
                  )}</li>`
                : ``
            )
            .join("")
        }
      </ul>
    `;
  },

  appendNameListElementToBody: (): void => {
    const nameListElement = document.createElement("div");
    nameListElement.id = `${LIBRARY_NAME}__name-list`;

    animeCreditsScene.configData.nameList.forEach((nameListBlock) => {
      nameListElement.innerHTML +=
        animeCreditsScene.getNameListBlockHTML(nameListBlock);
    });

    const overlayElement = document.getElementById(
      `${LIBRARY_NAME}__container`
    );
    overlayElement.appendChild(nameListElement);
  },

  appendNameListStyleTagToHead: (): void => {
    document.head.insertAdjacentHTML(
      "beforeend",
      `
      <style>
        @keyframes ${LIBRARY_NAME}__name-list-animation {
          from { transform: translateY(100vh); }
          to { transform: translateY(-100%); }
        }

        #${LIBRARY_NAME}__name-list {
          position: absolute;
          top: 0px;
          left: 10%;
          width: 80%;
          font-family: monospace;
          color: ${animeCreditsScene.configData.textColor};
          text-align: center;
          filter: drop-shadow(0 0 3px #000);
          user-select: none;
          animation: ${LIBRARY_NAME}__name-list-animation ${
        animeCreditsScene.configData.bgSongDuration - 0.5
      }s linear;
          animation-fill-mode: forwards;
        }
        #${LIBRARY_NAME}__name-list ul {
          display: block;
          max-width: 750px;
          list-style: none;
          margin-left: auto;
          margin-right: auto;
          margin-block-end: 65px;
          padding: 0;
        }
        #${LIBRARY_NAME}__name-list ul:last-child {
          margin-block-end: 0;
        }
        .${LIBRARY_NAME}__name-list-title {
          font-size: ${animeCreditsScene.configData.fontSizeTitle};
          line-height: 1;
          margin-block-end: 20px;
          word-break: break-word;
        }
        .${LIBRARY_NAME}__name-list-subtitle {
          font-size: ${animeCreditsScene.configData.fontSizeSubtitle};
          font-style: oblique;
          line-height: 1;
          margin-block-start: -5px;
          margin-block-end: 20px;
          word-break: break-word;
        }
        .${LIBRARY_NAME}__name-list-name {
          font-size: ${animeCreditsScene.configData.fontSizeNames};
          line-height: 1;
          margin-block-end: 5px;
          word-break: break-word;
        }
      </style>
    `
    );

    animeCreditsScene.nameListStyleIsAppended = true;
  },

  handleNameList: (): void => {
    animeCreditsScene.appendNameListElementToBody();
    !animeCreditsScene.nameListStyleIsAppended &&
      animeCreditsScene.appendNameListStyleTagToHead();
  },

  addCloseEvent: (): void => {
    document.addEventListener("click", (event) => {
      const eventTarget = event.target as HTMLElement;

      if (eventTarget.id === `${LIBRARY_NAME}__close-button`) {
        eventTarget.parentElement.classList.add(`${LIBRARY_NAME}--hidden`);
        animeCreditsScene.configData.bgSongBuffer.stop();

        Array.from(animeCreditsSceneTriggererList).forEach(
          (animeCreditsSceneTriggerer: HTMLElement) =>
            animeCreditsSceneTriggerer.classList.remove(
              `${LIBRARY_NAME}--running`
            )
        );

        clearTimeout(animeCreditsScene.currentAnimationSetTimeoutId);

        const nameList = document.getElementById(`${LIBRARY_NAME}__name-list`);
        nameList && nameList.remove();
      }
    });
  },

  startScene: (): void => {
    document
      .getElementById(`${LIBRARY_NAME}__container`)
      .classList.remove(`${LIBRARY_NAME}--hidden`);
    animeCreditsScene.configData.bgSongBuffer.start();

    const currentSetTimeout = setTimeout(() => {
      document.getElementById(`${LIBRARY_NAME}__name-list`).remove();
      document.getElementById(`${LIBRARY_NAME}__close-button`).click();
    }, animeCreditsScene.configData.bgSongDuration * 1000);
    animeCreditsScene.currentAnimationSetTimeoutId = currentSetTimeout;
  },

  run: (): void => {
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

// Bind onClick event
let animeCreditsSceneTriggererList: HTMLCollection;

document.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("click", (event: Event) => {
    const animeCreditsSceneTriggererList = (
      event.target as HTMLElement
    ).closest(`.${LIBRARY_NAME}--run`);

    if (animeCreditsSceneTriggererList) {
      const eventTarget = event.target as HTMLElement;

      if (!eventTarget.classList.contains(`${LIBRARY_NAME}--running`)) {
        animeCreditsScene.run();
        eventTarget.classList.add(`${LIBRARY_NAME}--running`);
      }
    }
  });
});
