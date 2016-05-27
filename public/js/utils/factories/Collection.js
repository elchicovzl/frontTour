(function() {
    'use strict';

    var Collection;

    Collection = [function() {
        var Collection;

        /**
         * @description Class that takes a collection of item and ables to manage them in a simple manner
         *
         * @param {Array} array - Array of items
         *
         * @constructor
         */
        Collection = function(array) {
            var _; /// TODO stop using underscore as a variable name :)

            if(!Array.isArray(array)) {
                throw new Error('Need an array as argument');
            }

            this._hashTables = {};
            this._collection = array;

            if(Collection.initializedClass === undefined) {
                Collection.counter = 0;
                //------------------------------------------PUBLIC----------------------------------------------------------------------
                /**
                 * @description Method to get an item from the collection
                 *
                 * @param {String} getBy - Name of the property to look for
                 * @param index {String} - Value of the property. If it matches a specific item, it will retrieve it.
                 * @returns {object | number | string | undefined}
                 */
                Collection.prototype.getBy = function(getBy, index) {
                    var hashTableName;

                    if(typeof(getBy) !== 'string' && typeof(parseInt(index)) === 'number') {
                        throw new Error('First argument must be a string, second one must be a number');
                    }

                    hashTableName = Collection.createName4HashTable(getBy);

                    if(this._hashTables[hashTableName] === undefined) {
                        this._hashTables[hashTableName] = Collection.createHashTable(this._collection, getBy);
                    }

                    return this._collection[this._hashTables[hashTableName][index]];
                };

                /**
                 * @description Get items of the collection
                 *
                 * @param {String|Number} index - If number, gets the item with the specific position. If 'array', gets a copy
                 *                                of the collection as an array
                 * @returns {array|object}
                 */
                Collection.prototype.get = function(index) {
                    var value;

                    if(typeof(parseInt(index)) !== 'number') {
                        throw new Error('Argument needs to be a number');
                    }

                    if(index) {
                        value = this._collection[index];
                    } else {
                        value = this._collection;
                    }

                    return value;
                };

                Collection.prototype.getArray = function() {
                    return this._collection;
                };


                /**
                 * @description Adds a new item to the collection.
                 *
                 * @param item {object || array} - Item ior array to be added to the collection
                 * @param index {Number} - Position to add the item or array into the collection. By default, it will be added to
                 *                         the end of the collection.
                 */
                Collection.prototype.add = function(item, index) {

                    //add array to the end of the array
                    index = index === undefined ? Infinity : index;

                    if(typeof index !== 'number') {
                        throw new Error('Argument needs to be a number');
                    }

                    //check if item to add is an array
                    if(Array.isArray(item)) {
                        Array.prototype.push.apply(this._collection, item);
                    } else {
                        this._collection.splice(index, 0, item);
                    }

                    this._hashTables = {};

                    return this;
                };

                /**
                 * Gets the number of items in the collection
                 * @returns {Number}
                 */
                Collection.prototype.getTotal = function() {
                    return this._collection.length;
                };

                /**
                 * @description Remove item from collection
                 *
                 * @param {NUmber} index - Position of the item you want to remove
                 */
                Collection.prototype.remove = function(index) {
                    if(typeof(parseInt(index)) !== 'number') throw new Error('Argument needs to be a number');

                    this._hashTables = {};

                    return this._collection.splice(index, 1)[0];
                };

                /**
                 * @description Remove item from collection by property
                 *
                 * @param {String} property - Name of the property to search for
                 * @param {Number} index - Value to match the property value of the item to remove
                 */
                Collection.prototype.removeBy = function(property, index) {
                    var indexItem;

                    indexItem = this.getIndexBy(property, index);

                    return this.remove(indexItem);
                };

                /**
                 * @description Get the index of a specific item in the array
                 *
                 * @param {String} property - Property to search item for
                 * @param {String} index    - Property value to match the item
                 * @returns {Number}        - Index of the item in the array
                 */
                Collection.prototype.getIndexBy = function(property, index) {
                    var indexItem;

                    this._collection.forEach(function(item, arrayIndex) {
                        if(item[property] === index) {
                            indexItem = arrayIndex;
                        }
                    });

                    return indexItem;
                };

                /**
                 * @description Replaces a item from the collection with a new object
                 *
                 * @param {String} property - Item property to search for
                 * @param {String} index    - Item property value to match item
                 * @param {object} newItem  - Item that will replace the old item
                 */
                Collection.prototype.replaceItemBy = function(property, index, newItem) {
                    var indexItem;

                    indexItem = this.getIndexBy(property, index);

                    this.remove(indexItem);
                    this.add(newItem, indexItem);

                    return this;
                };

                /**
                 * @description Moves the specific item in the collection to the specific position
                 *
                 * @param {object} itemCollection - item that's is inside the collection
                 * @param {string | number} position - Position to move the item to
                 */
                Collection.prototype.moveItemTo = function(itemCollection, position) {
                    this.removeBy('id', itemCollection.id);
                    this.add(itemCollection, position);

                    return this;
                };

                Collection.prototype.toString = function() {
                    return 'Collection: ' + this._collection.length + ' elements';
                };

                //------------------------------------------STATIC----------------------------------------------------------------------

                Collection.createHashTable = function(array, indexName) {
                    var hashTable;

                    if(typeof(array) !== 'object' || array.length === undefined) {
                        throw new Error('Argument must be an array');
                    }

                    indexName = indexName || 'id';
                    hashTable = {};

                    array.forEach(function(item, index) {
                        //if property in the item doesn't exist
                        if(item[indexName] === undefined) throw new Error('Property doesn\'t exist');

                        if(hashTable[item[indexName]] === undefined) {
                            hashTable[item[indexName]] = index;
                        } else {
                            throw new Error('Duplicated: ' + indexName);
                        }
                    });

                    return hashTable;
                };



                Collection.createName4HashTable = function(name) {
                    return 'getBy' + name.charAt(0).toUpperCase() + name.slice(1);
                };

                Collection.initializedClass = true;
            }

            this.id = Collection.counter++;
        };


        return Collection;
    }];

    module.exports = Collection;
})();