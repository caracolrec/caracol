var User,
    Users,
    Clipping,
    Clippings,
    JournalEntry,
    User_Clipping,
    User_Clippings,
    Recommendation,
    Recommendations,
    caracolPG = require('./dbsetup.js').caracolPG,
    crypto = require('crypto');


// require validator

// see https://github.com/michaelmunson1/Ghost/blob/master/core/server/models/post.js    
// we begin by writing individual models - if overlap is substantial, refactor out a base.js

// Also - write tests for basic functionality.  

User = caracolPG.Model.extend({
  tableName: 'users',
  hasTimestamps: true,
  
  permittedAttributes: [
  //TODO: add hashed_password to User tabel in database
    'id',  'username', 'isMember', 'joinedDate',  'passwordSALT', 'hashed_password'
  ],

  //patterned after ghost's post.js - ll 33-38 - http://goo.gl/7KjRR0
  initialize: function(){
    this.on('creating', this.creating, this);
    this.on('saving', this.saving, this);
    this.on('saving', this.validate, this);
  },

  validate: function(){
     //TO DO
     //need to escape our text    <-- npm validator
  },

  saving: function(){
    this.attributes = this.pick(this.permittedAttributes); //pick: bookshelf provides?
    //need to do this for various fields? do this in validate:
    //this.set('title', this.sanitize('title').trim());
  },

  //this could eventually go on a base model <--------
  findOne: function(userObj, authCallback){
    new User(userObj)
    .fetch()
    .then(function(model){
      console.log('its good', model);
      authCallback(null, model);
    }, function(err){
      authCallback(err, null);
    });
  },

  creating: function(){
    //TO DO
  },

  makeSalt: function(){
    return Math.round((new Date().valueOf() * Math.random())) + '';
  },
  
  encryptPassword: function(password, salt){
    if (!password) { return ''; }
    salt = salt || this.makeSalt();
    var hashed_password = crypto.createHmac('sha1', salt).update(password).digest('hex');
    return {passwordSALT: salt, hashed_password: hashed_password};
  },
  
  check: function(userdata){
    //TODO auth with email
    this.forge({username: userdata.username}).fetch()
    .then(function(user){
      if (!user){
        //TODO and we communicate this to the user like how?
        throw 'error: that username does not exist';
      } else {
        if (this.encryptPassword(userdata.password, user.passwordSALT) === user.hashed_password){
          console.log('party on wayne');
        } else {
          throw 'error: incorrect password';
        }
      }
    })
    .then(function(){
      return this.encryptPassword(userdata.password);
    }).then(function(hash){
      userdata.password = hash.hashed_password;
      userdata.passwordSALT = hash.passwordSALT;
    });
  },

  // account: function(){

  // },

  // login: function(){

  // },
  
  clippings: function(){
    return this.hasMany(Clipping);
  }
  
  //not in mvp
  // fora: function(){
  //   return this.hasMany(Forum);
  // }

});

var a = new User();

console.log(a.encryptPassword('target'));


Clipping = caracolPG.Model.extend({
  
  tableName: 'clippings',
  hasTimestamps: true,
  
  initialize: function(){
    this.on('creating', this.creating, this);
    this.on('saving', this.saving, this);
    this.on('saving', this.validate, this);
  },

  permittedAttributes: [

    'id',  'title', 'uri', 'content', //'slug', //better understand - see ghost API, post.js, ll67-72
    'first_insert',    // can just use native db tstamp? - this is distinguished from date_published
    //'language' - not in mvp
    'word_count','total_pages', 'date_published', 'dek',
    'lead_image_url',   // need this?
    'next_page_id', 'rendered_pages' //how to use - for i < rendered_pages {go to next page} ?
  ],

  validate: function(){
     //TO DO     <------<-------<------
     //need to escape our text
  },

  creating: function(){
    //TO DO
  },

  saving: function(){
    this.attributes = this.pick(this.permittedAttributes); //pick: bookshelf provides?
    //need to do this for various fields? do this in validate:
    //this.set('title', this.sanitize('title').trim());
  },

  clippers: function(){
    return this.belongsToMany(User);
  }
});

