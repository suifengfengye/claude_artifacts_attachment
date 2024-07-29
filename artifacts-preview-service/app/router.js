module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.post('/getFrontendDist', controller.home.getFrontendDist);
};
