const express = require('express');
const mysql = require('mysql');

const router = express.Router();



router.get('/api/mov-inventarios/numero-entradas/:userId', async (req, res) => {

    try {

        let userId = req.params.userId
        var item = Conexiones_API.filter(function (r) {
            return r.userId == userId
        })[0];

        if (typeof item !== "undefined") {
            await item.connection.query('SELECT numero, idconceptajuste FROM ctrajustes WHERE numero > 0 AND idconceptajuste = 1;', (err, rows, fields) => {

                if (err) throw err;

                if (rows.length > 0) {
                    res.status(200).json({
                        status: 200,
                        message: 'Numero de entradas encontrado satisfactoriamente',
                        rows
                    })
                } else {
                    res.status(401).json({
                        status: 401,
                        message: 'Debe crear minimo una entrada de productos en CXPOS'

                    })

                }

            })

        } else {
            console.log("Sin informacion")
        }
    } catch (error) {
        console.log(error)
    }

});


router.get('/api/mov-inventarios/terceros/:userId', async (req, res) => {

    try {

        let userId = req.params.userId
        var item = Conexiones_API.filter(function (r) {
            return r.userId == userId
        })[0];

        if (typeof item !== "undefined") {
            await item.connection.query('SELECT idtercero, nit, nombres FROM terceros;', (err, rows, fields) => {

                if (err) throw err;

                if (rows.length > 0) {
                    res.status(200).json({
                        status: 200,
                        message: 'terceros encontrados satisfactoriamente',
                        rows
                    })
                } else {
                    res.status(401).json({
                        status: 401,
                        message: 'No existen datos en CXPOS'

                    })

                }

            })
        } else {
            console.log("Sin informacion")
        }



    } catch (error) {
        console.log(error)
    }

});


router.get('/api/mov-inventarios/almacenes/:userId', async (req, res) => {

    try {

        let userId = req.params.userId
        var item = Conexiones_API.filter(function (r) {
            return r.userId == userId
        })[0];

        if (typeof item !== "undefined") {
            await item.connection.query('SELECT idalmacen, nomalmacen FROM almacenes WHERE activo = 1;', (err, rows, fields) => {

                if (err) throw err;

                if (rows.length > 0) {
                    res.status(200).json({
                        status: 200,
                        message: 'Numero de entradas encontrado satisfactoriamente',
                        rows
                    })
                } else {
                    res.status(401).json({
                        status: 401,
                        message: 'Debe crear minimo una entrada de productos en CXPOS'

                    })

                }

            })

        } else {
            console.log("Sin informacion")
        }



    } catch (error) {
        console.log(error)
    }

});

router.post('/api/mov-inventarios/ingresa-entrada/:userId', async (req, res) => {

    try {
        let userId = req.params.userId
        const IngMovInvEntrada = {
            fecha,
            idalmacen,
            detalle,
            estado,
            idconceptajuste,
            numero,
            idtercero

        } = req.body

        var item = Conexiones_API.filter(function (r) {
            return r.userId == userId
        })[0];

        if (typeof item !== "undefined") {
            await item.connection.query('INSERT INTO ctrajustes SET? ',

                [IngMovInvEntrada], (err, rows, fields) => {

                    if (err) throw err;
                    res.status(200).json({
                        status: 200,
                        message: 'Movimiento Ingresado satisfactoriamente',
                        rows
                    })

                });


        } else {
            console.log("Sin informacion")
        }

    } catch (error) {
        console.log(error)
        res.status(401).json({
            message: error
        });
    }

});

router.get('/api/mov-inventarios/ingresa-entrada/detalle/:idalmacen/:userId', async (req, res) => {

    const { idalmacen } = req.params
    let userId = req.params.userId
    try {
        var item = Conexiones_API.filter(function (r) {
            return r.userId == userId
        })[0];

        if (typeof item !== "undefined") {
            await item.connection.query('SELECT productos.idproducto, productos.costo, productos.precioventa, productos.descripcion,productos.barcode,productos.codigo, inventario.cantidad, almacenes.nomalmacen ' +
                'FROM inventario ' +
                'INNER JOIN productos ON inventario.idproducto = productos.idproducto ' +
                'INNER JOIN almacenes ON inventario.idalmacen = almacenes.idalmacen ' +
                'WHERE ' +
                'inventario.idalmacen=? ', [idalmacen], (err, rows, fields) => {

                    if (err) throw err;

                    if (rows.length > 0) {
                        res.status(200).json({
                            status: 200,
                            message: 'Datos encontrados',
                            rows
                        })
                    } else {
                        res.status(401).json({
                            status: 401,
                            message: "No existen datos"

                        })

                    }

                })

        } else {
            console.log("Sin informacion")
        }


    } catch (error) {
        console.log(error)
    }

});


router.post('/api/mov-inventarios/ingresa-entrada/detalle/:userId', async (req, res) => {

    try {
        let userId = req.params.userId
        const IngMovInvEntradaDetalle = {


            idajuste,
            idproducto,
            idalmacen,
            entrada,
            salida,
            idusuario


        } = req.body

        var item = Conexiones_API.filter(function (r) {
            return r.userId == userId
        })[0];

        if (typeof item !== "undefined") {
            await item.connection.query('INSERT INTO ajustesinv SET? ',

                [IngMovInvEntradaDetalle], (err, rows, fields) => {

                    if (err) throw err;
                    res.status(200).json({
                        status: 200,
                        message: 'Entrada de producto ingresada satisfactoriamente',
                        rows
                    })

                });


        } else {
            console.log("Sin informacion")
        }


    } catch (error) {
        console.log(error)
        res.status(401).json({
            message: error
        });
    }

});

module.exports = router;