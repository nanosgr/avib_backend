var express = require('express');
var router = express.Router();
var productosModel = require('../models/productsModel');
var nodemailer = require('nodemailer');
var cloudinary = require('cloudinary').v2;

router.get('/products', async function (req, res) {
  var data = await productosModel.getProducts();

  // Obtenemos las imágenes en Cloudinary en caso de que existan
  productos = data.map(producto => {
    if (producto.img_id) {
      const imagen = cloudinary.url(producto.img_id, {
        with: 100,
        height: 100,
        crop: 'fill'
      });
      return {
        ...producto,
        imagen
      }
    }else{
      return {
        ...producto,
        imagen: ''
      }
    }
  });

  res.json(productos);
});

router.post('/contact', async function (req, res) {
  const mail = {
    to: process.env.MAIL_TO, // se coloca en variable de entorno para no exponer el correo
    subject: 'Contacto desde la web',
    html: `
      Nombre: ${req.body.nombre} <br/><br/>
      Se contacto a traves de la web con el siguiente mensaje: ${req.body.mensaje} <br/><br/>
      <hr />
      Email: ${req.body.email} <br/>
      Teléfono: ${req.body.telefono}
    `
  }
  
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  await transport.sendMail(mail);

  res.status(200).json({
    error: false,
    status: 'Mensaje enviado'
  });
});


module.exports = router;