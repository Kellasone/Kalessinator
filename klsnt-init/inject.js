chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
        chrome.scripting.insertCSS({
            target: {tabId: tabId},
            files: [
                "./klsnt-common/style/css/klsnt-cursor.css",
                "./klsnt-tabs/gbg/gbg.css",
                "./klsnt-opener/interfaceOpener.css",
                "./klsnt-window/klsnt-window.css"
            ]
        }).then(() => {
            chrome.scripting.executeScript({
                target: {tabId: tabId},
                files: [
                    "./klsnt-init/init.js",
                    "./klsnt-init/objects.js",
                    "./klsnt-tabs/gbg/gbg.js",
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
