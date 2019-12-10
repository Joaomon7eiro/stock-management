import Sequelize from 'sequelize';

import dbConfig from '../config/database';

import User from '../app/models/User';
import Sale from '../app/models/Sale';
import Client from '../app/models/Client';
import Product from '../app/models/Product';
import Provider from '../app/models/Provider';
import Item from '../app/models/Item';

const models = [User, Sale, Client, Product, Provider, Item];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(dbConfig);

    models.forEach(model => model.init(this.connection));
    models.forEach(
      model => model.associate && model.associate(this.connection.models)
    );
  }
}

export default new Database();
