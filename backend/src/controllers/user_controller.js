const express = require('express');
const router = express.Router();

const userService = require('../services/user_service');
const { authentication } = require('../middlewares');

router.post('/', async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    const user = await userService.createUser(username, email, password);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
});

router.post('/auth', async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const user = await userService.authUser(username, password);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', authentication, async (req, res, next) => {
  const { id } = req.params;
  const input = req.body;

  try {
    const data = await userService.updateUser(id, input);

    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
});

router.get('/salt', async (req, res, next) => {
  const SALT = await userService.generateSALT();

  res.status(200).json({ SALT: SALT });
});

router.get('/:id', authentication, async (req, res, next) => {
  const { id } = req.params;

  try {
    const user = await userService.findUser(id);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
});

router.get('/', authentication, async (req, res, next) => {
  try {
    const users = await userService.listUsers();

    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', authentication, async (req, res, next) => {
  const { id } = req.params;

  try {
    const user = await userService.softDeleteUser(id);

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
