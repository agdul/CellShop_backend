const express = require ('express');
const UsuarioHandler = require('../handlers/usuarioHandler');

const router = express.Router();

// router.get('/', (req, res) => {
//     res.json({
//         message: 'Bienvenido a la API de usuarios'
//     });
// });


//---------------------------------------------------------------
// Rutas Usuarios 
//--- Obtener todos los usuarios
router.get('/', UsuarioHandler.getUsuario);

//--- Usuario por ID
router.get('/:id', UsuarioHandler.getUsuario);

//--- Crear un nuevo usuario
router.post('/', UsuarioHandler.createUsuario);

//--- Actualizar un usuario
router.put('/:id', UsuarioHandler.updateUsuario);

//--- Eliminar un usuario
router.delete('/:id', UsuarioHandler.deleteUsuario);
//---------------------------------------------------------------




module.exports = router;