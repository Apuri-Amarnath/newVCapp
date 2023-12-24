function startConnection(data) {
    console.log(data);
    const peerConnection = new RTCPeerConnection();

    // Handle ice candidates and send answer when available
    peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
            sendAnswer(event.candidate);
        }
    };

    // Set up data channel for messaging
    peerConnection.ondatachannel = (e) => {
        peerConnection.dc = e.channel;
        peerConnection.dc.onmessage = (event) => displayMessage(event.data);
        peerConnection.dc.onopen = () => alert('Connection successful');
    };

    // Set up offer when received
    let offer = new RTCSessionDescription(data);
    peerConnection.setRemoteDescription(offer)
        .then(() => {
            console.log("Offer set", offer);
            return peerConnection.createAnswer();
        })
        .then(createdAnswer => {
            return peerConnection.setLocalDescription(createdAnswer);
        })
        .then(() => {
            console.log("Answer created");
            sendAnswer(peerConnection.localDescription);
        });
}

function sendAnswer(answer) {
    var postdata = {
        answer: answer,
    };
    fetch(chatUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: JSON.stringify(postdata),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Posting Success", data);
        })
        .catch(error => {
            console.error('ERROR:', error);
        });
}

function displayMessage(data) {
    let element = document.getElementById('message-box');
    element.innerHTML += '<br>' + data;
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
