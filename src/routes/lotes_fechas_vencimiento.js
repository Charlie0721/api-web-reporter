
const express = require('express');
const mysql = require('mysql');

const router = express.Router();


router.post('/lotes-fechas-vencimiento-por-vencer/:userId', async (req, res) => {

    try {
        let userId = req.params.userId
        let fecha1 = req.body.fechaIni;
       

        if (fecha1 === '' || fecha1 === null ) {
            res.status(404).json({
                status: 404,
                message: 'debe ingresar un rango de fecha valida'
            })
        } else {

            var item = Conexiones_API.filter(function (r) {
                return r.userId == userId
            })[0];


            if (typeof item !== "undefined") {
                await item.connection.query('SELECT pr.codigo, pr.barcode, pr.descripcion, dc.lote, STR_TO_DATE(CONCAT(dc.vence), "%Y%m%d") AS fechavenc  ' +
                    'FROM detcompras dc ' +
                    'LEFT JOIN compras com ON (dc.idcompra = com.idcompra) ' +
                    'LEFT JOIN productos pr ON (dc.idproducto = pr.idproducto) ' +
                    'WHERE ' +
                    'com.estado = 0 AND dc.vence > ' + fecha1 + ' AND com.aprobada = 1 ' +
                    'GROUP BY dc.idproducto, dc.lote ' +
                    'ORDER BY fechavenc ', (err, rows, fields) => {

                        if (err) throw err;

                        if (rows.length > 0) {

                            res.status(200).json({
                                status: 200,
                                message: 'Informacion consultada satisfactoriamente',
                                rows

                            })
                        } else {

                            res.status(400).json({
                                status: 400,
                                message: 'No existe informacion para esta fecha',

                            })
                        }

                    })

            } else {
                console.log("Sin informacion")
            }


        }

    } catch (error) {
        console.log(error)
        res.status(401).json({
            message: error
        });
    }

});



router.post('/lotes-fechas-vencimiento-vencidos/:userId', async (req, res) => {

    try {
        let userId = req.params.userId
        let fecha1 = req.body.fechaIni;
       

        if (fecha1 === '' || fecha1 === null ) {
            res.status(404).json({
                status: 404,
                message: 'debe ingresar un rango de fecha valida'
            })
        } else {

            var item = Conexiones_API.filter(function (r) {
                return r.userId == userId
            })[0];


            if (typeof item !== "undefined") {
                await item.connection.query('SELECT pr.codigo, pr.barcode, pr.descripcion, dc.lote, STR_TO_DATE(CONCAT(dc.vence), "%Y%m%d") AS fechavenc  ' +
                    'FROM detcompras dc ' +
                    'LEFT JOIN compras com ON (dc.idcompra = com.idcompra) ' +
                    'LEFT JOIN productos pr ON (dc.idproducto = pr.idproducto) ' +
                    'WHERE ' +
                    'com.estado = 0 AND dc.vence < ' + fecha1 + ' AND com.aprobada = 1 ' +
                    'GROUP BY dc.idproducto, dc.lote ' +
                    'ORDER BY fechavenc DESC ', (err, rows, fields) => {

                        if (err) throw err;

                        if (rows.length > 0) {

                            res.status(200).json({
                                status: 200,
                                message: 'Informacion consultada satisfactoriamente',
                                rows

                            })
                        } else {

                            res.status(400).json({
                                status: 400,
                                message: 'No existe informacion para esta fecha',

                            })
                        }

                    })

            } else {
                console.log("Sin informacion")
            }


        }

    } catch (error) {
        console.log(error)
        res.status(401).json({
            message: error
        });
    }

});



module.exports = router;

