const express = require('express');
const mysql = require('mysql');

const router = express.Router();



router.post('/consulta-ventas-estados-domicilios/:userId', async (req, res) => {


    try {
        let userId = req.params.userId;
        let estado = req.body.estado;
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
                await item.connection.query('SELECT a.idtercero AS idterc, a.*, CONCAT(b.nombres, " ", b.nombre2, " ", b.apellidos, " ", b.apellido2) AS nomtercero, d.numero AS numfact, e.direccion, e.telefono ' +
                    'FROM domicilios a ' +
                    'LEFT JOIN terceros b ON (a.idtercero = b.idtercero) ' +
                    'LEFT JOIN terceros c ON (a.iddomiciliario = c.idtercero) ' +
                    'LEFT JOIN facturas d ON (a.idfactura = d.idfactura) ' +
                    'LEFT JOIN sedestercero e ON (a.idsedeterc = e.idsedeterc) ' +
                    'WHERE  a.fecha BETWEEN ' + fecha1 + ' AND ' + fecha2 + ' AND a.estado = ' + estado +
                    ' ORDER BY a.numero ', (err, rows, fields) => {

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



    } catch (error) {
        console.log(error)
        res.status(401).json({
            message: error
        });
    }

});



module.exports = router;

