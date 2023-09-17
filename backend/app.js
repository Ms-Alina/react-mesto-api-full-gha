// require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');

const { errors } = require('celebrate');
const cors = require('./middlewares/cors');
const auth = require('./middlewares/auth');
const handleError = require('./middlewares/handleError');
const authRouter = require('./routes/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const routes = require('./routes');

const { PORT = 3000 } = process.env;
const app = express();

// подключаемся к серверу mongo
mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  // useCreateIndex: true, // не работают в этой версии
  // useFindAndModify: false,  // не работают в этой версии
});

// парсим данные (собираем пакеты)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// для защиты приложения
app.use(helmet());
app.disable('x-powered-by'); // отключает заголовок X-Powered-By

app.use(requestLogger);

app.use(cors);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(authRouter);
app.use(auth);
app.use(routes);

app.use(errorLogger);

app.use(errors());
app.use(handleError);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
