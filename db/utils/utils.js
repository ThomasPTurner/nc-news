const {connection} = require('../../connection')

const formatDate = list => {
    return list.map( ({created_at, ...rest}) => {
        return { created_at: new Date(created_at), ...rest}
    });
};

const makeRefObj = (arr) => {
    const refObj = {}
    arr.forEach(({title, id}) => {
        refObj[title] = id;
    });
    return refObj;
};

const formatComments = (comments, articleRef) => {
    return comments.map( ({ belongs_to, created_by, created_at, ...rest }) => {
        return {
            article_id: articleRef[belongs_to],
            author: created_by,
            created_at: new Date(created_at),
            ...rest
        };
    });
};

// query utils

// adds query functionality for sort_by and order with defaults to timestamp.
const addSortByAndOrder = (query, sort_by, order) => {
    query.orderBy(sort_by || 'created_at', order || 'desc')
}


// adds pagination to query
const addPagination = (query, limit = 10, p = 1) => {
    query.limit(limit)
        .offset(limit * (p - 1));
};

// promise.all utils

// If given a truthy value, unshifts a query into arr to check for presence of that value in the given table.
const checkForBadProperty = (value, column, table, arr) => {
    if (value) {
        const query = connection(table)
            .select('*')
            .where({[column]: value})
            .then(rejectEmptyArr)
        arr.unshift(query) // unshifting instead of push to allow the queries to short-circuit on a rejection.
    }
}

// rejects promise if input is an empty array
const rejectEmptyArr = (arr, errObj = {code: 404, msg: 'not found'}) => {
    if (arr.length === 0) return Promise.reject(errObj)
    else return arr
};

// rejects an order query with a bad value. Unshifts it into a given array.
const rejectBadOrderQuery = (order, arr) => {
    if (!(['asc', 'desc', undefined]).includes(order)) {
        arr.unshift(Promise.reject({code: 400, msg: 'bad request'}))
    } else Promise.resolve()
}

module.exports = { addSortByAndOrder, rejectBadOrderQuery, addPagination, rejectEmptyArr, checkForBadProperty, formatComments, formatDate, makeRefObj}