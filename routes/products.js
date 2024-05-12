var express = require('express');
var router = express.Router();
var productosModel = require('../models/productsModel');
var util = require('util');
var cloudinary = require('cloudinary').v2;

const uploader = util.promisify(cloudinary.uploader.upload);
const destroy = util.promisify(cloudinary.uploader.destroy);

/* GET home page. */
router.get('/', async function (req, res) {
  var data = await productosModel.getProducts();

  productos = data.map(producto => {
    if (producto.img_id) {
      const producto_img = cloudinary.url(producto.img_id, {
        with: 100, 
        height: 100,
        crop: 'fill'
      });
      return {
        ...producto,
        producto_img
      }
    }else{
      return {
        ...producto,
        producto_img: ''
      }
    }
  });

  res.render('products', { layout: 'layout', products: productos });  
});

router.get('/nuevo', function (req, res) {
  res.render('addProduct', { layout: 'layout' });
});

router.post('/nuevo', async (req, res, next) => {
  try {
    var img_id = '';
    
    if (req.files && Object.keys(req.files).length > 0) {
      imagen = req.files.imagen;
      img_id = (await uploader(imagen.tempFilePath)).public_id;
    }

    if (req.body.NombreProducto != "" && req.body.Medidas != "" && req.body.Descripcion != "") {
      // var obj = {
      //   NombreProducto: req.body.NombreProducto,
      //   Medidas: req.body.Medidas,
      //   Descripcion: req.body.Descripcion,
      //   OtrasEspecificaciones: req.body.OtrasEspecificaicones
      // }
      await productosModel.addProduct({...req.body, img_id});
      res.redirect('/productos');
    }else{
      res.render('addProduct', 
        {
          layout: 'layout', 
          error: true, 
          message: "Todos los campos son obligatorios"
        });
    }
  } catch (error) {
    
  }
});

router.get('/editar/:id', async function (req, res) {
  let id = req.params.id;
  let product = await productosModel.getProductById(id);

  res.render('updateProduct', { layout: 'layout', product });
});

router.post('/editar/', async (req, res) => {
  try {
    let img_id = req.body.img_original;
    let borrar_img_vieja = false;

    if (req.body.img_delete === '1') {
      img_id = null;
      borrar_img_vieja = true;
    }else{
      if (req.files && Object.keys(req.files).length > 0) {
        imagen = req.files.imagen;
        img_id = (await uploader(imagen.tempFilePath)).public_id;
        borrar_img_vieja = true;
      }
    }
    if (borrar_img_vieja && req.body.img_original) {
      await destroy(req.body.img_original);
    }

    if (req.body.NombreProducto != "" && req.body.Medidas != "" && req.body.Descripcion != "") {
      var obj = {
        NombreProducto: req.body.NombreProducto,
        Medidas: req.body.Medidas,
        Descripcion: req.body.Descripcion,
        OtrasEspecificaciones: req.body.OtrasEspecificaciones,
        img_id, 
      }

      productosModel.updateProduct(obj, +req.body.id);
      res.redirect('/productos');
    }else{
      res.render('updateProduct', 
        {
          layout: 'layout', 
          error: true, 
          message: "Todos los campos son obligatorios"
        });
    }
  } catch (error) {
    
  }
});

router.get('/eliminar/:id', async function (req, res) {
  let id = req.params.id;
  
  let producto = await productosModel.getProductById(id);
  if (producto.img_id) {
    await destroy(producto.img_id);
  }

  await productosModel.deleteProduct(id);

  res.redirect('/productos');
});

module.exports = router;