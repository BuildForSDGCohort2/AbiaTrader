import jwt from 'jsonwebtoken';
import debug from 'debug';
import bcrypt from 'bcrypt';
import pool from '../database/dbconnect';
import configuration from '../config/config';
import sendEmail from '../config/emailer';

export default {
  upload: (req, res) => {
    if(req.file){
      console.log(req.file) // to see what is returned to you
      return res.jsend.success(req.file.url);  
    }
  },

  signup: async (req, res) => {
    // check if user is admin
    const {
      name, bus_name, email, password, phone, address, bus_desc,
    } = req.body;
    try{
      const photo = req.file.url;
      await pool.query('SELECT email FROM trader WHERE email = $1 OR phone = $1', [email],  async (error, results) => {
      // user does not exist
        if (results.rows[0] === undefined) {
          await pool.query('INSERT INTO trader ( name, bus_name, email, phone, password, address, bus_description, photourl)'+
          ' VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, isAdmin', [ name, bus_name, email,  phone, await bcrypt.hash(password, 10), address, bus_desc, photo],  (err, result) => {
          // signin jwt and wrap in a cookie
          const token = jwt.sign({ userId: result.rows[0].id }, process.env.SECRET ? process.env.SECRET : configuration.SECRET);
          res.cookie('userid', result.rows[0].id, { expires: new Date(Date.now() + 3600000), httpOnly: true });
          res.cookie('token', token, { expires: new Date(Date.now() + 3600000), httpOnly: true });
          if(!err){
            return res.jsend.success({
              message: 'Trader account successfully created',
              user_id: result.rows[0].id,
              token: token,
              is_admin: result.rows[0].isadmin,
            });
          }
          });
        }else{
        return res.jsend.error({ message: 'Trader already exists!'});
        }
      });
      }catch (error) { debug('app:*')('Error Occured: Something wrong @uploadPhoto '+error); }   
    // disconnect client
    pool.on('remove', () => { 
      debug('app:*')('Client Removed @signup trader');
    });
  },
  // user signup
  userSignup: async (req, res) => {
    // check if user is admin
    const {
      first_name, last_name, email, password, phone, 
    } = req.body;
    try{
      await pool.query('SELECT phone, email FROM users WHERE email = $1 OR phone = $1', [email],  async (error, results) => {
      // user does not exist
        if (results.rows[0] === undefined) {
          await pool.query('INSERT INTO users (first_name, last_name, email, phone, password)'+
          ' VALUES ($1, $2, $3, $4, $5) RETURNING *', [ first_name, last_name, email,  phone, await bcrypt.hash(password, 10) ],  (err, result) => {
          // signin jwt and wrap in a cookie
          const token = jwt.sign({ userId: result.rows[0].id }, process.env.SECRET ? process.env.SECRET : configuration.SECRET);
          res.cookie('userid', result.rows[0].id, { expires: new Date(Date.now() + 3600000), httpOnly: true });
          res.cookie('token', token, { expires: new Date(Date.now() + 3600000), httpOnly: true });
          if(!err){
            sendEmail(result.rows[0].email, 'Your accout is succesfully created at Aba Trader');
            return res.jsend.success({
              message: 'User account successfully created',
              user_id: result.rows[0].id,
              email: result.rows[0].email,
              firstname: result.rows[0].first_name,
              lastname: result.rows[0].last_name,
              phone: result.rows[0].phone,
              token: token,
              is_active: result.rows[0].isadmin,
            });
          }
          });
        }else{
        return res.jsend.error({ message: 'User already exists!'});
        }
      });
      }catch (error) { debug('app:*')('Error Occured: Something wrong @UserSignup '+error); }   
    // disconnect client
    pool.on('remove', () => { 
      debug('app:*')('Client Removed @signup user');
    });
  },
  changeUserPhoto: async (req, res) => {
    // check if user is admin
    const { userid } = req.cookies;
    try {
        const photo  = req.file.url;
        pool.query('UPDATE users SET photourl = $1 WHERE id = $2 RETURNING id, photourl', [photo, userid],  (err, result) => {
          if(!err){
            return res.jsend.success({
              message: 'Photo Successfuly changed',
              photo: result.rows[0].photourl,
              user_id: result.rows[0].id,
            });
          }
          return res.jsend.error({message: 'Change failed: '+ err
          }); 
        });
      // disconnect client
      pool.on('remove', () => {
      debug('app:*')('Client Removed @ changeProfilePhoto');});
    }catch (error) { debug('app:*')('Error Occured: Something wrong @uploadPhoto'); }   
  },

  changePhoto: async (req, res) => {
    // check if user is admin
    const { params: { userId } } = req;
    
    try {
        const photo  = req.file.url;
        pool.query('UPDATE trader SET photourl = $1 WHERE id = $2 RETURNING id, photourl', [photo, userId],  (err, result) => {
          if(!err){
            return res.jsend.success({
              message: 'Photo Successfuly changed',
              photo: result.rows[0].photourl,
              user_id: result.rows[0].id,
            });
          }
          return res.jsend.error({message: 'Change failed: '+ err
          }); 
        });
      // disconnect client
      pool.on('remove', () => {
      debug('app:*')('Client Removed @ changeProfilePhoto');});
    }catch (error) { debug('app:*')('Error Occured: Something wrong @uploadPhoto'); }   
  },
  // trader login logic
  login: (req, res) => {
    const { email, password } = req.body;
      pool.query('SELECT id, email, first_name, last_name, phone, password FROM trader WHERE email = $1 OR phone = $1 ', [email], async (error, results) => {
      if (error) {
        return res.jsend.error({
          message: 'User not found! '+ error
        });
      }
      if (results.rows[0] === undefined) return res.jsend.error('Login failed, check your inputs');
      const match = await bcrypt.compare(password, results.rows[0].password);
      if (!match) {
        return res.jsend.error({ message: 'Login failed, check your password' });
      }
      // sign jwt and wrap in a cookie
      const token = jwt.sign({ userId: results.rows[0].id }, process.env.SECRET ? process.env.SECRET : configuration.SECRET);
      res.cookie('userid', results.rows[0].id, { expires: new Date(Date.now() + 3600000), httpOnly: true });
      res.cookie('token', token, { expires: new Date(Date.now() + 3600000), httpOnly: true });
      return res.jsend.success({
        user_id: result.rows[0].id,
              email: results.rows[0].email,
              firstname: results.rows[0].first_name,
              lastname: results.rows[0].last_name,
              phone: results.rows[0].phone,
              token: token,
              is_active: results.rows[0].isadmin,
      });
    });
    // disconnect client after operation
    pool.on('remove', () => { 
      debug('app:login')('client removed @signin');
    });
  },

  // user login logic
  userLogin: (req, res) => {
    const { email, password } = req.body;
      pool.query('SELECT id, email, password, first_name, last_name, phone FROM users WHERE email = $1 OR phone = $1 AND isActive = true ', [email], async (error, results) => {
      if (error) {
        return res.jsend.error({
          message: 'User not found! '+ error
        });
      }
      if (results.rows[0] === undefined) return res.jsend.error('Login failed, check your inputs');
      const match = await bcrypt.compare(password, results.rows[0].password);
      if (!match) {
        return res.jsend.error({ message: 'Login failed, check your password' });
      }
      // sign jwt and wrap in a cookie
      const token = jwt.sign({ userId: results.rows[0].id }, process.env.SECRET ? process.env.SECRET : configuration.SECRET);
      res.cookie('userid', results.rows[0].id, { expires: new Date(Date.now() + 3600000), httpOnly: true });
      res.cookie('token', token, { expires: new Date(Date.now() + 3600000), httpOnly: true });
      return res.jsend.success({
        user_id: results.rows[0].id,
        email: results.rows[0].email,
        firstname: results.rows[0].first_name,
        lastname: results.rows[0].last_name,
        phone: results.rows[0].phone,
        token: token,
        is_active: results.rows[0].isadmin,
      });
    });
    // disconnect client after operation
    pool.on('remove', () => { 
      debug('app:login')('client removed @signin');
    });
  },
  // get all traders
  getAll: async (req, res) => {
    try {
      pool.query('SELECT id, name, bus_name, bus_description, phone, address, email, photourl, regdate FROM trader ', (error, result) => {
          if(!error){
            return res.jsend.success({
                message: 'Success',
                Traders: result.rows,
            });
          }
        return res.jsend.error({message: 'Something went wrong '+ error});  
      });
    } catch (error) { debug('app:*')('Error Occured: Something wrong getting all Traders'); }
    // disconnect client
    pool.on('remove', () => {
      debug('app:*')('Client Removed @gettingAllTraders');
    });
  },
  // get all traders
  getAllUsers: async (req, res) => {
    try {
      pool.query('SELECT * FROM users ', (error, result) => {
          if(!error){
            return res.jsend.success({
                message: 'Success',
                users: result.rows,
            });
          }
        return res.jsend.error({message: 'Something went wrong '+ error});  
      });
    } catch (error) { debug('app:*')('Error Occured: Something wrong getting all Traders'); }
    // disconnect client
    pool.on('remove', () => {
      debug('app:*')('Client Removed @gettingAllTraders');
    });
  },

  // get all traders
  getUser: async (req, res) => {
    const { params: { userId } } = req;
    try {
      pool.query(`SELECT * FROM users WHERE id = ${userId}  `, (error, result) => {
          if(!error){
            return res.jsend.success({
                message: 'Success',
                users: result.rows,
            });
          }
        return res.jsend.error({message: 'Something went wrong '+ error});  
      });
    } catch (error) { debug('app:*')('Error Occured: Something wrong getting all Traders'); }
    // disconnect client
    pool.on('remove', () => {
      debug('app:*')('Client Removed @gettingAllTraders');
    });
  },

  postEmail: async (req, res) => {
    const {email, message} = req.body
    try{
      await sendEmail(email, message)
      res.jsend.success({message: 'Message sent'})
    }catch (error) { debug('app:*')('Error Occured: Something wrong posting email ' + error); }
  },

  // get all traders
  getUserEmail: async (req, res) => {
    const { params: { userId } } = req;
    try {
      pool.query(`SELECT email FROM users WHERE id = ${userId}  `, (error, result) => {
          if(!error){
            return res.jsend.success({
                message: 'Success',
                email: result.rows[0].email,
            });
          }
        return res.jsend.error({message: 'Something went wrong '+ error});  
      });
    } catch (error) { debug('app:*')('Error Occured: Something wrong getting user email'); }
    // disconnect client
    pool.on('remove', () => {
      debug('app:*')('Client Removed @gettingAllTraders');
    });
  },
  // get traders count
  getCount: async (req, res) => {
    try {
      pool.query('SELECT count(id) as number_of_trader FROM trader ', (error, result) => {
          if(!error){
            return res.jsend.success({
                NumberOfTraders: result.rows[0].number_of_trader,
            });
          }
        return res.jsend.error({message: 'Something went wrong'});  
      });
    } catch (error) { debug('app:*')('Error Occured: Something wrong getting traderCount'); }
    // disconnect client
    pool.on('remove', () => {
      debug('app:*')('Client Removed @gettingTraderCount');
    });
  },
  // edit user logic
  editUser: async (req, res) => {
    // check if user is admin
    const { token, userid } = req.cookies;
    const { first_name, last_name, email, phone, password } = req.body;
    // token = req.header();
    try {
        pool.query('UPDATE users SET  first_name = $1, last_name = $2, email = $3, phone = $4, password = $5   WHERE id = $6 RETURNING first_name, phone, regdate', [first_name, last_name, email, phone, await bcrypt.hash(password, 10), userid], (err, result) => {
          if(result === undefined){ return res.jsend.error({message: "user update failed "+ err});}
          if (!err) {
            return res.jsend.success({
              message: 'info succesfully updated',
              first_name: result.rows[0].first_name,
              phone: result.rows[0].phone,
              reg_date: result.rows[0].reg_date,
            });
          } 
          return res.jsend.error({message :"Something went wrong"+err});
        });
    } catch (error) { debug('app:*')('Error Occured: Something wrong @editUser'); }
    // disconnect client
    pool.on('remove', () => {
      debug('app:*')('Client Removed @ editUser');
    });
  },
  // edit article logic
  editTrader: async (req, res) => {
    const { params: { userId } } = req;
    const { name, bus_name, email, bus_desc, phone, address } = req.body;
    // token = req.header();
    try {
        pool.query('UPDATE trader SET  name = $1, bus_name = $2, bus_description = $3, phone = $4, address = $5, email = $6  WHERE id = $7 RETURNING name, phone, regdate', [name, bus_name, bus_desc, phone, address, email, userId], (err, result) => {
          if(result === undefined){ return res.jsend.error({message: "Trader update failed "+ err});}
          if (!err) {
            return res.jsend.success({
              message: 'info succesfully updated',
              name: result.rows[0].name,
              phone: result.rows[0].phone,
              reg_date: result.rows[0].reg_date,
            });
          } 
          return res.jsend.error({message :"Something went wrong"+err});
        });
    } catch (error) { debug('app:*')('Error Occured: Something wrong @editTrader'); }
    // disconnect client
    pool.on('remove', () => {
      debug('app:*')('Client Removed @ editTrader');
    });
  },
  // edit edit password logic
  changePassword: async (req, res) => {
    const { password, email } = req.body;
    // token = req.header();
    try {
        pool.query('UPDATE  trader SET password = $1  WHERE email = $2 OR phone= $2 RETURNING name, phone, regdate ', [await bcrypt.hash(password, 10), email], (err, result) => {
          if(result.rows[0] === undefined){ return res.jsend.error("Trader is not registered");}
          if (!err) {
            return res.jsend.success({
              message: 'Password successfully Changed',
              name: result.rows[0].name,
              phone: result.rows[0].phone,
              regdate: result.rows[0].regdate,
            });
          } 
          return res.jsend.error({message : 'Something went wrong '+err});
        });
    } catch (error) { debug('app:*')('Error Occured: Something wrong @changePassword'); }
    // disconnect client
    pool.on('remove', () => {
      debug('app:*')('Client Removed @ changePassword');
    });
  },
  // edit edit password logic
  changeUserPassword: async (req, res) => {
    const { password, email } = req.body;
    // token = req.header();
    try {
        pool.query('UPDATE  trader SET password = $1  WHERE email = $2 OR phone= $2 RETURNING phone, regdate ', [await bcrypt.hash(password, 10), email], (err, result) => {
          if(result.rows[0] === undefined){ return res.jsend.error("User is not registered");}
          if (!err) {
            return res.jsend.success({
              message: 'Password successfully Changed',
              name: result.rows[0].name,
              phone: result.rows[0].phone,
              regdate: result.rows[0].regdate,
            });
          } 
          return res.jsend.error({message : 'Something went wrong '+err});
        });
    } catch (error) { debug('app:*')('Error Occured: Something wrong @changePassword'); }
    // disconnect client
    pool.on('remove', () => {
      debug('app:*')('Client Removed @ changePassword');
    });
  },
};
