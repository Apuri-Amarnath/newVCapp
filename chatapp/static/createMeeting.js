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
        serverPeerConnection.setRemoteDescription(answerResponse.answerData).then(value => {
            console.log("Answer received %s", JSON.stringify(answerResponse.answerData));
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
    // Calling the REST API TO fetch the TURN Server Credentials
    // const iceServers = [{
    //     "urls": "stun:stun.relay.metered.ca:80"
    // }];
    const iceServers = synchronousGetRequest("https://gkrao.metered.live/api/v1/turn/credentials?apiKey=a1946aafe661154c29c723787e22a49176de");
    const configuration = {
        iceServers: iceServers
    };
    serverPeerConnection = new RTCPeerConnection(configuration);
    textOnlyChannel = serverPeerConnection.createDataChannel("textOnlyChannel");
    serverPeerConnection.onicecandidate = ev => {
        if (serverPeerConnection.iceGatheringState === "complete") {
            let serverConnDesc = JSON.stringify(serverPeerConnection.localDescription);
            console.log("local offer is: %s", serverConnDesc);
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
