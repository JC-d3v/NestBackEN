
import { Manager, Socket } from 'socket.io-client';

export const connectToServer = (token: string) => {


  // const manager = new Manager('http://172.20.133.9:3000/socket.io/socket.io.js');
  const manager = new Manager('http://181.115.165.214:3000/socket.io/socket.io.js', {
    extraHeaders: {
      hola: 'mundo',
      authentication: token
    }
    // path: '/socket.io' // default  is '/socket.io'   
  });

  const socket = manager.socket('/');
  console.log({ socket });

  addListeners(socket);

}

const addListeners = (socket: Socket) => {
  const serverStatusLabel = document.querySelector('#server-status')!;

  const clientsUl = document.querySelector('#clients-ul')!;

  const messageForm = document.querySelector<HTMLFormElement>('#message-form')!;
  const messageInput = document.querySelector<HTMLInputElement>('#message-input')!;

  const messagesUl = document.querySelector<HTMLUListElement>('#messages-ul')!;

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
    let clientsHtml = '';
    clients.forEach(clientId => {
      clientsHtml += `
        <li>${clientId}</li>
      `
    });

    clientsUl.innerHTML = clientsHtml;

  });


  messageForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (messageInput.value.trim().length <= 0) return;

    socket.emit('message-from-client', {
      id: 'yo',
      message: messageInput.value
    });
    console.log({ id: 'yo', message: messageInput.value });
    messageInput.value = '';
  });


  socket.on('message-from-server', (payload: { fullName: string, message: string }) => {

    const newMessage = `
    <li>
    <strong>${payload.fullName}</strong>
    <span>${payload.message}</span>
    </li>
  `;

    const li = document.createElement('li');
    li.innerHTML = newMessage;

    messagesUl.append(li);
  });

}