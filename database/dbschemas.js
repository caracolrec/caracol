var User,
    Users,
    Clipping,
    Clippings,
    express = require('express'),
    caracolPG = require('./dbsetup.js').caracolPG;

// require validator

// see https://github.com/michaelmunson1/Ghost/blob/master/core/server/models/post.js    
// we begin by writing individual models - if overlap is substantial, refactor out a base.js

// Also - write tests for basic functionality.  <-----

User = caracolPG.Model.extend({
  tableName: 'users',
  hasTimestamps: true,
  
  permittedAttributes: [
    'id',  'name', 'isMember', 'joinedDate',  //'passwordSALT'
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

  creating: function(){
    //TO DO
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




Clipping = caracolPG.Model.extend({
  
  tableName: 'clippings',
  hasTimestamps: true,
  
  initialize: function(){
    this.on('creating', this.creating, this);
    this.on('saving', this.saving, this);
    this.on('saving', this.validate, this);
  },

  permittedAttributes: [
    'id',  'title', 'content', //'slug', //better understand - see ghost API, post.js, ll67-72
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
  
  tableName: 'JournalEntries',
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
    return this.BelongsToOne(User);
  }
});


User_Clipping = caracolPG.Model.extend({
  tableName: 'User_Clippings',
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
  ]

});

Users = caracolPG.Collection.extend({
  model: User
});

Clippings = caracolPG.Collection.extend({
  model: Clipping
});

module.exports = {
  User: User,
  Users: Users,
  Clipping: Clipping,
  Clippings: Clippings
};

// module.exports.Forum = caracolPG.Model.extend({

// });

