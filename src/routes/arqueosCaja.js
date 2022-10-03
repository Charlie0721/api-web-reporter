const express = require('express');
const router = express.Router();

router.post('/api/arqueoscaja/:userId', async (req, res) => {

    let userId = req.params.userId
    let fecha1 = req.body.fechaIni;

    var item = Conexiones_API.filter(function (r) {

        return r.userId == userId
    })[0];

    if (typeof item !== "undefined") {
        await item.connection.query('SELECT arqueo.idarqueo, arqueo.fechaap, arqueo.fechacie, almacenes.idalmacen, almacenes.nomalmacen FROM arqueo ' +
            'LEFT JOIN almacenes ON arqueo.idalmacen = almacenes.idalmacen WHERE CAST(arqueo.fechaap AS DATE) = ?', [fecha1], (err, rows, fields) => {

                if (err) throw err;
                if (rows.length > 0) {
                    res.status(200).json({
                        status: 200,
                        message: 'Informacion encontrada satisfactoriamente',
                        rows
                    })
                } else {

                    res.status(400).json({
                        status: 400,
                        message: 'No se encuentra informacion en la base de datos',

                    })
                }
            })
    } else {
        console.log('No se encuentra informacion')
    }
});

router.get('/api/arqueoscaja/:id/:userId', async (req, res) => {

    const { id } = req.params
    let userId = req.params.userId
    var item = Conexiones_API.filter(function (r) {

        return r.userId == userId
    })[0];

    if (typeof item !== "undefined") {
        await item.connection.query('SELECT arqueo.basecaja, arqueo.efectivo, arqueo.egresossist, arqueo.totalcajasist, arqueo.efectivofactsist, almacenes.nomalmacen ' +
            'FROM arqueo ' +
            'LEFT JOIN almacenes ON arqueo.idalmacen = almacenes.idalmacen WHERE idarqueo = ?; ', [id], (err, rows, fields) => {

                if (err) throw err;
                if (rows.length > 0) {
                    res.status(200).json({
                        status: 200,
                        message: 'Informacion encontrada satisfactoriamente',
                        rows
                    })
                } else {

                    res.status(401).json({
                        status: 401,
                        message: 'No se encuentra informacion en la base de datos'

                    })

                }

            })

    } else {
        console.log('No se encuentra informacion')
    }



});



module.exports = router;