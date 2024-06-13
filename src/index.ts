import {Hono} from 'hono'

const app = new Hono()

app.get('/', (c) => {
    return c.text('Hello World');
});

const server = Bun.serve({
    fetch(req, server) {
        if (server.upgrade(req)) {
          return; // do not return a Response
        }
        return app.fetch(req, server);
    },
    websocket: {
      message(ws, message) {
        ws.publishText('chat',String(message),true)
      }, // a message is received
      open(ws) {
        ws.subscribe('chat')
        ws.publishText('chat',`入室:${ws.remoteAddress}`,true)
        ws.sendText(`${ws.remoteAddress}`)
      }, // a socket is opened
      close(ws, code, message) {}, // a socket is closed
      drain(ws) {}, // the socket is ready to receive more data
    },
    development:true
})
console.log(server.url.href)