const Framework = require('pseudonym.node.ecommerce.library.framework');
const dataStore = new Framework.Data.FileDataStore('products');

module.exports = class Product extends Framework.Models.DataModel
{
    constructor(name, description, price, imageUri) {
        super();
        this.name = name;
        this.description = description;
        this.price = parseFloat(price);
        this.imageUri = imageUri ? imageUri : null;
    }
    get Name() {
        return this.name;
    }

    set Name(value) {
        return this.name = value;
    }

    get Description() {
        return this.description;
    }

    set Description(value) {
        return this.description = value;
    }

    get Price() {
        return this.price;
    }

    set Price(value) {
        return this.price = parseFloat(value);
    }

    get ImageUri() {
        return this.imageUri;
    }

    set ImageUri(value) {
        return this.imageUri = value;
    }

    Delete(callback) {
        return dataStore.Delete(this.Id, callback);
    }

    Save(callback) {
        return dataStore.Save(this.Id, this, callback);
    }

    static FetchAll(callback) {
        return dataStore.FetchAll(Product.Mapper, callback);
    }

    static Fetch(id, callback) {
        return dataStore.Fetch(id, Product.Mapper, callback);
    }

    static Mapper(rawJson) {
        const p = JSON.parse(rawJson);
        const product = new Product(p.name, p.description, p.price, p.imageUri);
        product.Id = p.id;
        return product;
    }
}