// @flow
/* eslint no-console: 0 */

import Hapi from 'hapi';
import Good from 'good';
import Boom from 'boom';

import eformTo311Url from './eforms';

const port = parseInt(process.env.PORT || '3000', 10);

export default async function start() {
  const server = new Hapi.Server();

  server.connection({ port }, '0.0.0.0');

  server.register({
    register: Good,
    options: {
      reporters: {
        console: [
          {
            module: 'good-squeeze',
            name: 'Squeeze',
            args: [
              {
                // Keep our health checks from appearing in logs
                response: { exclude: 'health' },
                log: '*',
              },
            ],
          },
          {
            module: 'good-console',
            args: [
              {
                color: process.env.NODE_ENV !== 'production',
              },
            ],
          },
          'stdout',
        ],
      },
    },
  });

  // eforms / Lagan redirects
  server.route({
    method: 'GET',
    path: '/Ef3/General.jsp',
    handler: (request, reply) => {
      try {
        console.log(request.params);
        reply.redirect(
          eformTo311Url(process.env.DESTINATION_BASE_URI, request.query.form)
        );
      } catch (e) {
        reply(e);
      }
    },
  });

  server.route({
    method: 'GET',
    path: '/Ef3/{formId}.xml',
    handler: (request, reply) => {
      try {
        reply.redirect(
          eformTo311Url(process.env.DESTINATION_BASE_URI, request.params.formId)
        );
      } catch (e) {
        reply(e);
      }
    },
  });

  server.route({
    method: 'GET',
    path: '/Ef3/{p*}',
    handler: (request, reply) => {
      reply(Boom.notFound());
    },
  });

  // General redirect to 311. Any SpotReporters URLs will be handled there.
  server.route({
    method: 'GET',
    path: '/{path*}',
    handler: (request, reply) =>
      reply.redirect(process.env.DESTINATION_BASE_URI + request.params.path),
  });

  server.route({
    method: 'GET',
    path: '/admin/ok',
    handler: (request, reply) => reply('ok'),
    config: {
      // mark this as a health check so that it doesn’t get logged
      tags: ['health'],
    },
  });

  await server.start();
  console.log(`> Ready on http://localhost:${port}`);
}
