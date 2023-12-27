const toSendAnswersUrl = "/jm/"
let peerConnection;
let textOnlyChannel;
let meetingId;

function joinMeeting(username, meetingId, afterJoining) {
    // Calling the REST API TO fetch the TURN Server Credentials
    const iceServers = synchronousGetRequest("https://gkrao.metered.live/api/v1/turn/credentials?apiKey=a1946aafe661154c29c723787e22a49176de");
    // const iceServers = [{
    //     "urls": "stun:stun.relay.metered.ca:80"
    // }];
    const configuration = {
        iceServers: iceServers
    };
    peerConnection = new RTCPeerConnection(configuration);
    peerConnection.onicecandidate = ev => {
        if (peerConnection.iceGatheringState === "complete") {
            console.log("New ICE Candidate " + ev.candidate);
            console.log("local offer value %s", JSON.stringify(peerConnection.localDescription));
            const answerPostRequest = {
                "requestType": "takeMyAnswer",
                "meetingId": meetingId,
                "username": username,
                "answerData": peerConnection.localDescription
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
        console.log("Remote offer is set %", JSON.stringify(offerData.offer));
    });
    peerConnection.createAnswer().then(answer => {
        console.log("Answer created for the remote connection!");
        peerConnection.setLocalDescription(answer).then(value => {
            console.log("Answer applied as local description!");
            console.log("answer description %s", JSON.stringify(answer));
        });
    });
}