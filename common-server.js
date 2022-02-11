
module.exports = {
  runServer: async (port, redis) => {
    const fastify = require("fastify")();
    const rateLimit = require("fastify-rate-limit");

    async function server() {
      fastify.register(rateLimit, {
        global: true,
        max: 1,
        timeWindow: 10 * 1000,
        redis,
        keyGenerator: (req) => req.headers['my-ip'],
      });

      fastify.get('/', async () => 'ok');

      await fastify.listen({ port });
    }

    await server();
  }
}
