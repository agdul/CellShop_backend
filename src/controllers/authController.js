//const db = require('../db');
//----------------------------------------------------
const UsuarioService = require('../services/usuarioService');
const usuarioService = new UsuarioService();
//----------------------------------------------------

const { hashPassword, matchPassword } = require('../security/hashPass');
const { generarToken } = require('../security/token');

//----------------------------------------------------
const AppError = require('../utilits/helpers/errors');

class AuthController{

    static async loginUsuario(usuario, password) {
        try {
        const user = await usuarioService.existeByUsuario(usuario);
        if (!user) {
            throw new AppError('Usuario no encontrado', 404);
        }
        const isPasswordValid = await matchPassword(password, user.password);
        if (!isPasswordValid) {
            throw new AppError('Contraseña incorrecta', 401);
        }
        console.log('Usuario encontrado:', user.id_usuario);
        // Generar el token de sesión
        const token = await generarToken(user.id_usuario);
        return { ...user.toJSON(), token: token };
        } catch (error) {  
            console.error('Error en loginUsuario:', error);
            if (error instanceof AppError) {
                throw error; // Propagar el error personalizado
            }
            throw new AppError('Error al iniciar sesión', 500, error.message);
            
        }
    };

    static async registrarUsuario(data, password) {
        try {
            const existingUser = await usuarioService.existeByUsuario(data.usuario);
            if (existingUser) {
                throw new AppError('El usuario ya existe', 409);
            }
            const hashedPassword = await hashPassword(password);
            const newUser = await usuarioService.create({
              ...data,
              password: hashedPassword,
            });
            const token = await generarToken(newUser.id_usuario);
            if (!token) {
                throw new AppError('Error al generar el token', 500);
            }
            return { ...newUser.toJSON(), token: token };
        } catch (error) {
            console.error('Error en registrarUsuario:', error);
            if (error instanceof AppError) {
                throw error; // Propagar el error personalizado
            }
            throw new AppError('Error al registrar usuario', 500, error.message);
        }
    };

    static async logout(req, res) {
        try {
            return res.status(200).json({ message: 'Sesión cerrada exitosamente' });
        } catch (error) {
            console.error('❌ Error al cerrar sesión:', error);
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Error interno del servidor', error: error.message });
            
        }
    };
}

module.exports = AuthController;