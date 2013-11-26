var express = require('express');
var caracolDB = require('./dbsetup.js').caracolDB;

// see https://github.com/michaelmunson1/Ghost/blob/master/core/server/models/post.js    
// we begin by writing individual models - if overlap is substantial, refactor out a base.js

// Also - write tests for basic functionality.  <-----

module.exports.User = Bookshelf.PG.Model.extend({
  tableName: 'users',
  hasTimestamps: true,
  
  permittedAttributes: [
    'id', 'uuid', 'name', 'isMember', 'joinedDate',  //'passwordSALT'
  ],

  //patterned after ghost's post.js - ll 33-38 - http://goo.gl/7KjRR0
  initialize: function(){
    this.on('creating', this.creating, this);
    this.on('saving', this.saving, this);
    this.on('saving', this.validate, this);
  },

  validate: function(){
     //TO DO
     //need to escape our text
  },

  saving: function(){
    this.attributes = this.pick(this.permittedAttributes); //pick: bookshelf provides?
    //need to do this for various fields? do this in validate:
    //this.set('title', this.sanitize('title').trim());
  },

  // account: function(){

  // },

  // login: function(){

  // },
  
  clippings: function(){
    return this.hasMany(Clipping);
  }
});


module.exports.Clipping = Bookshelf.PG.Model.extend({
  
  tableName: 'clippings',
  hasTimestamps: true,
  
  initialize: function(){
    this.on('creating', this.creating, this);
    this.on('saving', this.saving, this);
    this.on('saving', this.validate, this);
  },

  permittedAttributes: [
    'id', 'uuid', 'user', 'title', //'slug', //better understand - see ghost API, post.js, ll67-72
    'created_at', 'upvoteStatus', 'downvoteStatus', 'bookmarkStatus', 'lastBookmarkTime', 'lastUpvoteTime', 'lastDownvoteTime',  // 'last_update' - could also store history of upvotes and downvotes - not in mvp
    //'language' - not in mvp
    'word_count','total_pages', 'date_published', 'dek', 
    'lead_image_url',   // need this?
    'next_page_id', 'rendered_pages' //how to use - for i < rendered_pages {go to next page} ?
  ],

  validate: function(){
     //TO DO     <------<-------<------
     //need to escape our text
  },

  saving: function(){
    this.attributes = this.pick(this.permittedAttributes); //pick: bookshelf provides?
    //need to do this for various fields? do this in validate:
    //this.set('title', this.sanitize('title').trim());
  },

  users: function(){
    return this.hasMany(User);
  }
});