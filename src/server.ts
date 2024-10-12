import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import indexRouter from './routers/indexRouter';
import path from 'path';

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public/')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/', indexRouter);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Listening on PORT: ${PORT}`);
});
