const express = require('express');
const mysql = require('mysql');

const router = express.Router();

router.get('/api/productos/compras/:userId', async (req, res) => {

    try {

        let userId = req.params.userId
        var item = Conexiones_API.filter(function (r) {
            return r.userId == userId
        })[0];


        if (typeof item !== "undefined") {
            await item.connection.query('SELECT idproducto, descripcion, barcode, codigo, costo, precioventa FROM productos WHERE estado=1;',

                (err, rows, fields) => {

                    if (err) throw err;
                    res.status(200).json({
                        status: 200,
                        message: 'Productos encontrados satisfactoriamente',
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

router.get('/api/almacenes/compras/:userId', async (req, res) => {

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



router.get('/api/terceros/compras/:userId', async (req, res) => {

    try {

        let userId = req.params.userId
        var item = Conexiones_API.filter(function (r) {
            return r.userId == userId
        })[0];

        if (typeof item !== "undefined") {
            await item.connection
                .query('SELECT idtercero, nombres, nit FROM terceros WHERE proveedor = 1;',

                    (err, rows, fields) => {

                        if (err) throw err;
                        res.status(200).json({
                            status: 200,
                            message: 'Proveedores encontrados satisfactoriamente',
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




router.post('/api/ingresa-compras/:userId', async (req, res) => {

    try {
        let userId = req.params.userId
        const IngrCompras = {

            idtercero,
            docprovee,
            fechadocprov,
            fecha,
            detalle,
            idalmacen,
            idpago,
            aprobada
        } = req.body
        var item = Conexiones_API.filter(function (r) {
            return r.userId == userId
        })[0];

        if (typeof item !== "undefined") {
            await item.connection.query('INSERT INTO compras SET? ',

                [IngrCompras], (err, rows, fields) => {

                    if (err) throw err;
                    res.status(200).json({
                        status: 200,
                        message: 'Compra ingresada satisfactoriamente',
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

router.post('/api/ingresa-compras/detalle/:userId', async (req, res) => {

    try {
        let userId = req.params.userId
        const IngrDetalleCompras = {

            idcompra,
            idmovorden,
            idproducto,
            valor,
            cantidad,
            precioventa

        } = req.body

        var item = Conexiones_API.filter(function (r) {
            return r.userId == userId
        })[0];

        if (typeof item !== "undefined") {
            await item.connection.query('INSERT INTO detcompras SET? ',

                [IngrDetalleCompras, idcompra], (err, rows, fields) => {

                    if (err) throw err;
                    res.status(200).json({
                        status: 200,
                        message: 'Compra ingresada satisfactoriamente',
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


module.exports = router;