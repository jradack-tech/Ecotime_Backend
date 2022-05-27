const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const axios = require('axios');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');

// @route    GET api/auth
// @desc     Get user by token
// @access   Private
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    POST api/auth
// @desc     Authenticate user & get token
// @access   Public
router.post(
  '/',
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists(),
  async (req, res) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      const payload = {
        user: {
          id: user.id
        }
      };

      // *****
      var txs = await getTransactions(user.address);

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: '5 days' },
        (err, token) => {
          if (err) throw err;
          console.log(user)
          res.json({
             name: user.name,
             email: user.email,
             address: user.address,
             bank: user.bank,
             createdAt: user.date,
             txs: txs,
             token
          });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

const getTransactions = async (address) => {
  var result = await axios.get(`https://api-kovan.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=8WFP5G32ZKUUVWVTRYPBQYETBKE6VIKFNZ`);
  // console.log(result.data.result)  
  var temp = [...result.data.result]
  var txs = [];
  var trader;
  for (var i = 0; i < result.data.result.length; i ++) {
    if (temp[i].from === address) {
      trader = await User.findOne({address: temp[i].to});
      if (trader) {
        console.log("1")
        txs.push({
                  ...temp[i],
                  trader: {
                    name: trader.name,
                    email: trader.email,
                    address: trader.address,
                    bank: trader.bank
                  }
                })
      } else {
        txs.push(temp[i])
      }
    } else {
      // var tem = `${temp[i].from}`
      trader = await User.findOne({address: temp[i].from});
      console.log('2', trader , temp[i].from)
      if (trader) {
        txs.push({
                  ...temp[i],
                  trader: {
                    name: trader.name,
                    email: trader.email,
                    address: trader.address,
                    bank: trader.bank
                  }
                })
      } else {
        txs.push(temp[i])
      }
    }
  }

  return txs;
}

module.exports = router;
