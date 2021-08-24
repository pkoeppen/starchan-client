import io from 'socket.io-client';

export default function ({ $config }, inject) {
  const socket = io.connect($config.socketUrl, {
    path: '/',
    autoConnect: false,
  });

  if (process.env.NODE_ENV === 'local') {
    // Dev logger.
    socket.onAny((event, ...args) => {
      console.log(`dev: ${event}:`, JSON.stringify(args, null, 2));
    });
  }

  inject('socket', socket);
}
