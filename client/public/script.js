const socket = new WebSocket('ws://localhost:3000');
const player = document.querySelector('audio');
const playlist = document.querySelectorAll('.playlist a');
const streamId = window.location.href.split('/').reverse().shift();

playlist.forEach(playlist => {
    playlist.addEventListener('click', e => {
        e.preventDefault();
        socket.send(JSON.stringify({
            type: 'STREAM_URL',
            data: {
                url: e.target.href,
                streamId
            }
        }))
    });
});

socket.addEventListener('open', event => {
    socket.send(JSON.stringify({
        type: 'STREAM_JOIN',
        data: {
            streamId
        }
    }));
});

socket.addEventListener('message', event => {
    message = JSON.parse(event.data);

    switch (message.type) {
        case 'STREAM_URL':
            console.log(`Update stream to '${message.data.url}'`);
            break;

        case 'STREAM_PLAY':
            console.log('Play stream');
            break;

        case 'STREAM_PAUSE':
            console.log('Pause stream');
            break;

        case 'STREAM_STOP':
            console.log('Stop stream');
            break;

        case 'STREAM_REQUEST_POSITION':
            console.log('Send current stream position (seek)')
            break;
    }
});