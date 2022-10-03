const express = require('express');
const mysql = require('mysql');

const router = express.Router();



router.post('/consultar-inventario/:userId', async (req, res) => {

    try {
        let userId = req.params.userId
        let barcode = req.body.barcode;


        if (barcode === '' || barcode === null) {
            res.status(404).json({
                status: 404,
                message: 'debe ingresar un codigo de barras'
            })
        } else {

            var item = Conexiones_API.filter(function (r) {
                return r.userId == userId
            })[0];

            if (typeof item !== "undefined") {
                await item.connection.query('SELECT productos.barcode,productos.codigo, productos.descripcion, inventario.cantidad,' +
                    'almacenes.nomalmacen FROM inventario INNER JOIN productos ON inventario.idproducto = productos.idproducto INNER JOIN almacenes ON inventario.idalmacen=almacenes.idalmacen WHERE barcode = ?   GROUP BY nomalmacen;  ', barcode, (err, rows, fields) => {

                        if (err) throw err;

                        if (rows.length > 0) {
                            res.status(200).json({
                                status: 200,
                                message: 'Producto encontrado satisfactoriamente',
                                rows
                            })
                        } else {
                            res.status(401).json({
                                status: 401,
                                message: 'Producto no encontrado en la base de datos'

                            })

                        }

                    })

            } else {
                console.log("Sin informacion")
            }

        }

    } catch (error) {
        console.log(error)
    }

});



module.exports = router;

