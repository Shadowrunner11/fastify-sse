'use strict';

Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fastify_1 = tslib_1.__importDefault(require("fastify"));
const fastify = (0, fastify_1.default)({
    logger: true
});
const clients = new Map();
// Declare a route
fastify.get('/sse', function handler(request, reply) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        clients.set(request.id, request);
        reply.raw.writeHead(200, {
            'Content-Type': 'text/event-stream',
            Connection: 'keep-alive',
            'Cache-Control': 'no-cache'
        });
        reply.raw.write(JSON.stringify({ luiggy: 'senior' }));
        const interval = setInterval(() => {
            reply.raw.write(JSON.stringify({ date: new Date() }));
        }, 1000);
        request.raw.on('close', () => {
            console.log('closing sse', request.id, [...clients.keys()]);
            clearInterval(interval);
        });
    });
});
// Run the server!
try {
    fastify.listen({ port: 3000 })
        .catch(err => {
        fastify.log.error(err);
        process.exit(1);
    });
}
catch (err) {
    fastify.log.error(err);
    process.exit(1);
}
