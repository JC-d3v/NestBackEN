
import { Manager, Socket } from 'socket.io-client';

export const connectToServer = () => {


  // const manager = new Manager('http://172.20.133.9:3000/socket.io/socket.io.js');
  const manager = new Manager('http://181.115.165.214:3000/socket.io/socket.io.js');

  const socket = manager.socket('/');
  console.log({ socket });

  addListeners(socket);

}

const addListeners = (socket: Socket) => {
  const serverStatusLabel = document.querySelector('#server-status')!;

  const clientsUl = document.querySelector('#clients-ul')!;

  // TODO: #clients-ul   
  socket.on('connect', () => {
    serverStatusLabel.innerHTML = 'Connected';
    // console.log('connected');
  });

  socket.on('disconnect', () => {
    serverStatusLabel.innerHTML = 'Disconnected';
    // console.log('disconnected');
  });

  socket.on('clients-updated', (clients: string[]) => {
    console.log({ clients });
    const clientsUl = document.querySelector('#clients-ul')!;
    let clientsHtml = '';
    clients.forEach(clientId => {
      clientsHtml += `
        <li>${clientId}</li>
      `
    });

    clientsUl.innerHTML = clientsHtml;

  });

}