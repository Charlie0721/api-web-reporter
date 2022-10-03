const express = require('express');
const mysql = require('mysql');

const router = express.Router();



router.get('/api/info-formas-pago/almacenes/:userId', async (req, res) => {

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

router.post('/informe-formas-de-pago/:idalmacen/:userId', async (req, res) => {

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


            if (idalmacen == 0) {
                var item = Conexiones_API.filter(function (r) {

                    return r.userId == userId
                })[0];

                if (typeof item !== "undefined") {
                    await item.connection.query('SELECT a.*, b.valor AS propina ' +
                        'FROM(SELECT a.idpago, nompago, b.idalmacen, almd.nomalmacen, SUM(a.valor) AS valor, SUM(b.valredondeo / cf.registros) AS Redondeo_pago ' +
                        'FROM cuotasfactura a ' +
                        'LEFT JOIN facturas b ON (a.idfactura = b.idfactura) ' +
                        'LEFT JOIN (SELECT idfactura, COUNT(*) registros ' +
                        'FROM cuotasfactura ' +
                        'GROUP BY idfactura) cf ON (cf.idfactura = b.idfactura) ' +
                        'LEFT JOIN tarjetascre e ON (a.idtarjeta = e.idtarjetacre) ' +
                        'LEFT JOIN bancos f ON (a.idbanco = f.idbanco) ' +
                        'LEFT JOIN terceros d ON (b.idtercero = d.idtercero) ' +
                        'LEFT JOIN formaspago c ON (a.idpago = c.idpago) ' +
                        'LEFT JOIN almacenes alm ON (b.idalmacen = alm.idalmacen) ' +
                        'LEFT JOIN almacenes almd ON (b.idalmacen = almd.idalmacen) ' +
                        'WHERE b.fecha BETWEEN ' + fecha1 + ' AND ' + fecha2 + ' AND b.estado = 0 AND alm.idempresa = 1 ' +
                        'GROUP BY b.idalmacen, a.idpago) a ' +
                        'LEFT JOIN (SELECT a.idpago, b.idalmacen, SUM(a.valor) AS valor ' +
                        'FROM propinas a ' +
                        'LEFT JOIN ordenes b ON (a.idorden = b.idorden) ' +
                        'LEFT JOIN facturas c ON (b.idfactura = c.idfactura) ' +
                        'LEFT JOIN almacenes alm ON (c.idalmacen = alm.idalmacen) ' +
                        'WHERE c.fecha BETWEEN ' + fecha1 + ' AND ' + fecha2 + ' AND c.estado = 0 AND alm.idempresa = 1 ' +
                        'GROUP BY b.idalmacen, a.idpago) b ON (a.idpago = b.idpago AND a.idalmacen = b.idalmacen) ' +
                        'GROUP BY a.idalmacen, a.idpago ' +
                        'ORDER BY a.idalmacen, a.idpago ASC  ', (err, rows, fields) => {

                            if (err) throw err;
                            res.status(200).json({
                                status: 200,
                                message: 'Informacion consultada satisfactoriamente',
                                rows
                            })

                        })

                }

            } else {
                var item = Conexiones_API.filter(function (r) {

                    return r.userId == userId
                })[0];
                if (typeof item !== "undefined") {
                    await item.connection.query('SELECT a.*, b.valor AS propina ' +
                        'FROM (SELECT a.idpago, nompago, b.idalmacen, almd.nomalmacen, SUM(a.valor) AS valor, SUM(b.valredondeo / cf.registros) AS Redondeo_pago ' +
                        'FROM cuotasfactura a ' +
                        'LEFT JOIN facturas b ON (a.idfactura = b.idfactura) ' +
                        'LEFT JOIN (SELECT idfactura, COUNT(*) registros ' +
                        'FROM cuotasfactura ' +
                        'GROUP BY idfactura) cf ON (cf.idfactura = b.idfactura) ' +
                        'LEFT JOIN tarjetascre e ON (a.idtarjeta = e.idtarjetacre) ' +
                        'LEFT JOIN bancos f ON (a.idbanco = f.idbanco) ' +
                        'LEFT JOIN terceros d ON (b.idtercero = d.idtercero) ' +
                        'LEFT JOIN formaspago c ON (a.idpago = c.idpago) ' +
                        'LEFT JOIN almacenes almd ON (b.idalmacen = almd.idalmacen) ' +
                        ' WHERE b.fecha BETWEEN ' + fecha1 + ' AND ' + fecha2 + ' AND b.estado = 0 AND b.idalmacen= ' + idalmacen +
                        ' GROUP BY b.idalmacen, a.idpago) a ' +
                        'LEFT JOIN (SELECT a.idpago, b.idalmacen, SUM(a.valor) AS valor ' +
                        'FROM propinas a ' +
                        'LEFT JOIN ordenes b ON (a.idorden = b.idorden) ' +
                        'LEFT JOIN facturas c ON (b.idfactura = c.idfactura) ' +
                        'WHERE c.fecha BETWEEN ' + fecha1 + ' AND ' + fecha2 + ' AND  c.estado = 0 AND c.idalmacen = ' + idalmacen +
                        ' GROUP BY b.idalmacen, a.idpago) b ON (a.idpago = b.idpago AND a.idalmacen = b.idalmacen) ' +
                        'GROUP BY a.idalmacen, a.idpago ' +
                        'ORDER BY a.idalmacen, a.idpago ASC ', (err, rows, fields) => {

                            if (err) throw err;
                            res.status(200).json({
                                status: 200,
                                message: 'Informacion consultada satisfactoriamente',
                                rows
                            })

                        })
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

