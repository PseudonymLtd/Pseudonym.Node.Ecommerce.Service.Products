const path = require('path');

const Framework = require('pseudonym.node.ecommerce.library.framework');
const ProductsController = require('./controllers/products');

const serviceRunner = new Framework.Service.Runner('Products Service');

serviceRunner.RegisterController('/api', new ProductsController());

serviceRunner.RegisterPostProcessor((request, response, complete) => {
    return request.Environment.Authenticator.Logout(request, err => {
        if (err) {
            request.Environment.Logger.Warn(`Error destroying session: ${err.toString()}`);
            return complete(err);
        }
        else {
            request.Environment.Logger.Info('Session Destroyed');
            return complete();
        }
    })
});

serviceRunner.UseConfiguredLogin((err) => {
    if (err) {
        throw err;
    }
    else {
        return serviceRunner.Start(3001);
    }
});