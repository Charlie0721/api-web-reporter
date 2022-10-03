const express = require('express');
const mysql = require('mysql');

const router = express.Router();

router.get('/api/productos/pedidos-comerciales/almacenes/:userId', async (req, res) => {

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


router.post('/api/productos/pedidos-comerciales/:idalmacen/:userId', async (req, res) => {


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
                    await item.connection.query(`SELECT c.idproducto, c.codigo, c.descripcion AS descrip, c.costo, c.ultcosto, b.valdescuentos AS descue, a.valorprod, a.cantidad, a.descuento,(a.valorprod * a.cantidad) AS total_venta, a.porcdesc, a.porciva, a.ivaprod, a.Base, b.valretenciones AS retenc, b.numero, b.fecha, b.hora, d.inclprecio, c.barcode, CONCAT(f.apellidos, ' ', f.apellido2, ' ', f.nombres, ' ', f.nombre2) AS nomtercero, f.nit AS nittercero, CONCAT(h.apellidos, ' ', h.apellido2, ' ', h.nombres, ' ', h.nombre2) AS nomvendedor, h.nit AS nitvendedor, b.idusuario, alm.nomalmacen
                    FROM detpedidos a
                    LEFT JOIN pedidos b ON (a.idpedido = b.idpedido)
                    LEFT JOIN productos c ON (a.idproducto = c.idproducto)
                    LEFT JOIN iva d ON (c.codiva = d.codiva)
                    LEFT JOIN terceros f ON (b.idtercero = f.idtercero)
                    LEFT JOIN terceros h ON (b.idvendedor = h.idtercero)
                    LEFT JOIN almacenes alm ON (b.idalmacen = alm.idalmacen)
                    WHERE c.tipo = 1 AND b.fecha BETWEEN ${fecha1} AND ${fecha2} AND alm.idempresa = 1
                    ORDER BY
                    c.descripcion, b.numero ASC `, (err, rows, fields) => {

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
                    await item.connection.query(`SELECT c.idproducto, c.codigo, c.descripcion AS descrip, c.costo, c.ultcosto, b.valdescuentos AS descue, a.valorprod, a.cantidad, a.descuento,(a.valorprod * a.cantidad) AS total_venta, a.porcdesc, a.porciva, a.ivaprod, a.Base, b.valretenciones AS retenc, b.numero, b.fecha, b.hora, d.inclprecio, c.barcode, CONCAT(f.apellidos, ' ', f.apellido2, ' ', f.nombres, ' ', f.nombre2) AS nomtercero, f.nit AS nittercero, CONCAT(h.apellidos, ' ', h.apellido2, ' ', h.nombres, ' ', h.nombre2) AS nomvendedor, h.nit AS nitvendedor, b.idusuario, alm.nomalmacen
                    FROM detpedidos a
                    LEFT JOIN pedidos b ON (a.idpedido = b.idpedido)
                    LEFT JOIN productos c ON (a.idproducto = c.idproducto)
                    LEFT JOIN iva d ON (c.codiva = d.codiva)
                    LEFT JOIN terceros f ON (b.idtercero = f.idtercero)
                    LEFT JOIN terceros h ON (b.idvendedor = h.idtercero)
                    LEFT JOIN almacenes alm ON (b.idalmacen = alm.idalmacen)
                    WHERE c.tipo = 1 AND b.fecha BETWEEN ${fecha1} AND ${fecha2} AND b.idalmacen = ${idalmacen}
                    ORDER BY c.descripcion, b.numero ASC `, (err, rows, fields) => {

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