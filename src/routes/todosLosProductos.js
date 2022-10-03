const { request } = require('express');
const express = require('express');
const mysql = require('mysql');

const router = express.Router();


router.get('/todos/productos/:userId', async (req, res) => {

    try {
        let userId = req.params.userId
        var item = Conexiones_API.filter(function (r) {


            return r.userId == userId
        })[0];

        if (typeof item !== "undefined") {
            await item.connection.query('SELECT productos.idproducto, productos.barcode, productos.costo, productos.ultcosto, productos.descripcion, productos.precioventa, productos.precioespecial1, productos.precioespecial2 FROM productos ', (err, rows, fields) => {
                if (err) throw err;
                if (rows.length > 0) {

                    res.status(200).json({
                        status: 200,
                        message: 'Productos encontrados satisfactoriamente',
                        rows
                    })

                } else {
                    res.status(401).json({
                        status: 401,
                        message: 'Producto no encontrado en la base de datos'

                    })
                }

            })

        } 

    } catch (error) {
        console.log(error)
        res.status(400).json({
            message: error
        })
    }

});


router.get('/productos/:idproducto/:userId', async (req, res) => {

    try {

        let userId = req.params.userId
        const id = req.params.idproducto

        var item = Conexiones_API.filter(function (r) {


            return r.userId == userId
        })[0];


        if (typeof item !== "undefined") {
            await item.connection.query('SELECT productos.idproducto, productos.barcode, productos.costo, productos.ultcosto, productos.descripcion, productos.precioventa, productos.precioespecial1, productos.precioespecial2 FROM productos WHERE idproducto=? ', [id], (err, rows, fields) => {
                if (err) throw err;
                if (rows.length > 0) {

                    res.status(200).json({
                        status: 200,
                        message: 'Producto encontrado satisfactoriamente',
                        rows
                    })

                } else {
                    res.status(401).json({
                        status: 401,
                        message: 'Producto no encontrado en la base de datos'

                    })
                }

            })

        } else {
            console.log(err)
        }






    } catch (error) {
        console.log(error)
        res.status(400).json({
            message: error
        })
    }


});

module.exports = router;