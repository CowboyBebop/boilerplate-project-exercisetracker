const Users = require('../models/users');
const Exercises = require('../models/exercises');

const router = require('express').Router();

/*





*/



//create a user by posting form data username to /api/exercise/new-user
// will return an object with username and _id.
router.post("/new-user", async (req, res, next) => {
    

    let username = req.body;
    try {

        let user = await Users.findOne({ username: username });
        if (user) return next({status: 400, message: 'Username already taken'})

        let newUser = new Users({ username: username });
        await newUser.save();
        return res.json({username: newUser.username, _id: newUser._id})

    } catch (err) {
        console.log(err);
        return next(err);
    } 
})

//get an array of all users by getting api/exercise/users d
//with the same info as when creating a user.
//router.get()

//add an exercise to any user by posting form data userId(_id),
//description, duration, and optionally date to /api/exercise/add.
//If no date supplied it will use current date. 
//Returned will be the user object with also with the exercise fields added.
//router.post

//retrieve a full exercise log of any user by getting /api/exercise/log with a parameter of userId(_id).
//Return will be the user object with added array log and count (total exercise count).
//retrieve part of the log of any user by also passing along optional parameters of from & to or limit.
//(Date format yyyy-mm-dd, limit = int)
//router.get

module.exports = router