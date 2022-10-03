const express = require('express');
const mysql = require('mysql');

const router = express.Router();



router.get('/facturas/:userId', async (req, res) => {

    try {
        let userId = req.params.userId
        var item = Conexiones_API.filter(function (r) {


            return r.userId == userId
        })[0];


        if (typeof item !== "undefined") {
            await item.connection.query('SELECT idfactura, numero, fecha, subtotal, valimpuesto, valortotal, valdescuentos, hora,almacenes.idalmacen, almacenes.nomalmacen ' +
                'from facturas ' +
                'INNER JOIN ' +
                'almacenes on facturas.idalmacen = almacenes.idalmacen ORDER BY idalmacen;', (err, rows, fields) => {

                    if (err) throw err;
                    res.status(200).json({
                        status: 200,
                        message: 'Facturas encontradas satisfactoriamente',
                        rows
                    })


                })

        } else {
            console.log('No se ha encontrado informacion')
        }

    } catch (error) {
        console.log(error)
        res.status(401).json({
            message: 'No hay informacion para mostrar'
        })
    }

});


router.get('/facturas/:numero/:idalmacen/:userId', async (req, res) => {

    try {
        let userId = req.params.userId
        const { numero } = req.params;
        const { idalmacen } = req.params;

        var item = Conexiones_API.filter(function (r) {


            return r.userId == userId
        })[0];

        if (typeof item !== "undefined") {
            await item.connection.query('SELECT facturas.numero,facturas.valimpuesto,facturas.subtotal,facturas.valdescuentos, facturas.valortotal,' +
                'productos.descripcion, detfacturas.valorprod, detfacturas.descuento,detfacturas.porcdesc,' +
                'facturas.fecha, terceros.nombres, terceros.apellidos,' +
                'detfacturas.cantidad FROM detfacturas JOIN productos ON detfacturas.idproducto = productos.idproducto JOIN facturas ON detfacturas.idfactura = facturas.idfactura JOIN terceros ON facturas.idtercero = terceros.idtercero WHERE numero=? AND facturas.idalmacen= ? ;', [numero, idalmacen], (err, rows, fields) => {

                    if (err) throw err;
                    res.status(200).json({
                        status: 200,
                        message: 'Factura encontrada satisfactoriamente',
                        rows,
                        datos1: rows[0]
                    })


                })

        } else {
            console.log('No se ha encontrado informacion')
        }


    } catch (error) {
        console.log(error)
        res.status(401).json({
            message: 'No hay informacion para mostrar'
        })
    }

});


module.exports = router;

