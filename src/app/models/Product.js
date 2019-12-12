import Sequelize, { Model } from 'sequelize';

class Product extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        price: Sequelize.DOUBLE,
        quantity: Sequelize.INTEGER,
        image: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Provider, {
      foreignKey: 'provider_id',
      onDelete: 'CASCADE',
      as: 'provider',
    });
    this.belongsTo(models.User, { foreignKey: 'user_id' });
  }
}

export default Product;
