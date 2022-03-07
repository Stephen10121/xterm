const http = require("http");
const express = require('express');
const socketio = require('socket.io');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const PORT = 5400;
const app = express();
const password = "123";

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', "*");
    res.setHeader('Access-Control-Allow-Headers', '*');
    next();
});

app.set('view engine', 'ejs');
app.use(express.json(), express.static('public'), express.urlencoded({ extended: true }));

const server = http.createServer(app);
const io = socketio(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

async function command(comm) {
  try {
      const { stdout, stderr } = await exec(comm);
      //console.log('stdout:', stdout);
    return stdout;
      //console.log('stderr:', stderr);
  }catch (err) {
     console.error(err.stderr);
    return err.stderr;
  };
};

app.get('/', (req, res) => res.render('index'));

app.post("/command", async (req, res) => {
  console.log(req.body);
  if (req.body.password !== password) {
    return res.json({msg: "Invalid password."});
  }
  const ans = await command(req.body.command);
  res.json({msg:ans});
});

io.on('connection', socket => {
    socket.emit("test", 200);
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}.`));