function createMainWindow() {
    let klsntWindowContainer = createWindow("klsnt-main-window", "400px", "500px", "Kalessinator");
    createContentMainArmy(klsntWindowContainer);
    document.querySelector('body').appendChild(klsntWindowContainer);

}

function createWindow(windowId, width, height, windowName) {
    let newWindow = document.createElement('div');
    newWindow.classList.add('klsnt-window-container')
    newWindow.id = windowId;
    newWindow.style.width = width;
    newWindow.style.height = height;

    let windowTop = localStorage.getItem('klsnt-' + windowId + '-top');
    let windowLeft = localStorage.getItem('klsnt-' + windowId + '-left');

    if (windowTop && windowLeft) {
        newWindow.style.top = windowTop;
        newWindow.style.left = windowLeft;
    }
    let windowHeader = addWindowHeader(windowName);
    addCloseButton(windowHeader, newWindow);
    newWindow.appendChild(windowHeader);
    dragElement(newWindow, windowHeader);
    return newWindow;
}
function createContentMainArmy(klsntWindowContainer) {
    let klsntWindowBody = document.createElement('div');
    klsntWindowBody.classList.add('klsnt-window-body');
    let klsntWindowBodyTabs = createTabs(klsntWindowBody);

    klsntWindowBody.insertBefore(klsntWindowBodyTabs, klsntWindowBody.firstChild);
    klsntWindowContainer.appendChild(klsntWindowBody);
}
function createTabs(klsntWindowBody) {

    let klsntWindowBodyTabs = document.createElement('div');
    klsntWindowBodyTabs.classList.add('klsnt-tabs');

    for (let i = 0; i < kalessinator_tabs.length; i++) {
        let klsntTab = document.createElement('div');
        klsntTab.classList.add('klsnt-tab');
        klsntTab.id = 'klsnt-' + kalessinator_tabs[i];
        klsntTab.appendChild(document.createElement('span'));
        klsntWindowBodyTabs.appendChild(klsntTab);


        let klsntTabContent = document.createElement('div');
        klsntTabContent.classList.add('klsnt-tab-content');
        klsntTabContent.id = 'klsnt-' + kalessinator_tabs[i] + '-content';
        klsntTabContent.style.visibility = 'hidden';

        klsntWindowBody.appendChild(klsntTabContent);
        populateTabContent(klsntTabContent.id);

        if (i === 0) {
            klsntTab.classList.remove('klsnt-tab');
            klsntTab.classList.add('klsnt-tab-selected');
            klsntTabContent.style.visibility = 'visible';
        }

        klsntTab.addEventListener('click', (e) => {
            let currentlySelectedTab = document.getElementsByClassName('klsnt-tab-selected')[0];
            currentlySelectedTab.classList.remove('klsnt-tab-selected');
            currentlySelectedTab.classList.add('klsnt-tab');

            e.srcElement.classList.remove('klsnt-tab');
            e.srcElement.classList.add('klsnt-tab-selected');

            let tabsContent = document.getElementsByClassName('klsnt-tab-content');
            for (let i = 0; i < tabsContent.length; i++) {
                if (tabsContent[i].style.visibility === 'visible') {
                    tabsContent[i].style.visibility = 'hidden';
                }
            }

            document.getElementById(e.srcElement.id + "-content").style.visibility = 'visible';
        })
    }

    function populateTabContent(contentTabName) {

        switch (contentTabName) {
            case "klsnt-gbg-content" :
                populateGbgContent();
                break;
            case "klsnt-settings-content" :
                populateSettingsContent().then();
                break;
        }
    }
    return klsntWindowBodyTabs;
}
function dragElement(windowContainer, header) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (header) {
        header.onmousedown = dragMouseDown;
    } else {
        windowContainer.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;

    }

    function elementDrag(e) {
        header.classList.add('klsnt-drag-cursor');
        e = e || window.event;
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        windowContainer.style.top = (windowContainer.offsetTop - pos2) + "px";
        windowContainer.style.left = (windowContainer.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
        header.classList.remove('klsnt-drag-cursor');
        localStorage.setItem('klsnt-' + windowContainer.id + '-top', windowContainer.style.top);
        localStorage.setItem('klsnt-' + windowContainer.id + '-left', windowContainer.style.left);
    }
}
