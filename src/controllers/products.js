const Framework = require('library.ecommerce.framework');
const serviceResponse = Framework.Service.Responder;
const Product = require('../models/product');

const logger = new Framework.Utils.Logger('Products Controller');

module.exports.getProducts = (request, response, next) => {
    Product.FetchAll((data, err) => {
        if (err !== undefined) { return next(err); }

        response.send(serviceResponse.Ok(data));

        return logger.debug('Data Returned');
    });
};

module.exports.postProducts = (request, response, next) => {
    
    const productIds = request.body;

    if (productIds.length === 0) { 
        return serviceResponse.BadRequest('Body did not contain an product Ids.');
    }
    
    Product.FetchAll((data, err) => {
        if (err !== undefined) { return next(err); }

        const filteredProducts = data.filter(p => productIds.includes(p.Id));
        const unfoundIds = productIds.filter(id => !filteredProducts.map(p => p.Id).includes(id));

        if (unfoundIds.length > 0) {
            response.send(serviceResponse.Partial(filteredProducts, unfoundIds.map(id => `No product was found for supplied Id '${id}'`)));
        }
        else {
            response.send(serviceResponse.Ok(filteredProducts));
        }
        
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
            else if (!existed) {
                return response.send(serviceResponse.Partial(product, {
                    UnexpectedBehaviour: `Record with Id ${request.params.id} has already been deleted, or never existed.`
                }));
            }
            else {
                logger.info(`removed product:`);
                console.info(product);

                return response.send(serviceResponse.Ok(product));
            }
        });
    });
};

module.exports.putProduct = (request, response, next) => {

    const newProduct = new Product(
        request.body.name,
        request.body.description,
        request.body.price,
        request.body.imageUri);

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
        product.ImageUri = request.body.imageUri;

        product.Save((data, err) => {
            if (err !== undefined) { 
                return next(err); 
            }
            else {
                logger.info('updated product:');
                console.info(data);

                return response.send(serviceResponse.Ok(data));
            }
        });
    });
};