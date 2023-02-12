// Types
type NameListType = {
  title: string | null;
  subtitle: string | null;
  nameList: string[];
};

type ConfigDataType = {
  zIndex: number;
  bgImage: string;
  bgSong: string;
  nameList: NameListType[];
};

// Interfaces
interface ISetConfigData {
  configData: ConfigDataType;
}

// Logic
const animeCreditsScene = {
  configData: <ConfigDataType>{
    zIndex: 9999,
    bgImage: "assets/img/default.jpg",
    bgSong: "assets/audio/default.mp3",
    nameList: [],
  },

  getConfigJSON: (): Promise<ConfigDataType> => {
    const configJSON = fetch("assets/anime-credits-scene-data.json")
      .then((response) => response.json())
      .then((configData) => configData)
      .catch((error) => console.log(error));

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

  handleAudioData: (): void => {
    fetch(animeCreditsScene.configData.bgSong)
      .then((audioObject) => audioObject.arrayBuffer())
      .then((audioObject) => {
        const audioContext = new window.AudioContext();
        audioContext.decodeAudioData(audioObject, function (buffer) {
          console.log(buffer.duration);
        });
        // TODO: play audio
        // const audio = document.getElementById("audio") as HTMLAudioElement;
        // audio.src = animeCreditsScene.configData.bgSong;
        // audio.load();
        // audio.play();
      });
  },

  run: (): void => {
    const runPipe = Promise.resolve();

    runPipe
      .then(() => animeCreditsScene.getConfigJSON())
      .then((configData) => animeCreditsScene.setConfigData({ configData }))
      .then(() => animeCreditsScene.handleAudioData());
  },
};

// Run it!
animeCreditsScene.run();
