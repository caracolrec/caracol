
/*
 * GET home page.
 */

exports.render = function(req, res){
  res.render('index', { 
      title: 'caracol',
      user: req.user ? JSON.stringify(req.user) : "null"
    });
};