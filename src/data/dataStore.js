const fs = require('fs');
const path = require('path');
const logging = require('../util/logging');

const logger = new logging.Logger('DataStore');

module.exports = class DataStore {
    static read(callback) {
        logger.info(`Reading data from disk`);

        fs.readFile(path.join(__dirname, 'products.json'), (err, data) => {
            if (err) 
            { 
                logger.fatal(err);
                return callback([], err);
            }
            return callback(JSON.parse(data.toString()));
        });
    }

    static write(data, callback) {
        logger.info(`Writing new data to disk`);

        fs.writeFile(path.join(__dirname, 'products.json'), JSON.stringify(data), (err) => {
            if (err) 
            { 
                logger.fatal(err);
                return callback([], err);
            }
            return callback(data);
        });
    }
}