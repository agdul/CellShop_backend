const db = require('../models');
const Carrito = db.Carrito;
const Usuario = db.Usuario;
const CarritoDetalle = db.CarritoDetalle;
const Presentacion = db.Presentacion;
const AppError = require('../utilits/helpers/errors');

class CarritoService {
  constructor() {
    this.carrito = Carrito;
  }

  async getCarritoActivo(id_usuario) {
    return await this.carrito.findOne({
      where: { id_usuario, estado: 'activo' }
    });
  }

  async create(data, options = {}) {
    return await this.carrito.create(data, options);
  }

  async getCarritoCompleto(id_usuario) {
    const carrito = await this.carrito.findOne({
      where: { id_usuario, estado: 'activo' },
      include: [
        {
          model: CarritoDetalle,
          as: 'detalles',
          include: [
            {
              model: Presentacion,
              as: 'presentacion'
            }
          ]
        },
        {
          model: Usuario,
          as: 'usuario'
        }
      ]
    });

    if (!carrito) {
      throw new AppError("❌ Carrito no encontrado para este usuario", 404);
    }

    return carrito;
  }

  async existeById(id_carrito) {
    const carrito = await this.carrito.findOne({
      where: { id_carrito }
    });
    if (!carrito) {
      throw new AppError("Carrito no encontrado", 404);
    }
    return carrito;
  }
}

module.exports = CarritoService;
