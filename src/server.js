const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const dotenv= require('dotenv')
dotenv.config();
app.set('port', process.env.PORT || 3000);

global.Conexiones_API = [];

require('./userMysql');

//configuraciones

//middlewares

app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(cors());

//Variables Globales


//rutas
app.use(require('./routes/VentasAcumulado'));
app.use(require('./routes/InfoFormasPago'));
app.use(require('./routes/consultarFacturas'));
app.use(require('./routes/InventarioporBarcode'));
app.use(require('./routes/ventasInstante'));
app.use(require('./routes/todosLosProductos'));
app.use(require('./routes/ivaVentas'));
app.use(require('./routes/infoKardex'));
app.use(require('./routes/EditarProductos'));
app.use(require('./routes/consultaCantidades'));
app.use(require('./routes/VentasporVendedor'));
app.use(require('./routes/cuentasXcobrar'));
app.use(require('./routes/check_price'));
app.use(require('./routes/ingresos_caja'));
app.use(require('./routes/egresosCaja'));
app.use(require('./routes/compras'));
app.use(require('./routes/arqueosCaja'));
app.use(require('./routes/Insertar_compras'));
app.use(require('./routes/mov_inventarios'));
app.use(require('./routes/conexiones_usuarios'));
app.use(require('./routes/ventas_por_mesas'));
app.use(require('./routes/costeo_inventario'));
app.use(require('./routes/estados_de_domicilios'));
app.use(require('./routes/lotes_fechas_vencimiento'));
app.use(require('./routes/cuentas_por_pagar'));
app.use(require('./routes/informes_pedidos/pedidos_documentos'));
app.use(require('./routes/informes_pedidos/pedidos_productos'));
app.use(require('./routes/informes_pedidos/pedidos_formasPago'));
//inicializar server
app.listen(app.get('port'), () => {

    console.log('Servidor iniciado en puerto', app.get('port'));
});

