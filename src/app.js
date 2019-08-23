const Framework = require('library.ecommerce.framework');
const ProductsController = require('./controllers/products');

const serviceRunner = new Framework.Service.Runner('Products Service');

serviceRunner.RegisterController('/api', new ProductsController());

serviceRunner.Start(3001);