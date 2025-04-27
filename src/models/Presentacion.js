const { Model, DataTypes } = require('sequelize');

class Presentacion extends Model {
  static initModel(sequelize) {
    Presentacion.init({
      id_presentacion: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      nombre_presentacion: { type: DataTypes.STRING, allowNull: false },
      id_producto: { type: DataTypes.INTEGER, allowNull: false }
    }, {
      sequelize,
      modelName: 'Presentacion',
      tableName: 'Presentacion',
      timestamps: false
    });
  }

  static associate(models) {
    Presentacion.belongsTo(models.Producto, {
      foreignKey: 'id_producto',
      as: 'producto'
    });
  }
}

module.exports = Presentacion;
