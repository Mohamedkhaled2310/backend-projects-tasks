const express = require('express'); 
const cookieParser = require('cookie-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const {Server}  = require('socket.io');
const http = require('http');
const authRouter = require('./routes/auth');
const authMiddlware = require("./middleware/authMiddleware");
const projectRouter = require('./routes/projectRoutes');
const taskRouter = require('./routes/taskRoutes');

dotenv.config();
const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL;
const CLIENT_URL = process.env.CLIENT_URL;

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({origin:CLIENT_URL,credentials:true}));

mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: CLIENT_URL,
        methods: ["GET", "POST"],
        credentials: true
    }
});
io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('join_room', (data) => {
        socket.join(data);
        console.log(`User with ID: ${socket.id} joined room: ${data}`);
    });

    socket.on('taskMoved', (data) => {
        socket.to(data.room).emit('taskCreated', data);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

app.use('/',authRouter);
app.use('/projects',authMiddlware,projectRouter);
app.use('/tasks',authMiddlware,taskRouter);
