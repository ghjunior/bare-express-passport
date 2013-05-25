exports = module.exports = function(app, mongoose) {

  var userSchema = new mongoose.Schema({
      username  : { type: String, lowercase: true, trim: true, index: { unique: true, sparse: true } }
    , type      : { type: String, required: true, enum: ['invited', 'welcomed', 'user'] }
    , created   : { type: Date, default: Date.now }
    , fb : {
          id          : { type: String, index: { unique: true } } 
        , name        : { type: String }
        , email       : { type: String }
        , first_name  : { type: String }
        , last_name   : { type: String }
        , link        : { type: String }
        , gender      : { type: String }
        , timezone    : { type: Number }
        , locale      : { type: String }
        , verified    : { type: Boolean }
        , update_time : { type: Date }
      }
  });

  userSchema.statics.createFromFacebook = function (fb_user, callback) {
    var props = {
        type: 'welcomed'
      , fb: {
          id: fb_user.id
        , name: fb_user.name
        , first_name: fb_user.first_name
        , last_name: fb_user.last_name
        , link: fb_user.link
        , gender: fb_user.gender
        , email: fb_user.email
        , timezone: fb_user.timezone
        , locale: fb_user.locale
        , verified: fb_user.verified
        , updated_time: fb_user.updated_time
      }
    };

    this.create(props, callback);
  }

  userSchema.set('autoIndex', (app.get('env') == 'development'));

  app.db.model('User', userSchema);

}