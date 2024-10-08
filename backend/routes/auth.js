const express = require('express');
const router = express.Router();
const User = require('../models/User')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = 'goodmorning'

//Route 1: Creating a user using: POST "/api/auth/createuser". no login required 
router.post('/createuser', [
      body('name', 'Name is Less than 3 characters').isLength({ min: 3 }),
      body('email', 'Enter a valid email address').isEmail(),
      body('password', 'Password must be 5 characters').isLength({ min: 5 })
], async (req, res) => {
      let success = false;
      //if there is an error then return bad request and error message
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
            success = false;
            return res.status(400).json({ success, errors: errors.array() })
      }


      //Check whether any user with this email already exists
      try {
            success = true;
            let user = await User.findOne({ email: req.body.email })
            if (user) return res.status(400).json({ success, error: 'One user is already exists with this email address. Try another ' })

            const salt = await bcrypt.genSalt(10);
            const secPass = await bcrypt.hash(req.body.password, salt);
            //creating a new user
            user = await User.create({
                  name: req.body.name,
                  email: req.body.email,
                  password: secPass
            })
            // .then(user => res.json(user))
            // .catch(err => {
            //       console.log(err)
            //       res.json({ error: 'Enter unique value for email', message: err.message })
            // })
            const data = {
                  user: {
                        id: user.id
                  }
            }
            const authtoken = jwt.sign(data, JWT_SECRET)
            // console.log(jwtData)
            // res.json(user)
            success = true;
            res.json({ success, authtoken })
      } catch (error) {
            console.error(error.message)
            res.status(500).send('Internal Serer Error')
      }
})

//Route 2: Authenticate a user using: POST "/api/auth.login". No login required
router.post('/login', [
      body('email', 'Enter a valid email address').isEmail(),
      body('password', 'Password can not be blank').exists()
], async (req, res) => {
      let success = false
      //if there is an error then return bad request and error message
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
      }

      const { email, password } = req.body;
      try {
            let user = await User.findOne({ email })
            if (!user) {
                  success = false
                  return res.status(400).json({ success, error: "Try to login with correct credentials" })
            }

            const passwordCompare = await bcrypt.compare(password, user.password);
            if (!passwordCompare) {
                  success = false
                  return res.status(400).json({ success, error: "Try to login with correct credentials" })
            }
            const data = {
                  user: {
                        id: user.id
                  }
            }
            const authtoken = jwt.sign(data, JWT_SECRET)
            success = true
            res.json({ success, authtoken })
      } catch (error) {
            console.error(error.message)
            res.status(500).send('Internal Server Error')
      }

})

//Route 3: Get loggedin user details using: POST "/api/auth/getuser". Login required
router.post('/getuser', fetchuser, async (req, res) => {
      try {
            const userId = req.user.id;
            const user = await User.findById(userId).select("-password")
            res.send(user)

      } catch (error) {
            console.error(error.message)
            res.status(500).send('Internal Server Error')
      }

})
module.exports = router