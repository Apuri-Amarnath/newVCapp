const toSendOfferUrl = "/cm/"
let serverPeerConnection;
let textOnlyChannel;

function pollClientAnswerAndStartMeeting(meetingId, afterReceivingAnswer) {
    const answerRequest = {
        "requestType": "getClientAnswer",
        "meetingId": meetingId
    }
    const answerResponse = synchronousPostJsonObject(toSendOfferUrl, answerRequest);
    if (answerResponse != null && answerResponse.answerData != null) {
        serverPeerConnection.setRemoteDescription(JSON.parse(answerResponse.answerData)).then(value => {
            console.log("Answer accepted")
            afterReceivingAnswer(answerResponse.meetingId, answerResponse.meetingTitle);
            hideLoadingMeeting();
        });
    } else {
        setTimeout(function () {
            pollClientAnswerAndStartMeeting(meetingId, afterReceivingAnswer);
        }, 2000);
    }
}

function createMeeting(userId, meetingTitle, afterCreatingMeeting) {
    serverPeerConnection = new RTCPeerConnection();
    textOnlyChannel = serverPeerConnection.createDataChannel("textOnlyChannel");
    serverPeerConnection.onicecandidate = ev => {
        if (serverPeerConnection.iceGatheringState === "complete") {
            let serverConnDesc = JSON.stringify(serverPeerConnection.localDescription);
            console.log("ICE Candidate description: %s", serverConnDesc);
            const requestObj = {
                "requestType": "createNewMeeting",
                "userId": userId,
                "meetingTitle": meetingTitle,
                "offerData": serverPeerConnection.localDescription
            };
            createMeetingResponse = synchronousPostJsonObject(toSendOfferUrl, requestObj);
            if (createMeetingResponse != null && createMeetingResponse.meetingId !== undefined) {
                const startMeeting = document.getElementById("start-meeting");
                startMeeting.style.display = "none";
                showLoadingMeeting(createMeetingResponse.meetingId);
                pollClientAnswerAndStartMeeting(createMeetingResponse.meetingId, afterCreatingMeeting);
            }
        }
    };

    textOnlyChannel.onopen = ev => {
        console.log("Connection opened. Event %s", ev);
    };

    textOnlyChannel.onmessage = ev => {
        console.log("Received message from client %s\n\tmsg: ", ev.origin, ev.data);
        onMessage(ev.data);
    };

    serverPeerConnection.createOffer().then(offerVal => {
        console.log("offer created %s", JSON.stringify(offerVal));
        serverPeerConnection.setLocalDescription(offerVal).then(offerResponse => {
            console.log("offer set locally %s", offerResponse);
        });
    });
}

function showLoadingMeeting(meetingId) {
  document.getElementById('loading-meeting').style.display = 'block';
  document.getElementById('spinnerMeetingId').textContent = meetingId;
}

function hideLoadingMeeting() {
  document.getElementById('loading-meeting').style.display = 'none';
}
