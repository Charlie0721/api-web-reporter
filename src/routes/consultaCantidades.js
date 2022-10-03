const express = require('express');
const mysql = require('mysql');

const router = express.Router();



router.get('/consultar-cantidades-inventario/:userId', async (req, res) => {

    try {
        let  userId  = req.params.userId
        var item = Conexiones_API.filter(function (r) {


            return r.userId == userId
        })[0];


        if (typeof item !== "undefined") {
            await item.connection.query('SELECT productos.idproducto,productos.barcode, productos.codigo, productos.descripcion, inventario.cantidad, almacenes.nomalmacen ' +
                'FROM inventario ' +
                'INNER JOIN productos ON inventario.idproducto = productos.idproducto ' +
                'INNER JOIN almacenes ON inventario.idalmacen = almacenes.idalmacen where cantidad <> 0', (err, rows, fields) => {

                    if (err) throw err;

                    if (rows.length > 0) {
                        res.status(200).json({
                            status: 200,
                            message: 'Productos encontrados satisfactoriamente',
                            rows
                        })
                    } else {
                        res.status(401).json({
                            status: 401,
                            message: 'Producto no encontrado en la base de datos'

                        })

                    }

                })

        } 

    } catch (error) {
        console.log(error)
    }

});



module.exports = router;