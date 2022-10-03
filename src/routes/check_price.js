const express = require('express');
const mysql = require('mysql');

const router = express.Router();



router.post('/consultar-precios/:userId', async (req, res) => {

    try {

        let userId=req.params.userId 
        var item = Conexiones_API.filter(function (r) {
                

            return r.userId == userId
        })[0];


 if (typeof item !== "undefined") {
await item.connection.query('SELECT descripcion, precioventa, barcode FROM productos WHERE barcode =?', req.body.barcode, (err, rows, fields) => {

    if (err) throw err;
    res.status(200).json({
        status: 200,
        message: 'Informacion consultada satisfactoriamente',
        rows
    })

})

}else{
         console.log('no se encuentra informacion')   
   }


    } catch (error) {
        console.log(error)
        res.status(401).json({
            message: error
        });
    }

});



module.exports = router;

