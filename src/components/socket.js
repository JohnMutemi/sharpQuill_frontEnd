import { io } from 'socket.io-client';

// Replace with your backend's socket server URL
const SOCKET_URL = 'http://127.0.0.1:5555';

// Initialize the socket connection
const socket = io(SOCKET_URL, {
  autoConnect: false, // Prevent socket from connecting automatically
});

// Function to connect to the socket
export const connectSocket = () => {
  if (!socket.connected) {
    socket.connect();
  }
};

// Function to disconnect from the socket
export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

// Function to join a specific order room for chatting
export const joinOrderRoom = (orderId) => {
  socket.emit('joinOrderRoom', orderId);
};

// Function to send a message to a specific order room
export const sendMessage = (orderId, message) => {
  socket.emit('sendMessage', { orderId, message });
};

// Listen for new messages from the server
export const onMessageReceived = (callback) => {
  socket.on('messageReceived', (message) => {
    callback(message);
  });
};

// Listen for support-related messages (help or support requests)
export const joinSupportRoom = () => {
  socket.emit('joinSupportRoom');
};

// Function to send a message in the support room
export const sendSupportMessage = (message) => {
  socket.emit('sendSupportMessage', message);
};

// Listen for new support messages from the server
export const onSupportMessageReceived = (callback) => {
  socket.on('supportMessageReceived', (message) => {
    callback(message);
  });
};

export default socket;
