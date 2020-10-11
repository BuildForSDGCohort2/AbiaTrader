// get debug module for debugging mode
import debug from 'debug';
// get postgres connection pool for database query
import pool from '../database/dbconnect';

const tables = {
  // create user tables if not exist
  createTraderTable: () => {
    const trader = `CREATE TABLE IF NOT EXISTS
       trader( 
          id SERIAL PRIMARY KEY, 
          name VARCHAR NOT NULL,
          bus_name VARCHAR NOT NULL,
          email VARCHAR NOT NULL,
          phone VARCHAR NOT NULL,
          password VARCHAR NOT NULL,
          address VARCHAR NOT NULL,
          bus_description VARCHAR NOT NULL,
          isAdmin BOOLEAN DEFAULT FALSE,
          photoUrl VARCHAR NOT NULL,
          regDate TIMESTAMP DEFAULT NOW()
        )`;
    pool.query(trader)
      .then((res) => {
        debug('app:*')(`table trader is available ${res}`);
      })
      .catch((err) => {
        debug('app:*')(err);
      });
  },
  createUserTable: () => {
    const users = `CREATE TABLE IF NOT EXISTS
       users( 
          id SERIAL PRIMARY KEY, 
          first_name VARCHAR NOT NULL,
          last_name VARCHAR NOT NULL,
          email VARCHAR NOT NULL,
          phone VARCHAR NOT NULL,
          password VARCHAR NOT NULL,
          isActive BOOLEAN DEFAULT TRUE,
          photoUrl VARCHAR DEFAULT NULL,
          regDate TIMESTAMP DEFAULT NOW()
        )`;
    pool.query(users)
      .then((res) => {
        debug('app:*')(`table users is available ${res}`);
      })
      .catch((err) => {
        debug('app:*')(err);
      });
  },
  createBusinessTable: () => {
    const business = `CREATE TABLE IF NOT EXISTS
       business( 
          id SERIAL PRIMARY KEY, 
          user_id INT NOT NULL REFERENCES users(id),
          name VARCHAR NOT NULL,
          description VARCHAR NOT NULL,
          category VARCHAR NOT NULL,
          phone VARCHAR NOT NULL,
          address VARCHAR NOT NULL,
          state VARCHAR NOT NULL,
          lg VARCHAR NOT NULL,
          regDate TIMESTAMP DEFAULT NOW()
        )`;
    pool.query(business)
      .then((res) => {
        debug('app:*')(`table business is available ${res}`);
      })
      .catch((err) => {
        debug('app:*')(err);
      });
  },
  createProductTable: () => {
    const product = `CREATE TABLE IF NOT EXISTS
      product(
        id SERIAL PRIMARY KEY,
        product_name VARCHAR NOT NULL,
        user_id INT NOT NULL REFERENCES users(id),
        imageUrl VARCHAR NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )`;
    pool.query(product)
      .then((res) => {
        debug('app:*')(`table product is available ${res}`);
      })
      .catch((err) => {
        debug('app:*')(err);
      });
  },
  createOrdersTable: () => {
    const orders = `CREATE TABLE IF NOT EXISTS
      orders(
        id SERIAL PRIMARY KEY,
        product_name VARCHAR NOT NULL,
        buyer_name VARCHAR NOT NULL,
        phone VARCHAR NOT NULL,
        address VARCHAR NOT NULL,
        user_id INT NOT NULL REFERENCES users(id),
        price DECIMAL(10, 2) NOT NULL,
        quantity INT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )`;
    pool.query(orders)
      .then((res) => {
        debug('app:*')(`table orders is available ${res}`);
      })
      .catch((err) => {
        debug('app:*')(err);
      });
  },
  createRatingTable: () => {
    const rating = `CREATE TABLE IF NOT EXISTS
      rating(
        id SERIAL PRIMARY KEY,
        bus_id INT NOT NULL REFERENCES business(id),
        rating INT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )`;
    pool.query(rating)
      .then((res) => {
        debug('app:*')(`table rating is available ${res}`);
      })
      .catch((err) => {
        debug('app:*')(err);
      });
  },
   disconnect: () => {
    // disconnect client
    pool.on('remove', () => {
      debug('app:database')('Tables created successfully, conection removed');
    });
  },
};
// export utilities to be accessible  from any where within the application
export default tables;
