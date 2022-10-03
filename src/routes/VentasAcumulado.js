const express = require('express');
const mysql = require('mysql');

const router = express.Router();

router.get('/api/consulta-ventas-acumuladas/almacenes/:userId', async (req, res) => {

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


router.post('/consulta-ventas-acumuladas/:idalmacen/:userId', async (req, res) => {


    try {
        let userId = req.params.userId;
        let idalmacen =req.params.idalmacen;
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
                    await item.connection.query('SELECT a.fecha, a.idalmacen, a.prodvendid, e.subtot, e.ivaimp, a.costoacum, e.sumdesc, e.total, e.retencion, e.cantfact, f.valordev, e.valpropina, e.total + IF(ISNULL(e.valpropina), 0, e.valpropina) AS totalconprop, almd.nomalmacen, e.otrosimpuestos, e.impuestoinc ' +
                        'FROM (SELECT a.idalmacen, a.fecha, SUM(a.valortotal) AS total, COUNT(a.idfactura) AS cantfact, SUM(a.valretenciones) AS retencion, SUM(a.valimpuesto) AS ivaimp, SUM(a.subtotal) AS subtot, SUM(a.valdescuentos) AS sumdesc, SUM(b.propina) AS valpropina, SUM(a.otrosimpuestos) otrosimpuestos, SUM(a.impuestoinc) impuestoinc ' +
                        'FROM facturas a ' +
                        'LEFT JOIN ordenes b ON (a.idfactura = b.idfactura) ' +
                        'LEFT JOIN almacenes alm ON (a.idalmacen = alm.idalmacen) ' +
                        'WHERE a.fecha BETWEEN ' + fecha1 + ' AND ' + fecha2 + ' AND a.estado = 0 AND alm.idempresa = 1 ' +
                        'GROUP BY a.idalmacen, a.fecha ' +
                        'ORDER BY a.idalmacen, a.fecha ASC) AS e ' +
                        'LEFT JOIN (SELECT a.idalmacen, a.fecha, SUM(b.valordev) AS valordev ' +
                        'FROM facturas a ' +
                        'LEFT JOIN devventas b ON (a.idfactura = b.idfactura) ' +
                        'LEFT JOIN almacenes alm ON (a.idalmacen = alm.idalmacen) ' +
                        'WHERE a.fecha BETWEEN ' + fecha1 + ' AND ' + fecha2 + ' AND a.estado = 0 AND alm.idempresa = 1 ' +
                        'GROUP BY a.idalmacen, a.fecha ' +
                        'ORDER BY a.idalmacen, a.fecha ASC) f ON (e.fecha = f.fecha AND e.idalmacen = f.idalmacen) ' +
                        'LEFT JOIN (SELECT a.fecha, a.idalmacen, SUM(b.cantidad) AS prodvendid, SUM(c.ultcosto * b.cantidad) AS costoacum ' +
                        'FROM facturas a ' +
                        'LEFT JOIN detfacturas b ON (a.idfactura = b.idfactura) ' +
                        'LEFT JOIN productos c ON (b.idproducto = c.idproducto) ' +
                        'LEFT JOIN iva d ON (c.codiva = d.codiva) ' +
                        'LEFT JOIN almacenes alm ON (a.idalmacen = alm.idalmacen) ' +
                        'WHERE a.fecha BETWEEN  ' + fecha1 + ' AND ' + fecha2 + ' AND a.estado = 0 AND alm.idempresa = 1 ' +
                        'GROUP BY a.idalmacen, a.fecha ' +
                        'ORDER BY a.idalmacen, a.fecha ASC) a ON (e.fecha = a.fecha AND a.idalmacen = e.idalmacen) ' +
                        'LEFT JOIN almacenes almd ON (a.idalmacen = almd.idalmacen) ', (err, rows, fields) => {

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
                    await item.connection.query('SELECT a.fecha, a.idalmacen, a.prodvendid, e.subtot, e.ivaimp, a.costoacum, e.sumdesc, e.total, e.retencion, e.cantfact, f.valordev, e.valpropina, e.total + IF(ISNULL(e.valpropina), 0, e.valpropina) AS totalconprop, almd.nomalmacen, e.otrosimpuestos, e.impuestoinc ' +
                        'FROM (SELECT a.idalmacen, a.fecha, SUM(a.valortotal) AS total, COUNT(a.idfactura) AS cantfact, SUM(a.valretenciones) AS retencion, SUM(a.valimpuesto) AS ivaimp, SUM(a.subtotal) AS subtot, SUM(a.valdescuentos) AS sumdesc, SUM(b.propina) AS valpropina, SUM(a.otrosimpuestos) otrosimpuestos, SUM(a.impuestoinc) impuestoinc ' +
                        'FROM  facturas a ' +
                        'LEFT JOIN ordenes b ON (a.idfactura = b.idfactura) ' +
                        'WHERE  a.fecha BETWEEN ' + fecha1 + ' AND ' + fecha2 + ' AND a.estado = 0 AND a.idalmacen IN ' + '(' + idalmacen + ') ' +
                        'GROUP BY a.idalmacen, a.fecha ' +
                        'ORDER BY a.idalmacen, a.fecha ASC) AS e ' +
                        'LEFT JOIN (SELECT a.idalmacen, a.fecha, SUM(b.valordev) AS valordev ' +
                        'FROM facturas a ' +
                        'LEFT JOIN devventas b ON (a.idfactura = b.idfactura) ' +
                        'WHERE a.fecha BETWEEN ' + fecha1 + ' AND ' + fecha2 + ' AND a.estado = 0 AND a.idalmacen IN ' + '(' + idalmacen + ') ' +
                        'GROUP BY   a.idalmacen, a.fecha ' +
                        'ORDER BY  a.idalmacen, a.fecha ASC) f ON (e.fecha = f.fecha AND e.idalmacen = f.idalmacen) ' +
                        'LEFT JOIN (SELECT a.fecha, a.idalmacen, SUM(b.cantidad) AS prodvendid, SUM(c.ultcosto * b.cantidad) AS costoacum ' +
                        'FROM facturas a ' +
                        'LEFT JOIN detfacturas b ON (a.idfactura = b.idfactura) ' +
                        'LEFT JOIN productos c ON (b.idproducto = c.idproducto) ' +
                        'LEFT JOIN iva d ON (c.codiva = d.codiva) ' +
                        'WHERE a.fecha BETWEEN ' + fecha1 + ' AND ' + fecha2 + ' AND a.estado = 0 AND a.idalmacen IN ' + '(' + idalmacen + ') ' +
                        'GROUP BY a.idalmacen, a.fecha ' +
                        'ORDER BY a.idalmacen, a.fecha ASC) a ON (e.fecha = a.fecha AND a.idalmacen = e.idalmacen) ' +
                        'LEFT JOIN almacenes almd ON (a.idalmacen = almd.idalmacen) ', (err, rows, fields) => {

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

