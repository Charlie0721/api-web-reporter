const express = require('express');
const mysql = require('mysql');

const router = express.Router();



router.post('/api/informe/ingresos-caja/:userId', async (req, res) => {

    try {

        let userId = req.params.userId
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


            if (typeof item !== "undefined") {
                await item.connection.query('SELECT a.*, CONCAT(b.apellidos, " ", b.apellido2, " " , b.nombres, " ", b.nombre2) AS nomtercero ' +
                'FROM  salidascaja a ' +
                'LEFT JOIN terceros b ON (a.idtercero = b.idtercero) ' +
                'LEFT JOIN almacenes alm ON (a.idalmacen = alm.idalmacen) ' +
                'WHERE  fecha BETWEEN ' + fecha1 + ' AND ' + fecha2 + ' AND alm.idempresa = 1 AND tipo = 1 ' +
                'ORDER BY  tipo ', (err, rows, fields) => {

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


module.exports = router;