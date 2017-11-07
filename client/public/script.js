const socket = new WebSocket('ws://localhost:3000');
const player = document.querySelector('video');
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
            player.src = message.data.url;
            break;

        case 'STREAM_PLAY':
            console.log('Play stream');
            player.play();
            break;

        case 'STREAM_PAUSE':
            console.log('Pause stream');
            player.pause();
            break;

        case 'STREAM_STOP':
            console.log('Stop stream');
            player.pause();
            break;

        case 'STREAM_POSITION':
            console.log('Update position');
            player.currentTime = message.data.position;

        case 'STREAM_REQUEST_POSITION':
            console.log('Send current stream position (seek)');
            socket.send(JSON.stringify({
                type: 'STREAM_POSITION',
                data: {
                    streamId,
                    position: player.currentTime
                }
            }));
            break;
    }
});

player.addEventListener('play', e => {
    socket.send(JSON.stringify({
        type: 'STREAM_PLAY',
        data: {
            streamId
        }
    }));
});

player.addEventListener('pause', e => {
    socket.send(JSON.stringify({
        type: 'STREAM_PAUSE',
        data: {
            streamId
        }
    }));
});

player.addEventListener('seeked', e => {
    console.log('Seeked to ' + player.currentTime);
//     socket.send(JSON.stringify({
//         type: 'STREAM_POSITION',
//         data: {
//             streamId,
//             position: player.currentTime
//         }
//     }));
});