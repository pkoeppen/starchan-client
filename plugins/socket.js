import io from 'socket.io-client';

const socket = io.connect(`http://local.starchan.org:3002`, {
  autoConnect: false,
});

// Dev logger.
socket.onAny((event, ...args) => {
  console.log(event, args);
});

export default function (context, inject) {
  inject('socket', socket);
}
