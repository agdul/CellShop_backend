const db = require('../models');
const Categoria = db.Categoria;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const AppError = require('../utilits/helpers/errors');

class CategoriaService {
  constructor() {
    this.categoria = Categoria;
  }
  // Obtener todas las categorias
  async getAll() {
    return await this.categoria.findAll({
      attributes: ["id_categoria", "nombre_categoria"],
      include: [
        {
          association: "productos",
          attributes: ["id_producto", "nombre_producto", "estado_producto"],
        },

        { association: "linea" },
      ],
    });
  }

  // Obtener una categoria por id
  async getById(id) {
    return await this.categoria.findOne({
      attributes: ["id_categoria", "nombre_categoria"],
      where: { id_categoria: id },
      include: [
        {
          association: "productos",
          attributes: ["id_producto", "nombre_producto", "estado_producto"],
        },

        { association: "linea" },
      ],
    });
  }

  async create(data) {
    const t = await db.sequelize.transaction();
    try {

      const { nombre_categoria, id_linea } = data;  
    // --------------------------------------------------------------------------------------------  
        //-------------- Se podria encapzular estas validaciones -------------------------------

      // Verificar si la categoría ya existe
      const categoriaExiste = await this.getAll();
      if (categoriaExiste.some((categoria) => categoria.nombre_categoria === data.nombre_categoria)){
        throw new AppError("La categoría ya existe", 400);
      }

      // Verificar si la línea existe
      const lineaExiste = await this.categoria.findOne({
        where: { id_linea: data.id_linea },
      });
      if (!lineaExiste) {
        throw new AppError("La línea no existe", 404);
      }
    // --------------------------------------------------------------------------------------------  
      const nuevaCategoria = await this.categoria.create({nombre_categoria, id_linea}, {
        transaction: t,
      });
      await t.commit();

      return nuevaCategoria;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }


}

module.exports = CategoriaService;