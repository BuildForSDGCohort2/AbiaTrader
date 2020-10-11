import debug from 'debug';
import pool from '../database/dbconnect';

export default {
  create: async (req, res) => {
    // check if user is admin
    const {product_name,  price} = req.body;
    const user_id = req.cookies['userid'];
    try {
      const imageurl = req.file.url
      // create product if user is admin
      console.log(imageurl)
      await pool.query('INSERT INTO product (product_name, user_id, imageurl, price) VALUES ($1, $2, $3, $4) RETURNING id, imageurl, product_name, price, created_at ', [product_name, user_id, imageurl, price], (err, result) => {
        if (!err) {
          return res.jsend.success({
            message: 'Product successfully posted',
            productID: result.rows[0].id,
            CreatedOn: result.rows[0].created_at,
            name: result.rows[0].product_name,
            imageUrl: result.rows[0].imageurl
          });
        }
          return res.jsend.error({message:"Something went wrong "+ err});
      });
    // disconnect client
    pool.on('remove', () => {
        debug('app:*')('Client Removed @ postProduct');
      });
  }catch (error) { debug('app:*')('Error Occured: Something wrong @uploadProduct' + error); }   
},

order: async (req, res) => {
  const {product_name, buyer_name, user_id, phone, address, quantity,  price} = req.body;
  try {
    await pool.query('INSERT INTO orders (product_name, buyer_name, user_id, phone, address, quantity, price) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING * ', [product_name, buyer_name, user_id, phone, address, quantity, price], (err, result) => {
      if (!err) {
        return res.jsend.success({
          message: 'Product successfully posted',
          order: result.rows
        });
      }
        return res.jsend.error({message:"Something went wrong "+ err});
    });
  // disconnect client
  pool.on('remove', () => {
      debug('app:*')('Client Removed @ postOrder');
    });
}catch (error) { debug('app:*')('Error Occured: Something wrong @uploadOrder' + error); }   
},

edit: async (req, res) => {
  // check if user is admin
  const { params: { productId } } = req;
  const {product_name, price} = req.body;
  const user_id  = req.cookies['userid'];
  try {
    // Upload image to cloudinary
    const imageurl = req.file.url;
    await pool.query('UPDATE product SET product_name = $1, user_id = $2, imageurl = $3, price = $4 WHERE id = $5 RETURNING imageurl, product_name, price, created_at ', [product_name, user_id, imageurl, price, productId], (err, result) => {
      if (!err) {
        return res.jsend.success({
          message: 'Product successfully edited',
          productID: result.rows[0].id,
          CreatedOn: result.rows[0].created_at,
          name: result.rows[0].title,
          imageUrl: result.rows[0].imageurl
        });
      }
        return res.jsend.error({message : "Something went wrong "+err});
    });
      // disconnect client
    pool.on('remove', () => {
      debug('app:*')('Client Removed @ editProduct');
    });
  }catch (error) { debug('app:*')('Error Occured: Something wrong @uploadEditProduct'); }   
},
  // user delete product
  delete: async (req, res) => {
    const { userid } = req.cookies;
    const { params: { productId } } = req;
    // token = req.header();
    try {
        pool.query('DELETE FROM  product  WHERE id = $1 AND trader_id = $2 RETURNING id, product_name', [productId, userid], (err, result) => {
          if(result === undefined){ return res.jsend.error("Delete product failed");}
          if (!err) {
            return res.jsend.success({
              message: 'Product succesfully deleted ',
              name: result.rows[0].product_name
            });
          } 
          return res.jsend.error(err);
        });
    } catch (error) { debug('app:*')('Error Occured: Something wrong @deleteGif ' + error); }
    // disconnect client
    pool.on('remove', () => {
      debug('app:*')('Client Removed @deleteGif');
    }); 
  },
  // Get specific product
  getOne: async (req, res) => {
    const { params: { productId } } = req;
    try {
      await pool.query('SELECT product.id as pid, product_name, imageurl, price, created_at, business.name as maker, business.phone as phone_number, business.address as bus_address FROM product JOIN users ON users.id = product.user_id JOIN business ON users.id = business.user_id  WHERE product.id = $1', [productId], (error, result) => {
        if(!error){
            if(result.rows[0] === undefined){ return res.jsend.error("product not available");}
            return res.jsend.success({
                message: "Success",
                id: result.rows[0].pid,
                createdOn: result.rows[0].gifdate,
                product_name: result.rows[0].product_name,
                url: result.rows[0].imageurl,
                price: result.rows[0].price,
                business: result.rows[0].maker,
                phone: result.rows[0].phone_number,
                address: result.rows[0].bus_address,
            });
          }
        return res.jsend.error('Error occurred'+error);  
      });
    } catch (error) { debug('app:*')('Error Occured: Something wrong getting product'); }
    // disconnect client
    pool.on('remove', () => {
      debug('app:*')('Client Removed @gettingProduct');
    });
  },

  // Get all product
  getAllForBuy: async (req, res) => {
  
    try {
      pool.query('SELECT DISTINCT ON (product_name) product_name, price, imageurl, user_id FROM product ORDER BY product_name', (error, result) => {
          if(!error){
            if(result === undefined){ return res.jsend.error("Products are not available"); }
            return res.jsend.success({
                message: "Success",
                products: result.rows,
            });
          }
        return res.jsend.error({message: "Something went wrong "+error});
      });
    } catch (error) { debug('app:*')('Error Occured: Something wrong getting producs'); }
    // disconnect client
    pool.on('remove', () => {
      debug('app:*')('Client Removed @gettingProducts');
    });
  },

  // Get all product
  getTradersDetails: async (req, res) => {
    const { params: { productName } } = req;
    try {
      pool.query(`SELECT first_name, last_name, phone, price, imageurl, user_id FROM users INNER JOIN product on users.id = product.user_id WHERE product_name = '${productName}' `, (error, result) => {
          if(!error){
            if(result === undefined){ return res.jsend.error("Traders are not available"); }
            return res.jsend.success({
                message: "Success",
                traders: result.rows,
            });
          }
        return res.jsend.error({message: "Something went wrong "+error});
      });
    } catch (error) { debug('app:*')('Error Occured: Something wrong getting producs'); }
    // disconnect client
    pool.on('remove', () => {
      debug('app:*')('Client Removed @gettingProducts');
    });
  },

  // Get specific allproduct
  getAllForUser: async (req, res) => {
    const { params: { userId } } = req;
    try {
      pool.query(`SELECT id, product_name, imageurl, price, created_at FROM product where user_id = ${userId}`, (error, result) => {
          if(!error){
            if(result === undefined){ return res.jsend.error("Products are not available"); }
            return res.jsend.success({
                message: "Success",
                products: result.rows,
            });
          }
        return res.jsend.error({message: "Something went wrong "+error});
      });
    } catch (error) { debug('app:*')('Error Occured: Something wrong getting producs'); }
    // disconnect client
    pool.on('remove', () => {
      debug('app:*')('Client Removed @gettingProducts');
    });
  },

  // Get searched product
  searchProduct: async (req, res) => {
    //const { params: { keyword } } = req;
    const {keyword} = req.body
    try { 
      pool.query(`SELECT id, product_name, imageurl, price, created_at FROM product WHERE product_name LIKE '%${keyword}%'  `, (error, result) => {
          if(!error){
            if(result === undefined){ return res.jsend.error("Products are not available"); }
            return res.jsend.success({
                message: "Success",
                products: result.rows,
            });
          }
        return res.jsend.error({message: `No result for ${keyword} : ${error}`});
      });
    } catch (error) { debug('app:*')('Error Occured: Something wrong getting producs'); }
    // disconnect client
    pool.on('remove', () => {
      debug('app:*')('Client Removed @gettingProducts');
    });
  },

};
