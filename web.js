// Dependencies
var express = require('express')
  , cons = require('consolidate')
  , mongoStore = require('connect-mongo')(express)
  , http = require('http')
  , path = require('path')
  , passport = require('passport')
  , mongoose = require('mongoose')
  , errors = require('./errors')
  , nconf = require('nconf');

// Fire up express
var app = express();

// Fire up nconf
nconf.argv()
  .env()
  .file({ file: 'conf/' + app.get('env') + '.json' });

// Fire up mongo
app.set('mongodb-uri', process.env.MONGOHQ_URL || nconf.get('mongo:uri'));

app.db = mongoose.createConnection(app.get('mongodb-uri'));
app.db.on('error', console.error.bind(console, 'mongoose connection error: '));
app.db.once('open', function () {
  console.log('sweet, mongoose ready');
});

// Models config
require('./models')(app, mongoose);

// Passport config
require('./passport')(app, nconf, passport);

// Express config
app.configure(function(){

  app.engine('html', cons.ejs);

  app.set('view engine', 'html');
  app.set('views', __dirname + '/views');

  app.use(express.static(__dirname + '/public'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ 
    secret: 'shhh',
    store: new mongoStore({ url: app.get('mongodb-uri') })
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(errors.logErrors);
  app.use(errors.clientErrorHandler);
  app.use(errors.errorHandler);

});

app.configure('development', function(){
  app.use(express.logger('dev'));
  app.use(express.errorHandler());
});

// Routes
require('./routes')(app, passport, mongoose);

// And finally kick it all off
var port = process.env.PORT || 5000;
app.listen(port);
console.log('Express app started on port ' + port);