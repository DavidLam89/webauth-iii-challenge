const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const server = express();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secret = require('./secrets').jwtSecret; 
const Users = require('../users/users-model.js');

server.use(helmet());
server.use(express.json());
server.use(cors());

server.post('/api/register', (req, res) => {
  let user = req.body;
  user.password = bcrypt.hashSync(user.password, 10); 

  Users.add(user)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

server.post('/api/login', (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = generateToken(user);

        res.status(200).json({
          message: `Welcome ${user.username}!`,
          token,
        });
      } else {
        res.status(401).json({ message: 'You shall not pass!' });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

server.get('/api/users', restricted, (req, res) => {

  Users.findById(req.decodedJwt.subject).then(user => {
    Users.findBy({department:user.department})
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
  });
});

function generateToken(user) {
  const payload = {
    subject: user.id
  };

  const options = {
    expiresIn: 300,
  };

  return jwt.sign(payload, secret, options);
}

function restricted(req, res, next) {
  const token = req.headers.authorization;

  if (token) {
    jwt.verify(token, secret, (error, decodedToken) => {
      if (error) {
        res.status(401).json({ message: 'You shall not pass!' });
      } else {
        req.decodedJwt = decodedToken;
        next();
      }
    });
  } else {
    res.status(401).json({ message: 'You shall not pass!' });
  }
};

module.exports = server;
