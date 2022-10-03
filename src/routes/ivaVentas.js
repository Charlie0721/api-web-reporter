const express = require('express');
const mysql = require('mysql');

const router = express.Router();



router.get('/api/iva-ventas/almacenes/:userId', async (req, res) => {

    try {

        let userId = req.params.userId
        var item = Conexiones_API.filter(function (r) {
            return r.userId == userId
        })[0];


        if (typeof item !== "undefined") {
            await item.connection.query('SELECT idalmacen, nomalmacen FROM almacenes WHERE activo = 1;',

                (err, rows, fields) => {

                    if (err) throw err;
                    res.status(200).json({
                        status: 200,
                        message: 'Almacenes encontrados',
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


router.post('/informe/iva-ventas/:idalmacen/:userId', async (req, res) => {

    try {
        let id = req.params.idalmacen;
        let userId = req.params.userId
        let fecha1 = req.body.fechaIni;
        let fecha2 = req.body.fechaFin;

        if (fecha1 === '' || fecha1 === null || fecha2 === '' || fecha2 === null) {
            res.status(404).json({
                status: 404,
                message: 'debe ingresar un rango de fechas validas'
            })
        } else {

            if (id == 0) {
                var item = Conexiones_API.filter(function (r) {
                    return r.userId == userId
                })[0];
                if (typeof item !== "undefined") {
                    await item.connection.query('SELECT e.*, SUM(a.base) AS baseiva, SUM(a.ivaprod) AS iva, a.porciva, SUM(baseexp) AS basedev, SUM(ivaexp) AS ivadev, SUM(totdevprod) AS totdevprod ' +
                        'FROM  detfacturas a ' +
                        'LEFT JOIN facturas b ON (a.idfactura = b.idfactura) ' +
                        'LEFT JOIN (SELECT b.idmovfacturas, a.idfactura, b.idproducto, SUM(b.valorprod) AS totdevprod, SUM(b.devuelve) AS devuelve, SUM(b.ivaprod * b.devuelve) AS ivaexp, SUM(b.base) AS baseexp ' +
                        'FROM devventas a ' +
                        'LEFT JOIN detdevventas b ON (a.iddevventas = b.iddevventas) ' +
                        'GROUP BY b.idmovfacturas) g ON (a.idmovfacturas = g.idmovfacturas) ' +
                        'LEFT JOIN productos c ON (a.idproducto = c.idproducto) ' +
                        'LEFT JOIN iva e ON (a.codiva = e.codiva) ' +
                        'LEFT JOIN almacenes alm ON (b.idalmacen = alm.idalmacen) ' +
                        'WHERE b.fecha BETWEEN ' + fecha1 + ' AND ' + fecha2 + ' AND b.estado = 0 AND alm.idempresa = 1 ' +
                        'GROUP BY a.codiva ORDER BY a.codiva ', (err, rows, fields) => {

                            if (err) throw err;
                            if (rows.length > 0) {
                                res.status(200).json({
                                    status: 200,
                                    message: 'Informacion consultada satisfactoriamente',
                                    rows
                                })
                            } else {

                                res.status(401).json({
                                    status: 401,
                                    message: 'No se encuentra informacion en la base de datos'

                                })

                            }

                        })

                } else {
                    console.log("Sin informacion")
                }

            } else {
                var item = Conexiones_API.filter(function (r) {
                    return r.userId == userId
                })[0];
                if (typeof item !== "undefined") {
                    await item.connection.query('SELECT e.*, SUM(a.base) AS baseiva, SUM(a.ivaprod) AS iva, a.porciva, SUM(baseexp) AS basedev, SUM(ivaexp) AS ivadev, SUM(totdevprod) AS totdevprod '
                        + 'FROM detfacturas a '
                        + 'LEFT JOIN facturas b ON (a.idfactura = b.idfactura) '
                        + 'LEFT JOIN  (SELECT b.idmovfacturas, a.idfactura, b.idproducto, SUM(b.valorprod) AS totdevprod, SUM(b.devuelve) AS devuelve, SUM(b.ivaprod * b.devuelve) AS ivaexp, SUM(b.base) AS baseexp '
                        + 'FROM devventas a LEFT JOIN detdevventas b ON (a.iddevventas = b.iddevventas) '
                        + 'GROUP BY b.idmovfacturas) g ON (a.idmovfacturas = g.idmovfacturas) '
                        + 'LEFT JOIN productos c ON (a.idproducto = c.idproducto) LEFT JOIN iva e ON (a.codiva = e.codiva) ' +
                        'WHERE b.fecha BETWEEN ' + fecha1 + ' AND ' + fecha2 + ' AND b.estado = 0 AND b.idalmacen =  ' + id
                        + ' GROUP BY a.codiva ORDER BY a.codiva ', (err, rows, fields) => {

                            if (err) throw err;
                            if (rows.length > 0) {
                                res.status(200).json({
                                    status: 200,
                                    message: 'Informacion consultada satisfactoriamente',
                                    rows
                                })
                            } else {

                                res.status(401).json({
                                    status: 401,
                                    message: 'No se encuentra informacion en la base de datos'

                                })


                            }

                        })

                } else {
                    console.log("Sin informacion")
                }

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
