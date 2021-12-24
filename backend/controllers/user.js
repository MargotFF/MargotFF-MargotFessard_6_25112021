const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passwordValidator = require('password-validator');
const emailValidator = require('email-validator');

require('dotenv').config({ path: '../.env'});

const User = require('../models/user');

const passwordSchema = new passwordValidator();
passwordSchema
  .is().min(8)
  .is().max(50)
  .has().uppercase()
  .has().lowercase()
  .has().digits()
  .has().not().spaces();

exports.signup = (req, res, next) => {
  User.findOne({ email: req.body.email })
  .then(user => {
    if (user) {
      return res.status(400).json({ error });
    }
  });

  if (!emailValidator.validate(req.body.email)){
    return res.status(400).json({ message: 'The email format is not valid !' });
  }

  if (!passwordSchema.validate(req.body.password)){
    return res.status(400).json({ message: 'The password should contain at least 8 characters with at least 1 number, an uppercase and a lowercase, and should not contain any space !' });
  }

  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      });
      user.save()
        .then(() => res.status(201).json({ message: 'User created !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({ error });
      }
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign(
              { userId: user._id },
              process.env.SECRET_TOKEN,
              { expiresIn: '24h' }
            )
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};
