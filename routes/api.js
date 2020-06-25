const Users = require('../models/users');
const Exercises = require('../models/exercises');
const users = require('../models/users');

const router = require('express').Router();

//create a user by posting form data username to /api/exercise/new-user
// will return an object with username and _id.

router.post("/new-user", async (req, res, next) => {
    let newUsername = req.body.username;
    try {
        let user = await Users.findOne({ username: newUsername });
        if (user) return next({status: 400, message: 'Username already taken'})

        let newUser = new Users({ username: newUsername });
        await newUser.save();
        return res.json({username: newUser.username, _id: newUser._id})

    } catch (err) {
        console.log(err);
        return next(err);
    } 
})

//get an array of all users by getting api/exercise/users d
//with the same info as when creating a user.
router.get("/users",async (req, res, next) => {
  try {
    let allUsers = await Users.find({});
    res.json(allUsers);
  } catch (err) {
    console.log(err);
    return next(err);
  }  
});



//add an exercise to any user by posting form data userId(_id),
//description, duration, and optionally date to /api/exercise/add.
//If no date supplied it will use current date. 
//Returned will be the user object with also with the exercise fields added.
router.post("/add",async (req, res, next) => {

  let userId = req.body.userId;
  let description = req.body.description;
  let duration = req.body.duration;
  let date = req.body.date;

  try {
    const exercise = new Exercises(req.body)
    savedEx = await exercise.save();

    let ex = savedEx.toObject();

    return res.json({
      "_id": savedEx.userId,
      "username":savedEx.username,
      "date":(new Date(savedEx.date)).toDateString(),
      "duration": savedEx.duration,
      "description": savedEx.description
    })

  } catch (err) {
    console.log(err);
    return next(err);
  }
});

//retrieve a full exercise log of any user by getting /api/exercise/log with a parameter of userId(_id).
//Return the user object with added array log and count (total exercise count).
//retrieve part of the log of any user by also passing along optional parameters of from & to or limit.
//(Date format yyyy-mm-dd, limit = int)

router.get("/log", async (req, res, next) => {

  let userIdQuery = req.params.userId;
  let from = req.params.from;
  let to = req.params.to;
  let limit = req.params.limit;

  let dateFrom = new Date(from);
  let dateTo = new Date(to);

  try {
    //Find the user and their associated exercises
    let foundUser = await Users.findById(userIdQuery);

    let foundExercises = await Exercises.find({
      userId: req.query.userId,
      date: {
        $lte: dateTo.toISOString(),
        $gte: dateFrom.toISOString()
      }}, {
        __v: 0,
        _id: 0
      })
      .sort('-date')
      .limit(parseInt(limit));

    //filter using the other given parameters

    return res.json({
      "_id": foundUser._id,
      "username":foundUser.username,
      "count":foundExercises.length,
      log: exercises.map(e => ({
        description : foundExercises.description,
        duration : foundExercises.duration,
        date: foundExercises.date.toDateString()
        })
      )}
    );


  } catch (err) {
    console.log(err);
    return next(err);
  }

});

module.exports = router