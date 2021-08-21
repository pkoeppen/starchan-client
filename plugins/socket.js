import io from 'socket.io-client';

const socket = io.connect(`http://local.starchan.org:3002`, {
  autoConnect: false,
});

// Dev logger.
socket.onAny((event, ...args) => {
  console.log(`dev: ${event}:`, JSON.stringify(args, null, 2));
});

export default function (context, inject) {
  inject('socket', socket);
}
