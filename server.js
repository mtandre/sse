const path = require('path')
const events = require('events')
const eventEmitter = new events.EventEmitter()

const express = require('express')
const app = express()
const port = 8080;

setInterval(() => {
    console.log('tick')
    eventEmitter.emit('tick', new Date)
}, 1000);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
})

app.get('/stream', (req, res) => {
    req.socket.setTimeout(30*1000);
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });

    eventEmitter.on('tick', (d) => {
        res.write('id: ' + d.getTime() + '\n')
        res.write('data:' + d.toLocaleTimeString('en-US') + '\n\n')
        console.log('tick sent')
    })
    
    req.on("close", function() {
        console.log('close event');
    });
})

app.listen(port, () => console.log(`App listening on port ${port}!`))