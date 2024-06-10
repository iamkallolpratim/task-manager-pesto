const express = require('express');
const taskRoute = require('./task.route');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/tasks',
    route: taskRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
