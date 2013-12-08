
exports.hasAuthorization = function(req, res, next) {
  if (!req.session || !req.session.auth || !req.session.id) {
    return res.send(401, 'User is not authorized');
  } else {
    console.info('Access USER: ' + req.session.id);
    next();
  }
};
