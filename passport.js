exports = module.exports = function(app, nconf, passport) {
  var FacebookStrategy = require('passport-facebook').Strategy;

  passport.use(new FacebookStrategy({
      clientID: nconf.get('facebook:app_id'),
      clientSecret: nconf.get('facebook:app_secret'),
      callbackURL: nconf.get('facebook:callback_url')
    },
    function(accessToken, refreshToken, profile, done) {
      var fb_user = profile._json;
      
      app.db.models.User.findOne({'fb.id': fb_user.id}, function(err, user) {
        if (err) {
          done(err);
          return;
        }

        if (user) {
          done(null, user);
        } else {
          app.db.models.User.createFromFacebook(fb_user, function(err, user) {
            if (err) {
              done(err);
              return;
            }
            done(null, user);
          });
        }
      });
    }
  ));

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    app.db.models.User.findById(id, function(err, user) {
      done(err, user);
    });
  });
}