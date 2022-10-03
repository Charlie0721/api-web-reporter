const express = require('express');
const mysql = require('mysql');

const router = express.Router();

router.get('/api/documentos/pedidos-comerciales/almacenes/:userId', async (req, res) => {

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


router.post('/api/documentos/pedidos-comerciales/:idalmacen/:userId', async (req, res) => {


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
                    await item.connection.query(`SELECT a.*, b.nit, CONCAT(b.nombres, ' ', b.apellidos) AS nomtercero, c.valordev, c.ivadev, (ABS(c.valordev) - c.ivadev) AS subtotaldev, alm.nomalmacen
                    FROM pedidos a
                    LEFT JOIN terceros b ON (a.idtercero = b.idtercero)
                    LEFT JOIN almacenes alm ON (a.idalmacen = alm.idalmacen)
                    LEFT JOIN (SELECT idpedido, SUM(valordev) AS valordev, SUM(valimpuestos) AS ivadev
                    FROM  devventas
                    WHERE !ISNULL(idpedido)
                    GROUP BY idpedido) c ON (a.idpedido = c.idpedido)
                    WHERE a.fecha BETWEEN ${fecha1} AND ${fecha2} AND alm.idempresa = 1 
                    ORDER BY fecha, numero ASC `, (err, rows, fields) => {

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
                    await item.connection.query(`SELECT a.*, b.nit, CONCAT(b.nombres, ' ', b.apellidos) AS nomtercero, c.valordev, c.ivadev, (ABS(c.valordev) - c.ivadev) AS subtotaldev, alm.nomalmacen
                    FROM pedidos a
                    LEFT JOIN terceros b ON (a.idtercero = b.idtercero)
                    LEFT JOIN almacenes alm ON (a.idalmacen = alm.idalmacen)
                    LEFT JOIN (SELECT idpedido, SUM(valordev) AS valordev, SUM(valimpuestos) AS ivadev
                    FROM devventas
                    WHERE !ISNULL(idpedido)
                    GROUP BY idpedido) c ON (a.idpedido = c.idpedido)
                    WHERE  a.fecha BETWEEN ${fecha1} AND ${fecha2} AND a.idalmacen = ${idalmacen}
                    ORDER BY fecha, numero ASC `, (err, rows, fields) => {

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


router.get('/api/pedidos/:numero/:idalmacen/:userId', async (req, res) => {


    try {
        let userId = req.params.userId
        const { numero } = req.params;
        const { idalmacen } = req.params;

        var item = Conexiones_API.filter(function (r) {


            return r.userId == userId
        })[0];

        if (typeof item !== "undefined") {
            await item.connection.query(`SELECT
            pedidos.numero, pedidos.valortotal, pedidos.subtotal, pedidos.valimpuesto, detpedidos.descuento, pedidos.valdescuentos, productos.descripcion, detpedidos.valorprod, detpedidos.porcdesc, pedidos.fecha, terceros.nombres, terceros.apellidos, detpedidos.cantidad
          FROM
            detpedidos
            JOIN productos ON detpedidos.idproducto = productos.idproducto
            JOIN pedidos ON detpedidos.idpedido = pedidos.idpedido
            JOIN terceros ON pedidos.idtercero = terceros.idtercero
          WHERE
            numero = ${numero} AND pedidos.idalmacen = ${idalmacen}`, (err, rows, fields) => {

                if (err) throw err;
                res.status(200).json({
                    status: 200,
                    message: 'Pedido encontrado satisfactoriamente',
                    rows,
                    datos1: rows[0]
                })


            })

        } else {
            console.log('data not found')
            res.status(401).json({
                message: 'No hay informacion para mostrar'
            })
        }


    } catch (error) {
        console.log(error)
        res.status(401).json({
            message: 'No hay informacion para mostrar'
        })
    }




})



module.exports = router;