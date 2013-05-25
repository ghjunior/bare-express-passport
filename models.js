exports = module.exports = function(app, mongoose) {

  require('./schema/User')(app, mongoose);

}