const express = require('express');
const mysql = require('mysql');

const router = express.Router();

router.get('/api/formas-pago/pedidos-comerciales/almacenes/:userId', async (req, res) => {

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


router.post('/api/formas-pago/pedidos-comerciales/:idalmacen/:userId', async (req, res) => {


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

            if (idalmacen == 0) {

                if (typeof item !== "undefined") {
                    await item.connection.query(`SELECT a.idpago, nompago, SUM(a.valor) AS valor, alm.nomalmacen
                    FROM cuotaspedido a
                    LEFT JOIN pedidos b ON (a.idpedido = b.idpedido)
                    LEFT JOIN tarjetascre e ON (a.idtarjeta = e.idtarjetacre)
                    LEFT JOIN bancos f ON (a.idbanco = f.idbanco)
                    LEFT JOIN terceros d ON (b.idtercero = d.idtercero)
                    LEFT JOIN formaspago c ON (a.idpago = c.idpago)
                    LEFT JOIN almacenes alm ON (b.idalmacen = alm.idalmacen)
                    WHERE b.fecha BETWEEN ${fecha1} AND ${fecha2} AND b.estado = 0 AND ISNULL(b.idfactura) AND alm.idempresa = 1
                    GROUP BY a.idpago ORDER BY a.idpago ASC `, (err, rows, fields) => {

                        if (err) throw err;
                        res.status(200).json({
                            status: 200,
                            message: 'Informacion consultada satisfactoriamente',
                            rows

                        })

                    })

                } else {
                    console.log("Sin informacion")
                }

            } else {

                if (typeof item !== "undefined") {
                    await item.connection.query(`SELECT a.idpago, nompago, SUM(a.valor) AS valor, alm.nomalmacen
                    FROM cuotaspedido a
                    LEFT JOIN pedidos b ON (a.idpedido = b.idpedido)
                    LEFT JOIN tarjetascre e ON (a.idtarjeta = e.idtarjetacre)
                    LEFT JOIN bancos f ON (a.idbanco = f.idbanco)
                    LEFT JOIN terceros d ON (b.idtercero = d.idtercero)
                    LEFT JOIN formaspago c ON (a.idpago = c.idpago)
                    LEFT JOIN almacenes alm ON (b.idalmacen = alm.idalmacen) 
                    WHERE b.fecha BETWEEN  ${fecha1} AND ${fecha2}  AND b.estado = 0 AND ISNULL(b.idfactura) AND b.idalmacen = ${idalmacen}
                    GROUP BY a.idpago ORDER BY a.idpago ASC `, (err, rows, fields) => {

                        if (err) throw err;
                        res.status(200).json({
                            status: 200,
                            message: 'Informacion consultada satisfactoriamente',
                            rows

                        })

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