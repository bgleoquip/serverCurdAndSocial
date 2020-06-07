const JWT = require('jsonwebtoken');
const userSchema = require('../schema/allSchema/userSchema');
const { JWT_SECRET } = require('../configuration');
const db = require("../db");
const Joi = require('joi');

signToken = user => {
  return JWT.sign({
    iss: 'bgbhavesh',
    sub: user.id,
    iat: new Date().getTime(), // current time
    exp: new Date().setDate(new Date().getDate() + 1) // current time + 1 day ahead
  }, JWT_SECRET);
}

module.exports = {
  signUp: async (req, res, next) => {
    const { email, password } = req.value.body;

    // Check if there is a user with the same email
    // let foundUser = await User.findOne({ "local.email": email });
    let foundUser = db.getDB().collection("user").find({ "local.email": email }).toArray((err,documents)=>{
        if(err)
            console.log(err);
        else{
            res.json(documents);
        }
    });
    if (foundUser) { 
      return res.status(403).json({ error: 'Email is already in use'});
    }

    // Is there a Google account with the same email?
    // foundUser = await User.findOne({ 
    //   $or: [
    //     { "google.email": email },
    //     { "facebook.email": email },
    //   ] 
    // });
    foundUser = db.getDB().collection("user").find({ 
        $or: [
          { "google.email": email },
          { "facebook.email": email },
        ] 
      }).toArray((err,documents)=>{
        if(err)
            console.log(err);
        else{
            res.json(documents);
        }
    });
    if (foundUser) {
      // Let's merge them?
      foundUser.methods.push('local')
      foundUser.local = {
        email: email, 
        password: password
      }
      await Joi.validate(userInput,userSchema,(err,result)=>{
        if(err){
            const error = new Error("Invalid Input");
            error.status = 400;
            next(error);
        }
        else{
            db.getDB().collection(collection).insertOne(userInput,(err,result)=>{
                if(err){
                    const error = new Error("Failed to insert Todo Document");
                    error.status = 400;
                    next(error);
                }
                else
                    res.json({result : result, document : result.ops[0],msg : "Successfully inserted Todo!!!",error : null});
            });
        }
    })    
      // Generate the token
      const token = signToken(foundUser);
      // Respond with token
      res.cookie('access_token', token, {
        httpOnly: true
      });
      res.status(200).json({ success: true });
    }

    // Is there a Google account with the same email?
    // foundUser = await User.findOne({ "facebook.email": email });
    // if (foundUser) {
    //   // Let's merge them?
    //   foundUser.methods.push('local')
    //   foundUser.local = {
    //     email: email, 
    //     password: password
    //   }
    //   await foundUser.save()
    //   // Generate the token
    //   const token = signToken(foundUser);
    //   // Respond with token
    //   res.status(200).json({ token });
    // }
    
    // Create a new user
    const newUser = new User({ 
      methods: ['local'],
      local: {
        email: email, 
        password: password
      }
    });

    await newUser.save();

    // Generate the token
    const token = signToken(newUser);
    // Send a cookie containing JWT
    res.cookie('access_token', token, {
      httpOnly: true
    });
    res.status(200).json({ success: true });
  },

  signIn: async (req, res, next) => {
    // Generate token
    const token = signToken(req.user);
    res.cookie('access_token', token, {
      httpOnly: true
    });
    res.status(200).json({ success: true });
  },

  signOut: async (req, res, next) => {
    res.clearCookie('access_token');
    // console.log('I managed to get here!');
    res.json({ success: true });
  },

  googleOAuth: async (req, res, next) => {
    // Generate token
    const token = signToken(req.user);
    res.cookie('access_token', token, {
      httpOnly: true
    });
    res.status(200).json({ success: true });
  },

  linkGoogle: async (req, res, next) => {
    res.json({ 
      success: true,
      methods: req.user.methods, 
      message: 'Successfully linked account with Google' 
    });
  },

  unlinkGoogle: async (req, res, next) => {
    // Delete Google sub-object
    if (req.user.google) {
      req.user.google = undefined
    }
    // Remove 'google' from methods array
    const googleStrPos = req.user.methods.indexOf('google')
    if (googleStrPos >= 0) {
      req.user.methods.splice(googleStrPos, 1)
    }
    await req.user.save()

    // Return something?
    res.json({ 
      success: true,
      methods: req.user.methods, 
      message: 'Successfully unlinked account from Google' 
    });
  },

  facebookOAuth: async (req, res, next) => {
    // Generate token
    const token = signToken(req.user);
    res.cookie('access_token', token, {
      httpOnly: true
    });
    res.status(200).json({ success: true });
  },

  linkFacebook: async (req, res, next) => {
    res.json({ 
      success: true, 
      methods: req.user.methods, 
      message: 'Successfully linked account with Facebook' 
    });
  },

  unlinkFacebook: async (req, res, next) => {
    // Delete Facebook sub-object
    if (req.user.facebook) {
      req.user.facebook = undefined
    }
    // Remove 'facebook' from methods array
    const facebookStrPos = req.user.methods.indexOf('facebook')
    if (facebookStrPos >= 0) {
      req.user.methods.splice(facebookStrPos, 1)
    }
    await req.user.save()

    // Return something?
    res.json({ 
      success: true,
      methods: req.user.methods, 
      message: 'Successfully unlinked account from Facebook' 
    });
  },

  dashboard: async (req, res, next) => {
    console.log('I managed to get here!');
    res.json({ 
      secret: "resource",
      methods: req.user.methods
    });
  },

  checkAuth: async (req, res, next) => {
    console.log('I managed to get here!');
    res.json({ success: true });
  }
}