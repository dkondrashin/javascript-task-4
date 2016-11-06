'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы or и and
 */
exports.isStar = false;

var OPERATORS_PRIORITY = {
    filterIn: 1,
    sortBy: 2,
    select: 3,
    limit: 4,
    format: 5
};


/**
 * Запрос к коллекции
 * @param {Array} collection
 * @params {...Function} – Функции для запроса
 * @returns {Array}
 */
exports.query = function (collection) {
    var operators = [].slice.call(arguments, 1);
    var collectionCopy = collection.map(function (contact) {
        return Object.assign({}, contact);
    });
    operators.sort(function (a, b) {
        return (OPERATORS_PRIORITY[a.name] > OPERATORS_PRIORITY[b.name]);
    });

    return operators.reduce(function (resultCollection, currentOperator) {
        return currentOperator(resultCollection);
    }, collectionCopy);
};


/**
 * Выбор полей
 * @params {...String}
 * @returns {function}
 */
exports.select = function () {
    var reqProperties = [].slice.call(arguments);

    return function select(collection) {
        return collection.map(function (contact) {
            var contactWithReqProps = {};
            reqProperties.forEach(function (property) {
                if (contact.hasOwnProperty(property)) {
                    contactWithReqProps[property] = contact[property];
                }
            });

            return contactWithReqProps;
        });
    };
};

/**
 * Фильтрация поля по массиву значений
 * @param {String} property – Свойство для фильтрации
 * @param {Array} values – Доступные значения
 * @returns {function}
 */
exports.filterIn = function (property, values) {
    return function filterIn(collection) {
        return collection.filter(function (contact) {

            return (values.indexOf(contact[property]) !== -1);
        });
    };
};

/**
 * Сортировка коллекции по полю
 * @param {String} property – Свойство для фильтрации
 * @param {String} order – Порядок сортировки (asc - по возрастанию; desc – по убыванию)
 * @returns {function}
 */
exports.sortBy = function (property, order) {
    return function sortBy(collection) {
        return collection.sort(function (a, b) {
            if (a[property] === b[property]) {
                return 0;
            }
            if (order === 'asc') {
                return (a[property] > b[property]);
            }

            return (a[property] < b[property]);
        });
    };
};

/**
 * Форматирование поля
 * @param {String} property – Свойство для фильтрации
 * @param {Function} formatter – Функция для форматирования
 * @returns {function}
 */
exports.format = function (property, formatter) {
    return function format(collection) {
        return collection.map(function (contact) {
            contact[property] = formatter(contact[property]);

            return contact;
        });
    };
};

/**
 * Ограничение количества элементов в коллекции
 * @param {Number} count – Максимальное количество элементов
 * @returns {function}
 */
exports.limit = function (count) {
    return function limit(collection) {

        return collection.slice(0, count);
    };
};
