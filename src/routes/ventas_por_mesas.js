const express = require('express');
const mysql = require('mysql');

const router = express.Router();


router.post('/consulta-ventas-por-mesas/:userId', async (req, res) => {


    try {
        let userId = req.params.userId
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
                await item.connection.query('SELECT IF(ISNULL(b.nomubicacion), "SIN MESA", b.nomubicacion) AS nomubicacion, SUM(a.valortotal) AS total, SUM(a.numpersonas) AS numper, IF(ISNULL(d.nomarea), "SIN AREA", d.nomarea) AS nomarea, d.idareaserv ' +
                    'FROM ordenes a ' +
                    'LEFT JOIN ubicaciones b ON (a.idubicacion = b.idubicacion) ' +
                    'LEFT JOIN arqueo c ON (a.idarqueo = c.idarqueo) ' +
                    'LEFT JOIN areaserv d ON (b.idareaserv = d.idareaserv) ' +
                    'LEFT JOIN almacenes alm ON (a.idalmacen = alm.idalmacen) ' +
                    'WHERE  a.numero > 0 AND a.estado = 2 AND a.fecha BETWEEN ' + fecha1 + ' AND ' + fecha2 + ' AND alm.idempresa = 1 ' +
                    'GROUP BY d.idareaserv, a.idubicacion ' +
                    'ORDER BY idareaserv   ', (err, rows, fields) => {

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



    } catch (error) {
        console.log(error)
        res.status(401).json({
            message: error
        });
    }

});

router.post('/ocupacion-mesas-periodos-de-tiempo/:userId', async (req, res) => {


    try {
        let userId = req.params.userId
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
                await item.connection.query('SELECT  SUM(ordenes) as mesasocupadas, fecha ' +
                    'FROM (SELECT IF(!ISNULL(a.idubicacion), 1, 0) AS ordenes, fecha ' +
                    'FROM ubicaciones b ' +
                    'LEFT JOIN (SELECT a.idubicacion, a.fecha ' +
                    'FROM ' +
                    'ordenes a ' +
                    'LEFT JOIN facturas c ON (a.idfactura = c.idfactura) ' +
                    'LEFT JOIN almacenes alm ON (a.idalmacen = alm.idalmacen) ' +
                    'WHERE ' +
                    ' a.estado = 0 OR a.estado = 2   AND a.fecha BETWEEN ' + fecha1 + ' AND ' + fecha2 + ' AND alm.idempresa = 1) a ON (a.idubicacion = b.idubicacion)) a ' +
                    'GROUP BY fecha ', (err, rows, fields) => {

                        if (err) throw err;
                        if (rows != null) {

                            res.status(200).json({
                                status: 200,
                                message: 'Informacion consultada satisfactoriamente',
                                rows

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

