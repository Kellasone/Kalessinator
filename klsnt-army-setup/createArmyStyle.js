function addStylesheetRules() {
    let styleEl = document.createElement('style');
    document.head.appendChild(styleEl);

    let styleSheet = styleEl.sheet;

    for (let era in troops) {
        for (let i = 0; i < troops[era]['units'].length; i++) {
            let troopName = troops[era]['units'][i];
            let rule = `#klsnt-army-slot-${troopName} {background: url("chrome-extension://` + chrome.runtime.id + `/klsnt-army-setup/images/${troopName}.png") center no-repeat;}`;
            styleSheet.insertRule(rule);
        }
    }

    let troopName = ['rogue','empty'];
    for (let i=0;i< troopName.length;i++){
        let rule = `#klsnt-army-slot-${troopName[i]} {background: url("chrome-extension://` + chrome.runtime.id + `/klsnt-army-setup/images/${troopName[i]}.png") center no-repeat;}`;
        styleSheet.insertRule(rule);
    }

}
