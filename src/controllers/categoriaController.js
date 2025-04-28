const db = require('../models');
const CategoriaService = require("../services/categoriaService");
const categorianService = new CategoriaService();

const AppError = require("../utilits/helpers/errors");

class CategoriaController{
    static async getTodasCategorias() {
        try {
            const categorias = await categorianService.getAll();
            if (!categorias || categorias.length === 0) {
                throw new AppError("No se encontraron categorías", 404);
            }
            return categorias;
        } catch (error) {
            throw error;
        }
    }

    static async getCategoriaById(id_categoria) {
        try {
            const categoria = await categorianService.getById(id_categoria);
            if (!categoria) {
                throw new AppError("Categoría no encontrada", 404);
            }
            return categoria;
        } catch (error) {
            throw error;
        }
    }

    static async createCategoria(data) {
        try {
            const nuevaCategoria = await categorianService.create(data);
            if (!nuevaCategoria) {
                throw new AppError("Error al crear la categoría", 400);
            }
            return nuevaCategoria;
        } catch (error) {
            throw error;
        }

    }



}


module.exports = CategoriaController;