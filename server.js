const jsonServer = require('json-server')

const routes = jsonServer.router('./db.json')
const middlewares = jsonServer.defaults()

const server = jsonServer.create()

server.use(middlewares)
server.use(routes)

server.listen(9090)