JournalEntry = caracolPG.Model.extend({
  
  tableName: 'journal_entries',
  hasTimestamps: true,
  
  initialize: function(){
    this.on('creating', this.creating, this);
    this.on('saving', this.saving, this);
    this.on('saving', this.validate, this);
  },

  //title, content, date_published
  permittedAttributes: [
    'id',  'user_id', 'title', 'content', //'slug', //better understand - see ghost API, post.js, ll67-72
    'first_insert',    // can just use native db tstamp?
    // not mvp: 'language'  
    'word_count', 'date_published', 'last_update', 'dek'  //summary?
    //  Database
    //  not mvp: 'lead_image_url',   // need this?
    //  not mvp: 'next_page_id', 'rendered_pages' //how to use - for i < rendered_pages {go to next page} ?
  ],

  validate: function(){
     //TO DO     <------<-------<------
     //need to escape our text
  },

  creating: function(){
    //TO DO
  },

  saving: function(){
    this.attributes = this.pick(this.permittedAttributes); //pick: bookshelf provides?
    //need to do this for various fields? do this in validate:
    //this.set('title', this.sanitize('title').trim());
  },

  author: function(){
    return this.belongsTo(User);
  }
});


User_Clipping = caracolPG.Model.extend({
  tableName: 'user_clippings',
  hasTimestamps: true,
  initialize: function(){
    this.on('creating', this.creating, this);
    this.on('saving', this.saving, this);
    this.on('saving', this.validate, this);
  },
  //use created_at from insert into clippings
  permittedAttributes: [
  'id',  'user_id', 'clipping_id',    //'created_at',
  'vote', 'bookmarkStatus', 'lastBookmarkTime',
  'lastVoteTime'  // 'last_update' - could also store history of upvotes and downvotes - not in mvp
  ],
  validate: function(){
     //TO DO     <------<-------<------
     //need to escape our text
  },

  creating: function(){
    //TO DO
  },

  saving: function(){
    this.attributes = this.pick(this.permittedAttributes); //pick: bookshelf provides?
    //need to do this for various fields? do this in validate:
    //this.set('title', this.sanitize('title').trim());
  },
  clipping: function() {
    return this.belongsTo(Clipping);
  }

});

Recommendation = caracolPG.Model.extend({
  tableName: 'recommendations',
  hasTimestamps: true,
  initialize: function() {
    this.on('creating', this.creating, this);
    this.on('saving', this.saving, this);
    this.on('saving', this.validate, this);
  },

  permittedAttributes: [
    'id', 'user_id', 'clipping_id', 'rank', 'computed_at'
  ],

  validate: function(){
     //TO DO     <------<-------<------
     //need to escape our text
  },

  creating: function(){
    //TO DO
  },

  saving: function(){
    this.attributes = this.pick(this.permittedAttributes); //pick: bookshelf provides?
    //need to do this for various fields? do this in validate:
    //this.set('title', this.sanitize('title').trim());
  },

  clipping: function() {
    return this.belongsTo(Clipping);
  }
});

Users = caracolPG.Collection.extend({
  model: User
});

Clippings = caracolPG.Collection.extend({
  model: Clipping
});

Recommendations = caracolPG.Collection.extend({
  model: Recommendation
});

User_Clippings = caracolPG.Collection.extend({
  model: User_Clipping
});

module.exports = {
  User: User,
  Users: Users,
  Clipping: Clipping,
  Clippings: Clippings,
  User_Clipping: User_Clipping,
  Recommendation: Recommendation,
  Recommendations: Recommendations,
  User_Clippings: User_Clippings
};

// module.exports.Forum = caracolPG.Model.extend({

// });

