const express = require('express');

const router = express.Router();
const mysql = require('mysql');


//Crear Usuarios
router.post('/api/create/users', async (req, res) => {



    const nuevoUsuario = {

        razonSocial,
        email,
        nit,
        password,
        id

    } = req.body;

    var id = nuevoUsuario.id;
    if (typeof id === 'undefined') {
        id = null;
    }

    await connection.query("call sp_usuarios_save(?,?,?,?,?) ", [nuevoUsuario.razonSocial, nuevoUsuario.email, nuevoUsuario.nit, nuevoUsuario.password, id], (err, rows, fields) => {

        if (err) throw err;
        console.log(rows)
        res.json({
            status: 200,
            message: 'usuario creado',
            nuevoUsuario
        })

    });



});
//Login Usuarios
router.post('/api/login/users', async (req, res) => {


    const Login = {


        email,

        password


    } = req.body;



    await connection.query("call sp_login(?,?) ", [Login.email, Login.password], async (err, rows, fields) => {

        if (err) throw err;

        const result = JSON.parse(JSON.stringify(rows));
        if (typeof result[0][0] !== 'undefined') {

            const row = result[0][0];

            var item = Conexiones_API.filter(function (r) {
                return r.userId == row._id
            })[0];

            if (typeof item === "undefined") {
                await connection.query("call sp_conexiones_get_by_usuario_id(?) ", row._id, (err, rows2, fields) => {
                    const conexion = JSON.parse(JSON.stringify(rows2));
                    if (typeof conexion[0][0] !== 'undefined') {
                        const row2 = conexion[0][0];

                        item = {
                            userId: row._id,
                            connection: mysql.createConnection({
                                host: row2.ip,
                                user: row2.dbuser,
                                password: row2.dbpass,
                                database: row2.dbname
                            })
                        };

                        item.connection.connect(function (err) {

                            if (err) {
                                console.log(err);
                                return;
                            } else {
                                console.log('Esta conectado a mysql: ', row2.dbname);
                            }
                        });
                        Conexiones_API.push(item)
                    }
                    //console.log(Conexiones_API)
                });
            }
            console.log(Conexiones_API)
        }

        res.json({
            status: 200,
            message: 'ok',
            rows,
            Login
        });
    });


});
//Obtener todos los Usuarios
router.get('/api/users', async (req, res) => {




    await connection.query("call sp_usuarios_get_all() ", (err, rows, fields) => {

        if (err) throw err;
        console.log(rows)
        res.json({
            status: 200,
            message: 'ok',
            rows,

        })

    });

});
// Obtener Usuario por ID
router.get('/api/users/:id', async (req, res) => {

    let { id } = req.params;

    await connection.query("call sp_usuarios_get_by_id(?) ", id, (err, rows, fields) => {

        if (err) throw err;
        console.log(rows)
        res.json({
            status: 200,
            message: 'ok',
            rows,

        })
    })



});


//Eliminar Usuario

router.delete('/api/delete-user/:id', async (req, res) => {


    let { id } = req.params;

    await connection.query("call sp_usuarios_delete(?) ", id, (err, rows, fields) => {

        if (err) throw err;
        console.log(rows)
        res.json({
            status: 200,
            message: 'Eliminado',


        })
    })
});

//Crear la conexion a la base de datos por Id de susuario 
router.post('/api/crear-conexiones/:userId', async (req, res) => {


    let  userId = req.params;

    const nuevaConexion = {

        IpPublica,
        user,
        contrasenaMotor,
        empresa,

    } = req.body;

    var id = nuevaConexion.id;
    if (typeof id === 'undefined') {
        id = null;
    }

    await connection.query("call sp_conexiones_save(?,?,?,?,?,?) ", [nuevaConexion.IpPublica, nuevaConexion.user, nuevaConexion.contrasenaMotor, nuevaConexion.empresa, userId.userId, null], (err, rows, fields) => {

        if (err) throw err;
        console.log(rows)
        res.json({
            status: 200,
            message: 'usuario creado',
            nuevaConexion
        })

    });

});


//Conectarse a la base de datos por Id de usuario
router.get('/api/ver-conexiones/:userId', async (req, res) => {

    let { userId } = req.params;

    await connection.query("call sp_conexiones_get_by_usuario_id(?) ", userId, (err, rows, fields) => {

        if (err) throw err;
        console.log(rows)
        res.json({
            status: 200,
            message: 'usuario creado',
            rows
        })

    });

});

router.get('/api/logout/:userId', async (req, res) => {

    let userId  = req.params;

    var item = Conexiones_API.filter(function (r) {
        return r.userId == userId;
    })[0];

    if (typeof item !== "undefined") {
        item.connection.end(function (error) {
            if (error) {
                return console.log(error.message);
            }
            console.log("Conexion de usuario cerrada ");

            Conexiones_API = Conexiones_API.filter(function (r) {
                return r.userId != userId;
            });
        });
    }

    console.log(Conexiones_API);

});


module.exports = router;