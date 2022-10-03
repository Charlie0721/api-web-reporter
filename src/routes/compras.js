const express = require('express');
const mysql = require('mysql');

const router = express.Router();



router.get('/api/consultar-todas-las-compras/:userId', async (req, res) => {

    try {
        let userId=req.params.userId
        var item = Conexiones_API.filter(function (r) {
                

            return r.userId == userId
        })[0];


 if (typeof item !== "undefined") {
await item.connection.query('SELECT idcompra, docprovee, fecha, valorneto, impuestos, valortotal, hora FROM compras', (err, rows, fields) => {

    if (err) throw err;
    res.status(200).json({
        status: 200,
        message: 'Compras encontradas satisfactoriamente',
        rows
    })


})

}else{
    console.log('no se ha podido obtener informacion')
}

    } catch (error) {
        console.log(error)
        res.status(401).json({
            message: error
        });
    }

});


router.get('/api/consultar-todas-las-compras/:docprovee/:userId', async (req, res) => {

    try {
        const { docprovee } = req.params;
        let userId=req.params.userId

        var item = Conexiones_API.filter(function (r) {
                

            return r.userId == userId
        })[0];


 if (typeof item !== "undefined") {
await item.connection.query('SELECT compras.idcompra, compras.docprovee, compras.impuestos, compras.valorneto,detcompras.porciva, compras.descuento, compras.valortotal, ' +
'productos.descripcion, detcompras.valor, detcompras.descuento, detcompras.porcdesc, detcompras.porciva, compras.fecha, terceros.nombres, ' +
'terceros.apellidos, detcompras.cantidad ' + 'FROM detcompras ' +
'JOIN productos ON detcompras.idproducto = productos.idproducto ' +
'JOIN compras ON detcompras.idcompra = compras.idcompra ' +
'JOIN terceros ON compras.idtercero = terceros.idtercero WHERE docprovee=?', [docprovee], (err, rows, fields) => {

    if (err) throw err;
    res.status(200).json({
        status: 200,
        message: 'Compra encontradas satisfactoriamente',
        dataDeCompras: rows,
        datosCompras: rows[0]
    })


})

}

    } catch (error) {
        console.log(error)
        res.status(401).json({
            message: error
        });
    }

});




module.exports = router;
