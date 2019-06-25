const express = require('express');
const { getUsers, getUserById } = require('../controllers/');
const usersRouter = express.Router();

usersRouter.route('/').get(getUsers);

usersRouter.get('/:id', getUserById)

module.exports =  usersRouter;
