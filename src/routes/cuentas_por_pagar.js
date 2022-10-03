const express = require('express');
const mysql = require('mysql');

const router = express.Router();


router.get('/api/cuentas-por-pagar/almacenes/:userId', async (req, res) => {

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





router.post('/api/informe/cuentas-por-pagar/:idalmacen/:userId', async (req, res) => {

    try {
        let userId = req.params.userId
        let idalmacen = req.params.idalmacen
        let fecha1 = req.body.fechaIni;

        if (fecha1 === '' || fecha1 === null || fecha1 === ' ') {
            res.status(404).json({
                status: 404,
                message: 'debe ingresar una fechas valida'
            })
        } else {

            if (idalmacen == 0) {

                var item = Conexiones_API.filter(function (r) {
                    return r.userId == userId
                })[0];

                if (typeof item !== "undefined") {
                    await item.connection.query('' +
                        'SELECT a.idcartera, nit, CONCAT(nombres, " ", nombre2, " ", apellidos, " ", apellido2) AS nomtercero, b.direccion, b.telefono, b.telefono2, a.iddocumento AS iddocument, a.detalle, nommunicipio AS nommunicip, nomdepartamento AS nomdepto, fechadoc, fechacuota, valcuota, debito, credito, a.idtercero, a.idmovcuota, a.idvendedor, i.numero AS numerofact, j.numero AS numeroped, k.numero AS numerodoc, co.docprovee, NULL valpago, NULL fechapago, NULL detpago, NULL numdocpago, alm.nomalmacen ' +
                        'FROM cartera a ' +
                        'LEFT JOIN terceros b ON (a.idtercero = b.idtercero) ' +
                        'LEFT JOIN municipios d ON (b.idmunicipio = d.idmunicipio) ' +
                        'LEFT JOIN departamentos e ON (d.iddepto = e.iddepto) ' +
                        'LEFT JOIN facturas i ON (a.iddocumento = i.idfactura AND a.tipodoc = "FACTURA") ' +
                        'LEFT JOIN pedidos j ON (a.iddocumento = j.idpedido AND a.tipodoc = "PEDIDO") ' +
                        'LEFT JOIN documentos k ON (a.iddocumento = k.iddocumento AND a.tipodoc = "DOCUMENTO") ' +
                        'LEFT JOIN compras co ON (a.iddocumento = co.idcompra AND a.tipodoc = "COMPRA") ' +
                        'LEFT JOIN almacenes alm ON (a.idalmacen = alm.idalmacen) ' +
                        'WHERE a.fechacuota <=  ' + fecha1 + ' AND alm.idempresa = 1 AND ((a.valcuota + a.debito) - a.credito) > 0.00 AND a.tipocartera = 2 ' +
                        'ORDER BY b.nombres, a.idtercero, a.fechacuota, a.iddocumento, a.idcartera ', (err, rows, fields) => {

                            if (err) throw err;
                            res.status(200).json({
                                status: 200,
                                message: 'Informacion consultada satisfactoriamente',
                                rows
                            })
                        })

                } else {
                    console.log('sin informacion');
                }
            } else {
                var item = Conexiones_API.filter(function (r) {
                    return r.userId == userId
                })[0];

                if (typeof item !== "undefined") {
                    await item.connection.query('SELECT a.idcartera, nit, CONCAT(nombres, " ", nombre2, " ", apellidos, " ", apellido2) AS nomtercero, b.direccion, b.telefono, b.telefono2, a.iddocumento AS iddocument, a.detalle, nommunicipio AS nommunicip, nomdepartamento AS nomdepto, fechadoc, fechacuota, valcuota, debito, credito, a.idtercero, a.idmovcuota, a.idvendedor, i.numero AS numerofact, j.numero AS numeroped, k.numero AS numerodoc, co.docprovee, NULL valpago, NULL fechapago, NULL detpago, NULL numdocpago, NULL nuevosaldo ' +
                        'FROM cartera a ' +
                        'LEFT JOIN terceros b ON (a.idtercero = b.idtercero) LEFT JOIN municipios d ON (b.idmunicipio = d.idmunicipio) ' +
                        'LEFT JOIN departamentos e ON (d.iddepto = e.iddepto) LEFT JOIN facturas i ON (a.iddocumento = i.idfactura AND a.tipodoc = "FACTURA") ' +
                        'LEFT JOIN pedidos j ON (a.iddocumento = j.idpedido AND a.tipodoc = "PEDIDO") ' +
                        'LEFT JOIN documentos k ON (a.iddocumento = k.iddocumento AND a.tipodoc = "DOCUMENTO") ' +
                        'LEFT JOIN compras co ON (a.iddocumento = co.idcompra AND a.tipodoc = "COMPRA") ' +
                        'WHERE a.fechacuota <= ' + fecha1 + ' AND a.idalmacen IN ' + '(' + idalmacen + ') ' + ' AND ((a.valcuota + a.debito) - a.credito) > 0.00 AND a.tipocartera = 2 ' +
                        'ORDER BY b.nombres, a.idtercero, a.fechacuota, a.iddocumento, a.idcartera ', (err, rows, fields) => {

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

