const express = require('express');
const mysql = require('mysql');

const router = express.Router();


router.get('/api/ventas-vendedor/almacenes/:userId', async (req, res) => {

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


router.post('/consulta-ventas-vendedor/:idalmacen/:userId', async (req, res) => {

    try {
        let userId = req.params.userId
        let id = req.params.idalmacen;
        let fecha1 = req.body.fechaIni;
        let fecha2 = req.body.fechaFin;

        if (fecha1 === '' || fecha1 === null || fecha1 === ' ' || fecha2 === '' || fecha2 === null || fecha2 === ' ') {
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
                    await item.connection.query('SELECT  COUNT(a.idfactura) AS cantidad, a.idvendedor, b.nit, CONCAT(b.nombres, " ", b.apellidos) AS nomvendedor, SUM(a.valortotal) AS valor, SUM(a.valimpuesto) AS valiva, SUM(a.subtotal) AS valsubtotal, SUM(a.otrosimpuestos) AS valico, SUM(a.valdescuentos) AS descuentos, SUM(c.valordev) AS valordev, SUM(d.valordev) AS valordevcau, alm.nomalmacen ' +
                    'FROM  facturas a ' +
                    'INNER JOIN ' +
                    '(SELECT idfactura FROM detfacturas df ' +
                    'WHERE cantidad > 0 ' +
                    'GROUP BY idfactura) df ON (a.idfactura = df.idfactura) ' +
                    'LEFT JOIN terceros b ON (a.idvendedor = b.idtercero) ' +
                    'LEFT JOIN ' +
                    '(SELECT idfactura, SUM(valordev) AS valordev ' +
                    'FROM devventas ' +
                    'GROUP BY  idfactura) c ON (a.idfactura = c.idfactura) ' +
                    'LEFT JOIN almacenes alm ON (a.idalmacen = alm.idalmacen) ' +
                    'LEFT JOIN ' +
                    '(SELECT IFNULL(a.idvendedor, f.idvendedor) idvendedor1, SUM(valordev) AS valordev ' +
                    'FROM devventas a ' +
                    'LEFT JOIN facturas f ON (a.idfactura = f.idfactura) ' +
                    'LEFT JOIN almacenes alm ON (a.idalmacen = alm.idalmacen) ' +
                    'WHERE ISNULL(idpedido) AND (ISNULL(f.estado OR f.estado = 0)) AND a.fecha BETWEEN ' + fecha1 + ' AND ' + fecha2 + ' AND alm.idempresa = 1 ' +
                    'GROUP BY idvendedor1) d ON (a.idvendedor = d.idvendedor1) ' +
                    'WHERE  a.fecha BETWEEN ' + fecha1 + ' AND ' + fecha2 + ' AND a.estado = 0 AND alm.idempresa = 1 ' + 
                    'GROUP BY  a.idvendedor ' +
                    'ORDER BY  valor ', (err, rows, fields) => {

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
                var item = Conexiones_API.filter(function (r) {
                    return r.userId == userId
                })[0];

                if (typeof item !== "undefined") {
                    await item.connection.query('SELECT  COUNT(a.idfactura) AS cantidad, a.idvendedor, b.nit, CONCAT(b.nombres, " ", b.apellidos) AS nomvendedor, SUM(a.valortotal) AS valor, SUM(a.valimpuesto) AS valiva, SUM(a.subtotal) AS valsubtotal, SUM(a.otrosimpuestos) AS valico, SUM(a.valdescuentos) AS descuentos, SUM(c.valordev) AS valordev, SUM(d.valordev) AS valordevcau, alm.nomalmacen ' +
                        'FROM  facturas a ' +
                        'INNER JOIN ' +
                        '(SELECT idfactura FROM detfacturas df ' +
                        'WHERE cantidad > 0 ' +
                        'GROUP BY idfactura) df ON (a.idfactura = df.idfactura) ' +
                        'LEFT JOIN terceros b ON (a.idvendedor = b.idtercero) ' +
                        'LEFT JOIN ' +
                        '(SELECT idfactura, SUM(valordev) AS valordev ' +
                        'FROM devventas ' +
                        'GROUP BY  idfactura) c ON (a.idfactura = c.idfactura) ' +
                        'LEFT JOIN almacenes alm ON (a.idalmacen = alm.idalmacen) ' +
                        'LEFT JOIN ' +
                        '(SELECT IFNULL(a.idvendedor, f.idvendedor) idvendedor1, SUM(valordev) AS valordev ' +
                        'FROM devventas a ' +
                        'LEFT JOIN facturas f ON (a.idfactura = f.idfactura) ' +
                        'LEFT JOIN almacenes alm ON (a.idalmacen = alm.idalmacen) ' +
                        'WHERE ISNULL(idpedido) AND (ISNULL(f.estado OR f.estado = 0)) AND a.fecha BETWEEN ' + fecha1 + ' AND ' + fecha2 + ' AND a.idalmacen = ' + id +
                        ' GROUP BY idvendedor1) d ON (a.idvendedor = d.idvendedor1) ' +
                        'WHERE  a.fecha BETWEEN ' + fecha1 + ' AND ' + fecha2 + ' AND a.estado = 0 AND a.idalmacen = ' + id +
                        ' GROUP BY  a.idvendedor ' +
                        'ORDER BY  valor DESC, a.idalmacen ', (err, rows, fields) => {

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

