chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
        chrome.scripting.insertCSS({
            target: {tabId: tabId},
            files: [
                "./mainOpener/interfaceOpener.css",
                "./mainWindow/mainWindow.css"
            ]
        }).then(() => {
            chrome.scripting.executeScript({
                target: {tabId: tabId},
                files: [
                    "./prep/init.js",
                    "./prep/objects.js",
                    "./mainOpener/interfaceOpener.js",
                    "./mainWindow/mainWindow.js",
                    "./commonMethods/gameSpecific.js",
                    "./commonMethods/neighboursSpecific.js",
                    "./commonMethods/playerSpecific.js"
                ]
            })
                .then(() => console.log("Injected!"))
        })
            .catch(err => console.log(err));
    }
})
