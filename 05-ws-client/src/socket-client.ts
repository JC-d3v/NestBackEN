
import { Manager } from 'socket.io-client';

export const connectToServer = () => {


  const manager = new Manager('http://172.20.133.9:3000/socket.io/socket.io.js');

  const socket = manager.socket('/');
  console.log({ socket });

}