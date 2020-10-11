const dotenv = require('dotenv')
dotenv.config();

const bodyParser = require('body-parser');
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('./bin/logger');

const slackRequest = require('./middleware/slackRequest');

const indexRouter = require('./routes/index');
const eventsRouter = require('./routes/events');

const rawBodySaver = function (req, res, buf, encoding) {
  if (buf && buf.length) {
    req.rawBody = buf.toString(encoding || 'utf8');
  }
}


let app = express();

app.use(bodyParser.urlencoded({verify: rawBodySaver, extended: true }));
app.use(bodyParser.json({ verify: rawBodySaver }));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.use(logger);
app.use(slackRequest);
app.use('/', indexRouter);
app.use('/events', eventsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.json({error: err.message})
});

module.exports = app;
