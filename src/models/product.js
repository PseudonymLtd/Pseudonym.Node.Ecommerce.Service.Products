const Framework = require('pseudonym.node.ecommerce.library.framework');

module.exports = class Product extends Framework.Models.DataModel
{
    constructor(name, description, price, imageUri, id) {
        super(id);
        this._name = name;
        this._description = description;
        this._price = parseFloat(price);
        this._imageUri = imageUri ? imageUri : null;
    }

    get Name() {
        return this._name;
    }

    set Name(value) {
        return this._name = value;
    }

    get Description() {
        return this._description;
    }

    set Description(value) {
        return this._description = value;
    }

    get Price() {
        return this._price;
    }

    set Price(value) {
        return this._price = parseFloat(value);
    }

    get ImageUri() {
        return this._imageUri;
    }

    set ImageUri(value) {
        return this._imageUri = value;
    }

    static Map(dataObj) {
        return new Product(dataObj._name, dataObj._description, dataObj._price, dataObj._imageUri, dataObj._id);
    }

    static get CollectionName() {
        return 'Products';
    }
}