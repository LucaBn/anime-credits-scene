var animeCreditsScene = {
    configData: {
        zIndex: 9999,
        bgImage: "assets/img/default.jpg",
        bgSong: "assets/audio/default.mp3",
        nameList: []
    },
    getConfigJSON: function () {
        var configJSON = fetch("assets/anime-credits-scene-data.json")
            .then(function (response) { return response.json(); })
            .then(function (configData) { return configData; })["catch"](function (error) { return console.log(error); });
        return configJSON;
    },
    setConfigData: function (_a) {
        var configData = _a.configData;
        Object.entries(configData)
            .filter(function (configDataProperty) { return configDataProperty[1]; })
            .forEach(function (configDataProperty) {
            animeCreditsScene.configData[configDataProperty[0]] =
                configDataProperty[1];
        });
    },
    handleAudioData: function () {
        fetch(animeCreditsScene.configData.bgSong)
            .then(function (audioObject) { return audioObject.arrayBuffer(); })
            .then(function (audioObject) {
            var audioContext = new window.AudioContext();
            audioContext.decodeAudioData(audioObject, function (buffer) {
                console.log(buffer.duration);
            });
        });
    },
    run: function () {
        var runPipe = Promise.resolve();
        runPipe
            .then(function () { return animeCreditsScene.getConfigJSON(); })
            .then(function (configData) { return animeCreditsScene.setConfigData({ configData: configData }); })
            .then(function () { return animeCreditsScene.handleAudioData(); });
    }
};
animeCreditsScene.run();
