// Const
const assetsPath = "assets";

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

  run: (): void => {
    const runPipe = Promise.resolve();

    runPipe
      .then(() => animeCreditsScene.getConfigJSON())
      .then((configData) => animeCreditsScene.setConfigData({ configData }))
      .then(() => animeCreditsScene.handleAudioData())
      .then(() => {
        animeCreditsScene.configData.bgSongBuffer.start();
      })
      .catch((error) => console.error(`Error: ${error}`));
  },
};

// Bind onClick event
const animeCreditsSceneTriggererList = document.querySelectorAll(
  ".anime-credits-scene--run"
);
animeCreditsSceneTriggererList.forEach((animeCreditsSceneTriggerer) =>
  animeCreditsSceneTriggerer.addEventListener("click", () => {
    animeCreditsScene.run();
  })
);
