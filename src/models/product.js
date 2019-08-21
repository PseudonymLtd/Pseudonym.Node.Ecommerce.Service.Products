const dataStore = require('../data/dataStore');
const DataModel = require('./dataModel')
const fileStore = 'products';

module.exports = class Product extends DataModel
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
        return dataStore.Delete(fileStore, this.Id, callback);
    }

    Save(callback) {
        return dataStore.Save(fileStore, this.Id, this, callback);
    }

    static FetchAll(callback) {
        return dataStore.FetchAll(fileStore, Product.Mapper, callback);
    }

    static Fetch(id, callback) {
        return dataStore.Fetch(fileStore, id, Product.Mapper, callback);
    }

    static Mapper(rawJson) {
        const p = JSON.parse(rawJson);
        const product = new Product(p.name, p.description, p.price, p.imageUri);
        product.Id = p.id;
        return product;
    }
}