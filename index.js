import Fastify from 'fastify'
const fastify = Fastify({
  logger: true
})

const clients = new Map();

// Declare a route
fastify.get('/sse', async function handler (request, reply) {
  clients.set(request.id, request);

  reply.raw.writeHead(200, {
    'Content-Type': 'text/event-stream',
      Connection: 'keep-alive',
    'Cache-Control': 'no-cache'
  })

  reply.raw.write(JSON.stringify({luiggy: 'senior'}));

  const interval = setInterval(()=>{
    reply.raw.write(JSON.stringify({date: new Date()}))
  }, 1000)

  request.raw.on('close', ()=>{
    clearInterval(interval)
  })

})

// Run the server!
try {
  await fastify.listen({ port: 3000 })
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}
