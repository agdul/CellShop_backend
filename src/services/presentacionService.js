const db = require('../models');
const Presentacion = db.Presentacion;
const AppError = require('../utilits/helpers/errors');
const ProductoService = require('../services/productoService');
const productoService = new ProductoService();
const Sequelize = require('sequelize');
const Op = Sequelize.Op;



class PresentacionService {
  constructor() {
    this.presentacion = Presentacion;
  }

  async getAll() {
    return await this.presentacion.findAll({
      include: [{ association: "producto" }],
    });
  }

  async getById(id_presentacion) {
    return await this.presentacion.findOne({
      where: { id_presentacion: id_presentacion },
      include: [{ association: "producto" }],
    });
  }

  async create(data) {
    const t = await db.sequelize.transaction();
    try {
      //await productoService.verificarProductoActivo(data.id_producto);

      const nuevaPresentacion = await this.presentacion.create(data, {
        transaction: t,
      });
      await t.commit();

      return nuevaPresentacion;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  async update(id, data) {
    const t = await db.sequelize.transaction();
    try {
      const presentacionExistente = await this.presentacion.findByPk(id);
      if (!presentacionExistente) {
        throw new AppError("Presentación no encontrada", 404);
      }

      await this.presentacion.update(data, {
        where: { id_presentacion: id },
        transaction: t,
      });
      await t.commit();

      return await this.getById(id);
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  async delete(id) {
    const t = await db.sequelize.transaction();
    try {
      const deleted = await this.presentacion.destroy({
        where: { id_presentacion: id },
        transaction: t,
      });
      await t.commit();
      return deleted;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }
  async getByNombre(nombre_presentacion, idExcluir = null) {
    const where = { nombre_presentacion };
    if (idExcluir) {
        where.id_presentacion = { [Op.ne]: idExcluir }; // Excluir la presentación con este ID
    }
    return await this.presentacion.findOne({ 
        where,
        include: [{ association: "producto" }] // Opcional: incluir relación con producto
    });
}
  async existeById(id) {
    const existePresentacion = await this.presentacion.findOne({
      where: { id_presentacion: id },
    });
    return !!existePresentacion;
  }

  async getAllByProducto(id_producto) {
    return await this.presentacion.findAll({
      where: { id_producto },
      include: [{ association: "producto" }],
    });
  }

  async verificarPresentacionActivo(id_presentacion) {
    const presentacion = await this.existeById(id_presentacion);
    if (!presentacion) {
      throw new AppError("Presentacion no encontrado", 404);
    }
    // if (presentacion.estado !== 'Activo' && producto.estado !== true) {
    //     throw new AppError('El producto no está activo', 400);
    // }
    return producto;
  }
}

module.exports = PresentacionService;
