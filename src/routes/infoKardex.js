const express = require('express');
const mysql = require('mysql');

const router = express.Router();




router.get('/api/kardex/almacenes/:userId', async (req, res) => {

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

router.post('/kardex/saldos/:idalmacen/:userId', async (req, res) => {

    try {
        let userId = req.params.userId;
        let idalmacen = req.params.idalmacen;
        let fecha1 = req.body.fechaIni;
        let fecha2 = req.body.fechaFin;

        if (fecha1 === '' || fecha1 === null || fecha2 === '' || fecha2 === null) {
            res.status(404).json({
                status: 404,
                message: 'debe ingresar un rango de fechas validas'
            })
        } else {

            var item = Conexiones_API.filter(function (r) {


                return r.userId == userId
            })[0];


            if (typeof item !== "undefined") {
                await item.connection.query('SELECT a.* FROM  (SELECT a.idproducto, d.codigo, d.barcode, d.descripcion, saldoant, c.cantent, b.cantsal, a.saldocant ' +
                    'FROM  (SELECT  a.idproducto, saldocant, saldoant ' +
                    'FROM  (SELECT a.idproducto, a.saldocant ' +
                    'FROM kardex a LEFT JOIN (SELECT a.idproducto, MAX(idkardex) AS maxidkardex ' +
                    'FROM (SELECT * FROM (SELECT * FROM kardex a ' +
                    'WHERE a.fechakardex BETWEEN ' + fecha1 + ' AND ' + fecha2 + ' AND a.idalmacen =' + idalmacen + ')' + ' a ' +
                    'ORDER BY idproducto) a ' +
                    'GROUP BY idproducto) b ON (a.idkardex = b.maxidkardex) ' +
                    'WHERE a.idkardex = b.maxidkardex) a LEFT JOIN (SELECT a.idproducto, a.saldoant ' +
                    'FROM kardex a LEFT JOIN (SELECT a.idproducto, MIN(idkardex) AS minidkardex ' +
                    'FROM (SELECT * FROM (SELECT * FROM kardex a ' +
                    'WHERE a.fechakardex BETWEEN ' + fecha1 + ' AND ' + fecha2 + ' AND a.idalmacen =' + idalmacen + ')' + ' a ' +
                    'ORDER BY idproducto) a ' +
                    'GROUP BY idproducto) b ON (a.idkardex = b.minidkardex) ' +
                    'WHERE a.idkardex = b.minidkardex) b ON a.idproducto = b.idproducto) a ' +
                    'LEFT JOIN (SELECT idproducto, SUM(cantidad) AS cantsal ' +
                    'FROM (SELECT * FROM kardex a ' +
                    'WHERE a.fechakardex BETWEEN ' + fecha1 + ' AND ' + fecha2 + ' AND a.idalmacen =' + idalmacen + ')' + ' a ' +
                    'WHERE tipomov = "-" ' +
                    'GROUP BY idproducto) b ON (a.idproducto = b.idproducto) ' +
                    'LEFT JOIN (SELECT idproducto, SUM(cantidad) AS cantent ' +
                    'FROM (SELECT * FROM kardex a ' +
                    'WHERE a.fechakardex BETWEEN ' + fecha1 + ' AND ' + fecha2 + ' AND a.idalmacen =' + idalmacen + ')' + ' a ' +
                    'WHERE tipomov = "+" ' +
                    'GROUP BY idproducto) c ON (a.idproducto = c.idproducto) ' +
                    'LEFT JOIN productos d ON (a.idproducto = d.idproducto)) a  ', (err, rows, fields) => {

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

    } catch (error) {
        console.log(error)
        res.status(401).json({
            message: error
        });
    }

});

router.get('/informes/Kardex/resumido/:idproducto/:idalmacen/:userId', async (req, res) => {


    try {
        let id = req.params.idproducto
        let idalmacen = req.params.idalmacen;
        let userId = req.params.userId
        var item = Conexiones_API.filter(function (r) {


            return r.userId == userId
        })[0];


        if (typeof item !== "undefined") {
            await item.connection.query('SELECT a.idkardex, a.numdocumento, a.tipodoc, a.idproducto, a.idalmacen, a.detallemov, a.fechamov, a.cantidad, a.costo, a.tipomov, a.saldocant, a.ultcosto, saldoant, a.costoant, a.fechakardex, b.codigo, b.barcode, b.descripcion, c.nomalmacen ' +
                'FROM kardex a ' +
                'LEFT JOIN productos b ON (a.idproducto = b.idproducto) ' +
                'LEFT JOIN almacenes c ON (a.idalmacen = c.idalmacen) ' +
                'WHERE a.idproducto = ' + id + ' AND a.idalmacen =  ' + idalmacen +' '+
                'ORDER BY idalmacen, idproducto, idkardex, fechakardex ', (err, rows, fields) => {
                    if (err) throw err;
                    if (rows.length > 0) {

                        res.status(200).json({
                            status: 200,
                            message: 'Producto encontrado satisfactoriamente',
                            rows,
                            data1: rows[0]
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

    } catch (error) {
        console.log(error)
        res.status(400).json({
            message: error
        })
    }

});

module.exports = router;
