const mongoose = require('mongoose');
const { exists } = require('./users');
const Schema = mongoose.Schema;

Exercises = Schema({
    description:{
        type: String,
        required: true,
        maxlength: [30, 'description too long']
    },
    duration:{
        type: Number,
        required: true,
        min: [1, 'duration too short']
    },
    date: {
        type: Date,
        default: Date.now
      },
    username: String,
    userId: {
        type:String,
        ref: 'Users',
        index: true
    }
})

Exercises.pre('save', function(next) {
    mongoose.model('Users').findById(this.userId, (err, user) => {
      if(err) return next(err)
      
      //If there's no user in the user model, return an error
      if(!user) {
        const err = new Error('unknown userId')
        err.status = 400
        return next(err);
      }
      
      //if the user exists, check it's username and assign it in the Execrise document
      this.username = user.username

      if(!this.date) {
        this.date = Date.now();
      }
      next();
    });
  });
  
module.exports = mongoose.model('Exercises', Exercises);