function FoeSendRequestAsync(rq, timeout = 400) {
    return new Promise(resolve => setTimeout(resolve, timeout)).then(async () => {
        return FoeSendRequestPromise(rq);
    });
}

function FoeSendRequestPromise(body) {
    return new Promise(async function (resolve, reject) {
        body[0]["requestId"] = kalessinator_variables.requestId;
        var xhr = new XMLHttpRequest();

        xhr.open('POST', `/game/json?h=${kalessinator_variables.userKey}`, true);
        xhr.setRequestHeader('Client-Identification', `version=${kalessinator_variables.version}; requiredVersion=${kalessinator_variables.requiredVersion}; platform=bro; platformType=html5; platformVersion=web`);
        xhr.setRequestHeader('Signature', Signature(kalessinator_variables.userKey, kalessinator_variables.secret, body));
        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                resolve(JSON.parse(xhr.response));
            } else {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            }
        };
        xhr.onerror = function () {
            reject({
                status: this.status,
                statusText: xhr.statusText
            });
        };
        xhr.send(JSON.stringify(body));
        kalessinator_variables.requestId++;
    });
}

function findMethodJson(json, className) {
    for (var i = 0; i < json.length; i++) {
        if (json[i]["requestMethod"] == className) return i;
    }
    return -1;
}