function startConnection() {
    let offer = "";

    const peerConnection = new RTCPeerConnection();

    const dataChannel = peerConnection.createDataChannel("channel");

    dataChannel.onmessage = (event) => displayMessage(event.data);
    dataChannel.onopen = (event) => alert('Connection successful');

    peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
            offer = JSON.stringify(peerConnection.localDescription);
        }
    };

    peerConnection.createOffer()
        .then((offer) => {
            peerConnection.setLocalDescription(offer);
            return offer;
        })
        .then(PostData)
        .then(() => console.log("Set successfully"))
        .catch(error => console.error('ERROR:', error));

}

function displayMessage(data) {
    let element = document.getElementById('message-box');
    element.innerHTML += '<br>' + data;
}

function PostData(offer) {
    return new Promise((resolve, reject) => {
        var postData = {
            offer: offer
        };
        return fetch(homeUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify(postData)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log("Posting Success", data);
                resolve(data);
            })
            .catch(error => {
                console.error('ERROR:', error);
                reject(error);
            });
    });
}

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

