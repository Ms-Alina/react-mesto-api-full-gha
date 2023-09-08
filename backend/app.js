require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');

const { errors } = require('celebrate');
const cors = require('./middlewares/cors');
const { createUser, login } = require('./controllers/users');
const {
  validationCreateUser,
  validationLogin,
} = require('./middlewares/validation');
const auth = require('./middlewares/auth');
const handleError = require('./middlewares/handleError');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const routes = require('./routes');

const { PORT = 3000 } = process.env;
const app = express();

// парсим данные (собираем пакеты)
app.use(bodyParser.json());

// для защиты приложения
app.use(helmet());
app.disable('x-powered-by'); // отключает заголовок X-Powered-By

app.use(cors);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(requestLogger);

app.post('/signin', validationLogin, login);
app.post('/signup', validationCreateUser, createUser);

app.use(auth);
app.use(routes);

app.use(errorLogger);

app.use(errors());
app.use(handleError);

// подключаемся к серверу mongo
mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  // useCreateIndex: true, // не работают в этой версии
  // useFindAndModify: false,  // не работают в этой версии
});

// app.post('/signin', validationLogin, login);
// app.post('/signup', validationCreateUser, createUser);

// роуты
// app.use(auth);
// app.use(routes);
// app.use(errors());
// app.use(handleError);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
