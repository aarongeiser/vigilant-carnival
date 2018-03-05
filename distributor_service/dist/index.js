"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const socketio = require("socket.io");
const VISUALIZERS = 'visualizers';
const VISUALIZATION_DURATION = 180000;
class App {
    constructor() {
        this.app = express();
        this.setAssets();
    }
    setAssets() {
        this.app.use(express.static(`${__dirname}/assets`));
        this.app.use(express.static(`${__dirname}/views`));
    }
}
App.PORT = 3001;
App.VISUALIZATION_DURATION = 180000;
const { app } = new App();
const server = app.listen(App.PORT, () => {
    console.log(`Distributor up and running on port: ${App.PORT}`);
});
const io = socketio(server);
const viz = io.of('/viz');
viz.on('connection', client => {
    client.emit('event', { message: 'connected to audio distributor' });
});
const inputs = io.of('/input');
inputs.on('connection', client => {
    console.log('I have an input...');
    client.emit('event', { message: 'You are now connected!' });
    client.on('input', data => {
        console.log({ data });
        viz.emit('input', data);
    });
});
const dist = io.of('/distributor');
dist.max_connections = 1;
dist.current_connections = 0;
dist.on('connection', function (d) {
    let timeout = null;
    if (this.current_connections >= this.max_connections) {
        dist.emit('disconnect', "I'm sorry, too many connections");
        d.disconnect();
    }
    else {
        this.current_connections++;
        d.on('audio', data => {
            viz.emit('audio', data);
        });
        d.on('disconnect', d => {
            viz.emit('down');
            this.current_connections--;
            clearTimeout(timeout);
        });
    }
});
//# sourceMappingURL=index.js.map