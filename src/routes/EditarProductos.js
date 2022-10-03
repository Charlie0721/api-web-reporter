const express = require('express');
const mysql = require('mysql');

const router = express.Router();



router.post('/editar/productos/:idproducto/:userId', async (req, res) => {

    try {
        const id = req.params.idproducto;
        let userId = req.params.userId
        const EditProducts = {

            descripcion,
            precioventa,
            precioespecial1,
            precioespecial2,
            costo
        } = req.body


        var item = Conexiones_API.filter(function (r) {


            return r.userId == userId
        })[0];


        if (typeof item !== "undefined") {
            await item.connection.query('UPDATE productos set ? WHERE idproducto=?', [EditProducts, id], (err, rows, fields) => {

                    if (err) throw err;
                    res.status(200).json({
                        status: 200,
                        message: 'producto editado satisfactoriamente',
                        rows
                    })

                });


        } else {
            console.log('Sin informacion')
        }







    } catch (error) {
        console.log(error)
        res.status(401).json({
            message: error
        });
    }

});



module.exports = router;