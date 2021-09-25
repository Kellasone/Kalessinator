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
                    "./mainOpener/interfaceOpener.js",
                    "./mainWindow/mainWindow.js",
                    "./preparationScript/init.js",
                    "./neighbours.js"
                ]
            })
                .then(() => console.log("Injected!"))
        })
            .catch(err => console.log(err));
    }
})
