chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
        chrome.scripting.insertCSS({
            target: {tabId: tabId},
            files: [
                "./klsnt-common/style/css/klsnt-cursor.css",
                "./klsnt-tabs/gbg/gbg.css",
                "./klsnt-tabs/settings/settings.css",
                "./klsnt-opener/interfaceOpener.css",
                "./klsnt-window/klsnt-window.css"
            ]
        }).then(() => {
            chrome.scripting.executeScript({
                target: {tabId: tabId},
                files: [
                    "./klsnt-army-setup/createArmyStyle.js",
                    "./klsnt-init/objects.js",
                    "./klsnt-init/init.js",
                    "./klsnt-tabs/gbg/gbg.js",
                    "./klsnt-change-army/change-army.js",
                    "./klsnt-tabs/settings/settings.js",
                    "./klsnt-window/klsnt-window.js",
                    "./klsnt-opener/interfaceOpener.js",
                    "./klsnt-common/methods/gameSpecific.js",
                    "./klsnt-common/methods/neighboursSpecific.js",
                    "./klsnt-common/methods/playerSpecific.js"
                ]
            })
                .then(() => console.log("Injected!"))
        })
            .catch(err => console.log(err));
    }
})
