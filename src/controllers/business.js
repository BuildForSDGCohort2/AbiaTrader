import jwt from 'jsonwebtoken';
import debug from 'debug';
import bcrypt from 'bcrypt';
import pool from '../database/dbconnect';
import configuration from '../config/config';

export default {
 
  addBusiness: async (req, res) => {
    const { token, userid } = req.cookies;
    // check if user is admin
    const { bus_name, bus_desc, category, state, lg, address, phone, } = req.body;
    
    try{
       await pool.query('INSERT INTO business (name, description, category, state, lg, address, phone, user_id)'+
          ' VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, user_id, name', [ bus_name, bus_desc, category, state, lg, address, phone, userid],  (err, result) => {  
          // signin jwt and wrap in a cookie
          if(!err){
            pool.query('INSERT INTO rating (bus_id, rating) VALUES ($1, $2)', [result.rows[0].id, 0], (error, res) => { if (error) res.jsend.error('Error initialising rating') });
            return res.jsend.success({
              message: 'Business successfully added',
              bus_id: result.rows[0].id,
              bus_name: result.rows[0].bus_name,
              user_id: result.rows[0].user_id,
            });
          }
        });
    }catch (error) { debug('app:*')('Error Occured: Something wrong @addBusiness '+error); }   
    // disconnect client
    pool.on('remove', () => { 
      debug('app:*')('Client Removed @add business');
    });
  },
  //get business
  getBusiness: async (req, res) => {
    const { token, userid } = req.cookies;
    try {
      await pool.query('SELECT id, name, description, category, state, lg, phone, address regdate FROM business WHERE user_id = $1 ', [userid],  (error, result) => {
          if(!error){
            return res.jsend.success({
                message: 'Successful',
                bus_id: result.rows[0].id,
                bus_name: result.rows[0].name,
                bus_desc: result.rows[0].description,
                category: result.rows[0].category,
                location: { state:result.rows[0].state, lg:result.rows[0].lg,},
                phone: result.rows[0].phone,
                address: result.rows[0].address,
            });
          }
        return res.jsend.error({message: 'Something went wrong '+ error});  
      });
    } catch (error) { debug('app:*')('Error Occured: Something wrong getting business'); }
    // disconnect client
    pool.on('remove', () => {
      debug('app:*')('Client Removed @gettingBusiness');
    });
  },

  // get all business
  getAllBusiness: async (req, res) => {
    try {
      await pool.query('SELECT business.id, name, description, category, state, lg, phone, address, SUM(rating) as bus_rating FROM business JOIN '+
      ' rating ON business.id = rating.bus_id GROUP BY business.id ORDER BY business.regdate DESC LIMIT 20',  (error, result) => {
          if(!error){
            return res.jsend.success({
                message: 'Successful',
                businesses:  result.rows
            });
          }
        return res.jsend.error({message: 'Something went wrong '+ error});  
      });
    } catch (error) { debug('app:*')('Error Occured: Something wrong getting business'); }
    // disconnect client
    pool.on('remove', () => {
      debug('app:*')('Client Removed @gettingBusiness');
    });
  },
  //search busines
  searchBusiness: async (req, res) => {
    const {input} = req.body;
    try {
      pool.query(`SELECT id, name, description, category, state, lg, phone, address regdate FROM business WHERE category LIKE '%${input}%' OR state LIKE '%${input}%' OR lg LIKE '%${input}%'`,  (error, result) => {
          if(!error){
            if (result.rows[0] === undefined) return res.jsend.success({message: 'No result found'})
            else{
              return res.jsend.success({
                  message: 'Successful',
                  businesses:  result.rows
              });
            }
          }
        return res.jsend.error({message: 'Something went wrong '+ error});  
      });
    } catch (error) { debug('app:*')('Error Occured: Something wrong getting business'); }
    // disconnect client
    pool.on('remove', () => {
      debug('app:*')('Client Removed @gettingBusiness');
    });
  },

  editBusiness: async (req, res) => {
    const { token, userid } = req.cookies;
    const {
      bus_name, bus_desc, category, state, lg, address, phone, 
    } = req.body;
    try {
      pool.query('UPDATE business SET name = $1, description = $2, category = $3, state = $4, lg = $5, phone = $6, address = $7 WHERE id = $8 RETURNING name, description ', [bus_name, bus_desc, category, state, lg, phone, address, userid],  (error, result) => {
          if(!error){
            return res.jsend.success({
                message: 'Update Successful',
                bus_name: result.rows[0].name,
                bus_desc: result.rows[0].description, 
            });
          }
        return res.jsend.error({message: 'Something went wrong '+ error});  
      });
    } catch (error) { debug('app:*')('Error Occured: Something wrong updating business'); }
    // disconnect client
    pool.on('remove', () => {
      debug('app:*')('Client Removed @updatingBusiness');
    });
  },

  addRating: async (req, res) => {
    const { busid, rating } = req.body;
    try {
      pool.query('INSERT INTO rating (bus_id, rating) VALUES ($1, $2)', [busid, rating],  (error, result) => {
          if(!error){
            return res.jsend.success({
                message: 'Rating Successful',
            });
          }
        return res.jsend.error({message: 'Something went wrong '+ error});  
      });
    } catch (error) { debug('app:*')('Error Occured: Something wrong rating business'); }
    // disconnect client
    pool.on('remove', () => {
      debug('app:*')('Client Removed @ratingBusiness');
    });
  },
  // get traders count
  getCount: async (req, res) => {
    try {
      pool.query('SELECT count(id) as number_of_busines FROM business ', (error, result) => {
          if(!error){
            return res.jsend.success({
                NumberOfBusiness: result.rows[0].number_of_business,
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
};
