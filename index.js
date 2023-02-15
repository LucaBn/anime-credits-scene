const assetsPath = "assets";
const animeCreditsScene = {
    configData: {
        zIndex: 9999,
        bgImage: `${assetsPath}/img/default.jpg`,
        bgSong: `${assetsPath}/audio/default.mp3`,
        bgSongDuration: 0,
        bgSongBuffer: null,
        nameList: [],
    },
    getConfigJSON: () => {
        const configJSON = fetch(`${assetsPath}/anime-credits-scene-data.json`)
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
            fetch(animeCreditsScene.configData.bgSong)
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
    run: () => {
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
animeCreditsScene.run();
