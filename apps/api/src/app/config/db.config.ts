import dotenv from 'dotenv';

dotenv.config();

const prod_var = {
  HOST: "10.0.0.55",
  PORT: 27017,
  DB: "myjumpdata",
  USER: process.env.DB_USER,
  PWD: process.env.DB_PWD,
};

const dev_var = {
  HOST: "localhost",
  PORT: 27017,
  DB: "myjumpdata",
};

const test_var = {
  HOST: "localhost",
  PORT: 27017,
  DB: "myjumpdata_test",
};

const dev = `mongodb://${dev_var.HOST}:${dev_var.PORT}/${dev_var.DB}`;
const test = `mongodb://${test_var.HOST}:${test_var.PORT}/${test_var.DB}`;
const prod = `mongodb://${prod_var.USER}:${prod_var.PWD}@${prod_var.HOST}:${prod_var.PORT}/${prod_var.DB}`;

let string;
if (process.env.NODE_ENV === "development") {
  string = dev;
} else if (process.env.NODE_ENV === "test") {
  string = test;
} else {
  string = prod;
}

export default {
  CONNECT_STRING: string,
  CONNECT_STRING_DEV: dev,
  CONNECT_STRING_TEST: test,
  CONNECT_STRING_prod: prod,
};
