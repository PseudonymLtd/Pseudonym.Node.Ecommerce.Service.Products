const logging = require('../util/logging');
const serviceResponse = require('../models/serviceResponse');
const Product = require('../models/product');

const logger = new logging.Logger('ProductsController');

module.exports.getProducts = (request, response, next) => {
    Product.FetchAll((data, err) => {
        if (err !== undefined) { return next(err); }

        response.send(serviceResponse.Ok(data));

        return logger.debug('Data Returned');
    });
};

module.exports.getProduct = (request, response, next) => {

    var id = parseInt(request.params.id);

    Product.Fetch(id, (data, err) => {
        if (err !== undefined) { return next(err); }

        response.send(serviceResponse.Ok(data));

        return logger.debug('Data Returned');
    });
};

module.exports.deleteProduct = (request, response, next) => {

    var id = parseInt(request.params.id);

    Product.Fetch(id, (product, err) => {
        if (err !== undefined) { return next(err); }
        
        product.Delete((existed, err) => {
            if (err !== undefined && existed) { 
                return next(err); 
            }
            else if (existed) {
                return response.send(serviceResponse.Partial(undefined, {
                    UnexpectedBehaviour: `Record with Id ${request.params.id} has already been deleted, or never existed.`
                }));
            }
            else {
                logger.info(`removed product:`);
                console.info(record);

                return response.send(serviceResponse.Ok());
            }
        });
    });
};

module.exports.putProduct = (request, response, next) => {

    const newProduct = new Product(
        request.body.name,
        request.body.description,
        request.body.price);

    newProduct.Save((data, err) => {
        if (err !== undefined) { return next(err); }

        logger.info(`Added new product:`);
        console.info(newProduct);

        return response.send(serviceResponse.Ok(newProduct, {
            itemName: data.Name,
            identifier: data.Id
        }));
    });
};

module.exports.updateProduct = (request, response, next) => {
    var id = parseInt(request.params.id);

    Product.Fetch(id, (product, err) => {
        if (err !== undefined) { return next(err); }
        
        product.Name = request.body.name;
        product.Description = request.body.description;
        product.Price = request.body.price;

        product.Save((data, err) => {
            if (err !== undefined) { 
                return next(err); 
            }
            else {
                logger.info(`updated product:`);
                console.info(data);

                return response.send(serviceResponse.Ok());
            }
        });
    });
};