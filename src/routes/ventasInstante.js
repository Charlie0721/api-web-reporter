const { response } = require('express');
const express = require('express');
const mysql = require('mysql');

const router = express.Router();



router.post('/ventas-instantaneas/:userId', async (req, res) => {

    try {
        let userId = req.params.userId
        let fecha1 = req.body.fechaIni;


        if (fecha1 === '' || fecha1 === null) {
            res.status(404).json({
                status: 404,
                message: 'debe ingresar un rango de fecha valida'
            })
        } else {
            var item = Conexiones_API.filter(function (r) {
                return r.userId == userId
            })[0];

            if (typeof item !== "undefined") {
                await item.connection.query(' SELECT   a.fecha, a.idalmacen, a.prodvendid, e.subtot, e.ivaimp, a.costoacum, e.sumdesc, e.total, e.retencion, e.cantfact, f.valordev, e.valpropina, e.total + IF(ISNULL(e.valpropina), 0, e.valpropina) AS totalconprop, almd.nomalmacen, e.otrosimpuestos, e.impuestoinc  ' +
                    'FROM (SELECT a.idalmacen, a.fecha, SUM(a.valortotal) AS total, COUNT(a.idfactura) AS cantfact, SUM(a.valretenciones) AS retencion, SUM(a.valimpuesto) AS ivaimp, SUM(a.subtotal) AS subtot, SUM(a.valdescuentos) AS sumdesc, SUM(b.propina) AS valpropina, SUM(a.otrosimpuestos) otrosimpuestos, SUM(a.impuestoinc) impuestoinc ' +
                    'FROM facturas a ' +
                    'LEFT JOIN ordenes b ON (a.idfactura = b.idfactura) ' +
                    'LEFT JOIN almacenes alm ON (a.idalmacen = alm.idalmacen) ' +
                    'WHERE a.fecha = ' + fecha1 + ' AND a.estado = 0 AND alm.idempresa = 1 ' +
                    'GROUP BY  a.idalmacen, a.fecha ' +
                    'ORDER BY  a.idalmacen, a.fecha ASC) AS e ' +
                    'LEFT JOIN (SELECT a.idalmacen, a.fecha, SUM(b.valordev) AS valordev ' +
                    'FROM facturas a ' +
                    'LEFT JOIN devventas b ON (a.idfactura = b.idfactura) ' +
                    'LEFT JOIN almacenes alm ON (a.idalmacen = alm.idalmacen) ' +
                    'WHERE a.fecha = ' + fecha1 + ' AND a.estado = 0 AND alm.idempresa = 1 ' +
                    'GROUP BY a.idalmacen, a.fecha ' +
                    'ORDER BY a.idalmacen, a.fecha ASC) f ON (e.fecha = f.fecha AND e.idalmacen = f.idalmacen) ' +
                    'LEFT JOIN (SELECT a.fecha, a.idalmacen, SUM(b.cantidad) AS prodvendid, SUM(c.ultcosto * b.cantidad) AS costoacum ' +
                    'FROM facturas a ' +
                    'LEFT JOIN detfacturas b ON (a.idfactura = b.idfactura) ' +
                    'LEFT JOIN productos c ON (b.idproducto = c.idproducto) ' +
                    'LEFT JOIN iva d ON (c.codiva = d.codiva) ' +
                    'LEFT JOIN almacenes alm ON (a.idalmacen = alm.idalmacen) ' +
                    'WHERE a.fecha = ' + fecha1 + ' AND a.estado = 0 AND alm.idempresa = 1 ' +
                    'GROUP BY a.idalmacen, a.fecha ' +
                    'ORDER BY a.idalmacen, a.fecha ASC) a ON (e.fecha = a.fecha AND a.idalmacen = e.idalmacen) ' +
                    'LEFT JOIN almacenes almd ON (a.idalmacen = almd.idalmacen) ', (err, rows, fields) => {

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


router.get('/ventas-instantaneas/:fecha/:idalmacen/:userId', async (req, res) => {

    try {
        let userId = req.params.userId
        let fecha = req.params.fecha;
        let idalm = req.params.idalmacen;
        var item = Conexiones_API.filter(function (r) {
            return r.userId == userId
        })[0];

        if (typeof item !== "undefined") {
            await item.connection.query('SELECT idfactura, numero, fecha, subtotal, valimpuesto, valortotal, valdescuentos, hora, almacenes.idalmacen, almacenes.nomalmacen,  estado ' +
                'FROM facturas ' +
                'INNER JOIN ' +
                'almacenes ON facturas.idalmacen = almacenes.idalmacen ' +
                'WHERE ' +
                'fecha = ? AND almacenes.idalmacen =?; ', [fecha, idalm], (err, rows, fields) => {

                    if (err) throw err;
                    res.status(200).json({
                        status: 200,
                        message: 'Facturas encontradas satisfactoriamente',
                        rows
                    })

                })

        } else {
            console.log("Sin informacion")
        }

    } catch (error) {
        console.log(error)
    }

});


router.get('/ventas-instantaneas/detalle/:idalmacen/:numero/:userId', async (req, res) => {

    try {
        let userId = req.params.userId
        let idalm = req.params.idalmacen;
        let numero = req.params.numero;
        var item = Conexiones_API.filter(function (r) {
            return r.userId == userId
        })[0];

        if (typeof item !== "undefined") {
            await item.connection.query('SELECT facturas.numero, facturas.valimpuesto, facturas.subtotal, facturas.valdescuentos, facturas.valortotal, productos.descripcion, detfacturas.valorprod, detfacturas.descuento, detfacturas.porcdesc, facturas.fecha, terceros.nombres, terceros.apellidos, detfacturas.cantidad, facturas.idalmacen,(productos.ultcosto * detfacturas.cantidad)AS total_costo ' +
                'FROM detfacturas ' +
                'JOIN productos ON detfacturas.idproducto = productos.idproducto ' +
                'JOIN facturas ON detfacturas.idfactura = facturas.idfactura ' +
                'JOIN terceros ON facturas.idtercero = terceros.idtercero ' +
                'WHERE facturas.idalmacen = ? AND numero = ?; ', [idalm, numero], (err, rows, fields) => {

                    if (err) throw err;
                    res.status(200).json({
                        status: 200,
                        message: 'detalle de las facturas se encontraron satisfactoriamente',
                        rows,
                        datosFactura: rows[0]

                    })

                })

        } else {
            console.log("Sin informacion")
        }

    } catch (error) {
        console.log(error)
    }

});

module.exports = router;

