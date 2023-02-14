const animeCreditsScene = {
    configData: {
        zIndex: 9999,
        bgImage: "assets/img/default.jpg",
        bgSong: "assets/audio/default.mp3",
        nameList: [],
    },
    getConfigJSON: () => {
        const configJSON = fetch("assets/anime-credits-scene-data.json")
            .then((response) => response.json())
            .then((configData) => configData)
            .catch((error) => console.log(error));
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
        fetch(animeCreditsScene.configData.bgSong)
            .then((audioObject) => audioObject.arrayBuffer())
            .then((audioObject) => {
            const audioContext = new window.AudioContext();
            audioContext.decodeAudioData(audioObject, function (buffer) {
                console.log(buffer.duration);
            });
        });
    },
    run: () => {
        const runPipe = Promise.resolve();
        runPipe
            .then(() => animeCreditsScene.getConfigJSON())
            .then((configData) => animeCreditsScene.setConfigData({ configData }))
            .then(() => animeCreditsScene.handleAudioData());
    },
};
animeCreditsScene.run();
