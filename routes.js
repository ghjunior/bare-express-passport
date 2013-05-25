exports = module.exports = function(app, passport, mongoose) {

  app.get('/', function(req, res){
    res.render('index');
  });

  app.get('/home', ensureAuthenticated, function(req, res){
    res.render('home', { user: req.user });
  });

  app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });

  // Passport routes
  app.get('/auth/facebook', passport.authenticate('facebook'));
  app.get('/auth/facebook/callback', 
    passport.authenticate('facebook', { successRedirect: '/home',
                                        failureRedirect: '/' }));

  // Ze 404
  app.use(function(req, res, next){
    res.send(404, '<center><img src="/mo.jpg" /><p>The Mo says no, page not found.</p></center>');
  });

  // Simple route middleware to ensure user is authenticated.
  //   Use this route middleware on any resource that needs to be protected.  If
  //   the request is authenticated (typically via a persistent login session),
  //   the request will proceed.  Otherwise, the user will be redirected to the
  //   login page.
  function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/');
  }

}