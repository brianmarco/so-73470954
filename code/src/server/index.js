const express = require('express');
var session = require('express-session');
const https = require('node:https');
const fs = require('node:fs');
const path = require('node:path');
const app = express();
const port = 3000;

app.use(
  session({
    name: 'session-id',
    secret: 'hideSession',
    saveUninitialized: true,
    resave: false,
    httpOnly: true,
    cookie: {
      maxAge: 60 * 10000 * 200 * 10,
      sameSite: 'none',
      secure: true,
    },
  })
);

// app.use('/app', express.static(path.resolve('./src/public')));

app.get('/app', (req, res) => {
  const { session } = req;

  res.setHeader('Content-Type', 'text/html');
  res.write('<html><body>');
  res.write(`<p>Session ID: ${session.id}</p>`);

  if (session.views) {
    session.views++;
    res.write(`<p>Views: ${session.views}</p>`);
    res.write(`<p>Expires in: ${session.cookie.maxAge / 1000}s</p>`);
  } else {
    session.views = 1;
    res.write('<p>First visit. Hit refresh.</p>');
  }

  res.write('</body></html>');
  res.end();
});

// app.post('/api/save', (req, res) => {});

app.get('/', (req, res) => {
  res.send(`Hello World!`);
});

https
  .createServer(
    {
      key: fs.readFileSync(path.resolve('./ssl/key.pem')),
      cert: fs.readFileSync(path.resolve('./ssl/cert.pem')),
    },
    app
  )
  .listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
