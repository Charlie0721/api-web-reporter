const express = require('express');
const mysql = require('mysql');

const router = express.Router();

router.get('/api/consulta-costeo-inventarios/almacenes/:userId', async (req, res) => {

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


router.get('/consultar-cantidades-inventario/costeo-inventario/:idalmacen/:userId', async (req, res) => {

    try {
        let userId = req.params.userId
        let idalmacen = req.params.idalmacen
        if (idalmacen == 0) {
            var item = Conexiones_API.filter(function (r) {
                return r.userId == userId
            })[0];

            if (typeof item !== "undefined") {
                await item.connection.query('SELECT b.cantidad cantidad, b.idproducto, a.referencia, a.descripcion AS descrip, a.codigo, a.barcode, a.costo, i.porcentaje, (a.costo * b.cantidad) AS costoivuc,  (a.costo * (i.porcentaje / 100)) AS valiva, a.precioventa, (a.precioventa*b.cantidad) AS valorizado, a.ultcosto, (a.ultcosto * b.cantidad) as costoPond,  c.nomalmacen, IF(impuestoico = 1, a.valorico, 0) AS valico ' +
                    'FROM productos a ' +
                    'LEFT JOIN inventario b ON (a.idproducto = b.idproducto) ' +
                    'LEFT JOIN iva i ON (a.codivacomp = i.codiva) ' +
                    'LEFT JOIN almacenes c ON (b.idalmacen = c.idalmacen) ' +
                    'LEFT JOIN almacenes alm ON (b.idalmacen = alm.idalmacen) ' +
                    'LEFT JOIN localizacionesalmacenes la ON (b.idproducto = la.idproducto AND b.idalmacen = la.idalmacen) ' +
                    'WHERE a.tipo = 1 AND alm.idempresa = 1 AND b.cantidad > 0 AND a.estado = 1 ' +
                    'ORDER BY a.codigo, b.idalmacen ASC ', (err, rows, fields) => {

                        if (err) throw err;

                        if (rows.length > 0) {
                            res.status(200).json({
                                status: 200,
                                message: 'Productos y cantidades encontradas satisfactoriamente',
                                rows
                            })
                        } else {
                            res.status(401).json({
                                status: 401,
                                message: 'Informacion no encrtontrada en la base de datos'
                            })
                        }
                    })
            }


        } else {
            var item = Conexiones_API.filter(function (r) {
                return r.userId == userId
            })[0];
            if (typeof item !== "undefined") {
                await item.connection.query('SELECT b.cantidad cantidad, b.idproducto, a.referencia, a.descripcion AS descrip, a.codigo, a.barcode, a.costo, i.porcentaje, (a.costo * b.cantidad) AS costoivuc,  (a.costo * (i.porcentaje / 100)) AS valiva, a.precioventa, (a.precioventa*b.cantidad) AS valorizado, a.ultcosto, (a.ultcosto * b.cantidad) as costoPond,  c.nomalmacen, IF(impuestoico = 1, a.valorico, 0) AS valico ' +
                    'FROM productos a ' +
                    'LEFT JOIN inventario b ON (a.idproducto = b.idproducto) ' +
                    'LEFT JOIN iva i ON (a.codivacomp = i.codiva) ' +
                    'LEFT JOIN almacenes c ON (b.idalmacen = c.idalmacen) ' +
                    'LEFT JOIN localizacionesalmacenes la ON (b.idproducto = la.idproducto AND b.idalmacen = la.idalmacen) ' +
                    'WHERE a.tipo = 1 AND b.idalmacen IN ' + '(' + idalmacen + ') ' + ' AND b.cantidad > 0 AND a.estado = 1 ' +
                    'ORDER BY a.codigo, b.idalmacen ASC ', (err, rows, fields) => {

                        if (err) throw err;

                        if (rows.length > 0) {
                            res.status(200).json({
                                status: 200,
                                message: 'Productos y cantidades encontradas satisfactoriamente',
                                rows
                            })
                        } else {
                            res.status(401).json({
                                status: 401,
                                message: 'Informacion no encrtontrada en la base de datos'
                            })
                        }
                    })
            }

        }

    } catch (error) {
        console.log(error)
    }
});

module.exports = router;