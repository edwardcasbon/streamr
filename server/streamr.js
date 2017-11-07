class Streamr {
    constructor () {
        this.streams = [];
    }

    getStreams () {
        return this.streams;
    };

    getStream ( id ) {
        return this.streams.find(stream => {
            return stream.id === id;
        });
    };

    addClientToStream ( stream, id ) {
        let s = this.getStream(stream);

        if (s) {
            s.clients.push(id);
            return s;
        }

        const length = this.streams.push({
            id: stream,
            clients: [],
            url: null
        });
        return this.streams[length-1];
    };

    removeClientFromStream ( stream, id ) {
        const s = this.getStream(stream);

        if (!s) return;

        const index = s.clients.indexOf(id);
        if (index !== -1) {
            s.clients = s.clients.splice(index, 1);
        }
    };

    removeStream ( id ) {
        this.streams = this.streams.filter(stream => {
            return stream.id !== id;
        });
    };

    updateStreamUrl ( stream, url ) {
        const s = this.getStream(stream);

        if (s) {
            s.url = url;
        }
    };

    getClientInStream ( clients, streamId ) {
        const stream = this.getStream(streamId);
        const client = stream.clients[0];
        let streamClient = null;

        clients.forEach(c => {
            if (c.id === client) {
                streamClient = c;
            }
        });

        return streamClient;
    };

    getClientsInStream ( clients, streamId ) {
        const stream = this.getStream(streamId);
        const cIds = stream.clients;

        let cs = [];
        clients.forEach(c => {
            if (cIds.indexOf(c.id) !== -1) {
                cs.push(c);
            }
        });

        return cs;
    };
}

module.exports = Streamr;