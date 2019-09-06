const Framework = require('pseudonym.node.ecommerce.library.framework');
const Product = require('../models/product');

module.exports = class ProductsController extends Framework.Service.Controller {
    constructor() {
        super('Products Controller');

        this.Get('/products', (request, response, next) => {
            Product.FetchAll((data, err) => {
                if (err !== undefined) { return next(err); }
                response.Ok(data);
            });
        });

        this.Get('/product/:id', (request, response, next) => {
            var id = parseInt(request.params.id);
        
            Product.Fetch(id, (data, err) => {
                if (err !== undefined) { return next(err); }
                response.Ok(data);
            });
        });

        this.Post('/products', (request, response, next) => {
            const productIds = request.body;
        
            if (productIds.length === 0) { 
                return response.BadRequest('Body did not contain an product Ids.');
            }
            
            Product.FetchAll((data, err) => {
                if (err !== undefined) { return next(err); }
        
                const filteredProducts = data.filter(p => productIds.includes(p.Id));
                const unfoundIds = productIds.filter(id => !filteredProducts.map(p => p.Id).includes(id));
        
                if (unfoundIds.length > 0) {
                    response.Partial(filteredProducts, unfoundIds.map(id => `No product was found for supplied Id '${id}'`));
                }
                else {
                    response.Ok(filteredProducts);
                }
            });
        });

        this.Post('/product', (request, response, next) => {

            const newProduct = new Product(
                request.body.name,
                request.body.description,
                request.body.price,
                request.body.imageUri);
        
            newProduct.Save((data, err) => {
                if (err !== undefined) { return next(err); }
        
                this.Logger.info(`Added new product:`);
                console.info(newProduct);
        
                return response.Ok(newProduct, {
                    itemName: data.Name,
                    identifier: data.Id
                });
            });
        });

        this.Put('/product/:id', (request, response, next) => {
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
                        this.Logger.info('updated product:');
                        console.info(data);
        
                        return response.Ok(data);
                    }
                });
            });
        });

        this.Delete('/product/:id', (request, response, next) => {
            var id = parseInt(request.params.id);
        
            Product.Fetch(id, (product, err) => {
                if (err !== undefined) { return next(err); }
                
                product.Delete((existed, err) => {
                    if (err !== undefined && existed) { 
                        return next(err); 
                    }
                    else if (!existed) {
                        return response.Partial(product, {
                            UnexpectedBehaviour: `Record with Id ${request.params.id} has already been deleted, or never existed.`
                        });
                    }
                    else {
                        this.Logger.info(`removed product:`);
                        console.info(product);
        
                        return response.Ok(product);
                    }
                });
            });
        });
    }
}