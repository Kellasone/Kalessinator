function createResultWindow() {
    const resultWindow = document.createElement('div');
    resultWindow.classList.add('result-window');

    const resultWindowHeader = document.createElement('div');
    resultWindowHeader.classList.add('window-header')

    const closeButton = document.createElement('div');
    closeButton.id = 'close-button-neighbours';
    closeButton.addEventListener('click', () =>{
        document.getElementsByClassName('result-window')[0].remove();
    })

    resultWindowHeader.appendChild(closeButton);

    const resultWindowBody = document.createElement('div');
    resultWindowBody.classList.add('window-body')

    const windowBodyContent = document.createElement('div');
    windowBodyContent.classList.add('window-body-content')

    resultWindowBody.appendChild(windowBodyContent);

    const resultWindowFooter = document.createElement('div');
    resultWindowFooter.classList.add('window-footer')

    resultWindow.appendChild(resultWindowHeader);
    resultWindow.appendChild(resultWindowBody);
    resultWindow.appendChild(resultWindowFooter);

    document.querySelector('body').appendChild(resultWindow);
    dragElement(resultWindow,resultWindowHeader);
}
