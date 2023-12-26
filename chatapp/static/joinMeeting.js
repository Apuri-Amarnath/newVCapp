const toSendAnswersUrl = "/jm/"
let peerConnection;
let textOnlyChannel;
let meetingId;

function joinMeeting(username, meetingId, afterJoining) {
    peerConnection = new RTCPeerConnection();
    peerConnection.onicecandidate = ev => {
        if (peerConnection.iceGatheringState === "complete") {
            console.log("New ICE Candidate " + ev.candidate);
            let answerData = JSON.stringify(peerConnection.localDescription);
            console.log("offer value %s", answerData);
            const answerPostRequest = {
                "requestType": "takeMyAnswer",
                "meetingId": meetingId,
                "username": username,
                "answerData": answerData
            }
            let meetingData = synchronousPostJsonObject(toSendAnswersUrl, answerPostRequest);
            window.meetingId = meetingId;
            afterJoining(meetingId, meetingData.meetingTitle);
        }
    };
    peerConnection.ondatachannel = channelEvent => {
        textOnlyChannel = channelEvent.channel;
        textOnlyChannel.onopen = openEv => {
            console.log("Connection opened");
        };
        textOnlyChannel.onmessage = msgEv => {
            console.log("Received msg from remote %s\n\t%s", msgEv.origin, msgEv.data);
            onMessage(msgEv.data);
        };
    };
    const offerRequest = {
        "requestType": "giveMeOffer",
        "meetingId": meetingId
    }
    const offerData = synchronousPostJsonObject(toSendAnswersUrl, offerRequest);
    peerConnection.setRemoteDescription(offerData.offer).then(onOffer => {
        console.log("Remote offer is set to local connection!");
    });
    peerConnection.createAnswer().then(answer => {
        console.log("Answer created for the remote connection!");
        peerConnection.setLocalDescription(answer).then(value => {
            console.log("Answer applied as local description!");
            console.log("answer description %s", JSON.stringify(answer));
        });
    });
}