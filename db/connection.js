import { Sequelize } from 'sequelize';

const DB_NAME = 'db_contacts_xshl';
const DB_USER = 'db_contacts_xshl_user';
const DB_PASSWORD = 'ZkSJr38BXPt7MEn3HTiFy22PMZrbEWN3';
const DB_HOST = 'dpg-cvpvm1hr0fns7389b16g-a.oregon-postgres.render.com';
const DB_PORT = 5432;

export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true, 
      rejectUnauthorized: false,
    },
  },
});

export const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection successful');
  } catch (error) {
    console.error('Unable to connect to the database:', error.message);
    process.exit(1);
  }
};
