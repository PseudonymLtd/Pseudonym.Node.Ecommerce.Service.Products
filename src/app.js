const Framework = require('pseudonym.node.ecommerce.library.framework');
const ProductsController = require('./controllers/products');

const serviceRunner = new Framework.Service.Runner('Products Service');

serviceRunner.RegisterController('/api', new ProductsController());

serviceRunner.RegisterPostProcessor((request, response, complete) => {
    return request.app.authenticator.Logout(request, err => {
        if (err) {
            request.app.logger.warn(`Error destroying session: ${err.toString()}`);
            return complete(err);
        }
        else {
            request.app.logger.info('Session Destroyed');
            return complete();
        }
    })
});

serviceRunner.Start(3001);