CREATE DATABSE IF NOT EXISTS abia_project;
USE abia_project;
CREATE TABLE IF NOT EXISTS
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
        )
        
CREATE TABLE IF NOT EXISTS
product(
        id SERIAL PRIMARY KEY,
        product_name VARCHAR NOT NULL,
        trader_id INT NOT NULL REFERENCES trader(id),
        imageUrl VARCHAR NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )