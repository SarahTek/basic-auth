const { Users } = require('../../models/index');
const express = require('express');
const bcrypt = require('bcrypt');

const router = express.Router();


async function signupUser(req, res) {

  try {
    let obj = req.body;
    const doesNameExists = await Users.model.findOne({
      where: { username: req.body.username },
    });
    if ( doesNameExists === null){
      let newUsers = await Users.create(obj);
      res.status(200).json(newUsers);

    }else {
      res.status(500).send(`cannot create user ${req.body.username}`);
    }
  }catch (e) {
    console.log(e);
  }
}


async function signinUser (req, res) {
  try {
    const user = await Users.model.findOne ({
      where: { username: req.body.username },

    });

    const isValid = await bcrypt.compare(req.body.password, user.password);
    if (isValid){
      res.status(200).send({ user: user.username, token: user.token });
      return;
    }
  }catch (e) {
    res.status(500);
  }
  res.status(403).send('Invalid username/pasword. Too bad we don\'t have an account recovery mechanism');
}
router.post('/signup', signupUser);
router.post('/signin', signinUser);


module.exports = router;
