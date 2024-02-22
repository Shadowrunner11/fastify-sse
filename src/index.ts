import Fastify from 'fastify'
const fastify = Fastify({
  logger: true
})

const clients = new Map();

fastify.get('/connections', ()=>{
  return {
    numberOfConnections: clients.size
  }
})

fastify.get('/beli', ()=>{
  return {
    message: 'bebechita preciosa'
  }
})

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
    console.log('closing sse', request.id, [...clients.keys()])
    clearInterval(interval)
  })

})


fastify.listen({ port: 3000 })
  .catch(err=> {
    fastify.log.error(err)
    process.exit(1)
  })
