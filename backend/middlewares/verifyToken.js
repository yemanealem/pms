require('dotenv').config()
const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
  let token = req.headers['authorization'];
  if (token) {
    token = token.split(' ')[1]
    jwt.verify(token, process.env.SECRET, (err, success) => {
      if (err) {
        res.status(401).send({ result: 'please provide a valid token' })
      } else {
        next()
      }
    })

  } else {
    res.status(403).send({ result: 'please provide a token' })
  }

}

module.exports = {verifyToken};