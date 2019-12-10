import Sequelize, { Model } from 'sequelize';

class Provider extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        phone_number: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id' });
  }
}

export default Provider;
