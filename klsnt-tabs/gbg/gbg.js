function populateGbgContent() {
    if(document.getElementById('klsnt-gbg-content')){
        document.getElementById('klsnt-gbg-content').innerText = 'misto';
    } else {
        wait(200).then(r => populateGbgContent());
    }
}