const ws = require('ws')
const Koa = require('koa');

const app = new Koa();
const views = require('koa-views')
const koaStatic = require('koa-static')
const handleSocket = require('./handler.js')

app.use(views(__dirname + '/public'))
app.use(koaStatic(__dirname + '/public'))

app.use(async ctx => {
  await ctx.render('index.html')
});

app.listen(18089)


const wss = new ws.Server({ port: 8080 });

var connected = false
wss.on('connection', function connection(ws) {
  console.log('new connection')
  ws.on('message', (message) => {
    handleSocket(message)
  });
 
  ws.send('hi');
});