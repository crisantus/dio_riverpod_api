require('dotenv').config();
require('express-async-errors');

const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs')
const swaggerDocument = YAML.load('./swagger.yaml');

const express = require('express');
const cors = require('cors'); //helps with ip address isues
const app = express();

const connectDB = require('./db/connect');
// routers
const authRouter = require('./routes/auth');
const tasksRouter = require('./routes/task');
const refreshTokenRouter = require('./routes/refreshTokenRoutes');
// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

const corsOptions = {
  origin: 'https://dio-task-manager.com', // specify the allowed origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // enable credentials (cookies, HTTP authentication)
  optionsSuccessStatus: 204, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('<h1>Tasks API<h1><a href="api-docs">Documentation</a>')
})

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument))
// routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/task', tasksRouter);
app.use('/api/v1/token', refreshTokenRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
