const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const fs = require('fs');
io.on('connection', (socket) => {
    console.log("Co nguoi connect ne");
    socket.on('clientSendItems', (arg) => {
        fs.readFile('items.json', (err, data) => {
           if (err) throw err;
           let items = JSON.parse(data);
           io.emit('serverSendItems', items);
        });
    });
    socket.on('clientSendItem', (arg) => {
        let data = JSON.stringify(arg, null, 2);
        fs.writeFile('item.json', data, (err) => {
            if (err) throw err;
            console.log(arg);
        });
    });
});
server.listen(3001);