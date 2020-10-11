require('dotenv').config(); 

const config = {
  SECRET : 'olajide4me',
  // If using onine database
  // development: {
  //   use_env_variable: 'DATABASE_URL'
  // },

  development: {
    user: 'postgres', // this is the db user credential
    database: 'abia_project',
    password: 'olajide4me',
    port: 5432,
    max: 100, // max number of clients in the pool
    idleTimeoutMillis: 30000,
  },

  test: {
    user: 'postgres', // this is the db user credential
    database: 'abia_project_test',
    password: 'olajide4me',
    port: 5432,
    max: 100, // max number of clients in the pool
    idleTimeoutMillis: 30000,
  },

  production: {
    url: 'postgres://slubktcxshcsad:aad1bfee7759983895f3a9d2cad67725dc14fb00bacc07145f42d38881567431@ec2-54-157-78-113.compute-1.amazonaws.com:5432/d17adahe754qui'
  }
};

export default config;