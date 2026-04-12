# Broadcast Server

Simple Broadcast Server built with Node.js, TypeScript, and WebSockets.  
Supports real-time messaging between multiple clients with room-based communication.

---

## Features

- Real-time messaging via WebSockets
- Multiple clients support
- Room-based chat (e.g. #general, #random)
- Join/leave system messages
- CLI interface for server and clients
- In-memory storage

---

## Setup

git clone https://github.com/mykytapilec/broadcast-server.git
cd broadcast-server
npm install
npm run dev start

Server: ws://localhost:3000

---

## Usage

### Start server

broadcast-server start  
or  
npm run dev start  

---

### Connect client

broadcast-server connect  
or  
npm run dev connect  

---

### Example flow

Client 1:
Enter username: alex  
Enter room: general  

Client 2:
Enter username: bob  
Enter room: general  

Chat:
[alex]: hello  
[bob]: hi  

System:
⚡ alex joined #general  
⚡ bob joined #general  

---

## Notes

- Data resets on restart
- Messages are broadcast only within the same room
- Empty messages are ignored
- Each client connection is independent

---

## Project

https://roadmap.sh/projects/broadcast-server