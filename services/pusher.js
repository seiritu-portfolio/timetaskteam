import Pusher from 'pusher-js';

const pusher = new Pusher(process.env.key, {
  cluster: process.env.cluster,
});

export default pusher;
