import Sequelize, { Model } from 'sequelize';

class Item extends Model {
  static init(sequelize) {
    super.init(
      {
        value: Sequelize.DOUBLE,
        quantity: Sequelize.INTEGER,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Product, { foreignKey: 'product_id' });
    this.belongsTo(models.Sale, { foreignKey: 'sale_id' });
  }
}

export default Item;
