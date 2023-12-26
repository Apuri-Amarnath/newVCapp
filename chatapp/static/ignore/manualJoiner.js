const remotePeerOffer = {
    "type": "offer",
    "sdp": "v=0\r\no=mozilla...THIS_IS_SDPARTA-99.0 1820035646517000043 0 IN IP4 0.0.0.0\r\ns=-\r\nt=0 0\r\na=fingerprint:sha-256 FA:3B:95:CE:72:2D:3D:BD:31:C6:26:CB:6E:62:F0:FA:EC:FF:15:A9:AF:1A:3B:E8:02:30:E3:86:1C:E2:22:78\r\na=group:BUNDLE 0\r\na=ice-options:trickle\r\na=msid-semantic:WMS *\r\nm=application 9 UDP/DTLS/SCTP webrtc-datachannel\r\nc=IN IP4 0.0.0.0\r\na=sendrecv\r\na=ice-pwd:b1badfa34e1d4a01b24831206158c9d2\r\na=ice-ufrag:eaa08ba7\r\na=mid:0\r\na=setup:actpass\r\na=sctp-port:5000\r\na=max-message-size:1073741823\r\n"
}

const peerConnection = new RTCPeerConnection();
peerConnection.onicecandidate = ev => {
    console.log("New ICE Candidate " + ev.candidate);
    console.log("offer value %s", JSON.stringify(peerConnection.localDescription));
};
peerConnection.ondatachannel = ev => {
    peerConnection.dataChannel = ev.channel;
    peerConnection.dataChannel.onopen = openEv => {
        console.log("Connection opened");
    };
    peerConnection.dataChannel.onmessage = msgEv => {
        console.log("Received msg from remote %s\n\t%s", msgEv.origin, msgEv.data);
    };
};
peerConnection.setRemoteDescription(remotePeerOffer).then(onOffer => {
    console.log("Remote offer is set to local connection!");
});
peerConnection.createAnswer().then(answer => {
    console.log("Answer created for the remote connection!");
    peerConnection.setLocalDescription(answer).then(value => {
        console.log("Answer applied as local description!");
        console.log("answer description %s", JSON.stringify(answer));
    });
});