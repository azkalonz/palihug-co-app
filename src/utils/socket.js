import Socket from "socket.io-client";

const socket = Socket.connect("http://localhost:3001/");
export default socket;
