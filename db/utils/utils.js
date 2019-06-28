exports.formatDate = list => {
    return list.map( ({created_at, ...rest}) => {
        return { created_at: new Date(created_at), ...rest}
    });
};

exports.makeRefObj = (arr) => {
    const refObj = {}
    arr.forEach(({title, id}) => {
        refObj[title] = id;
    });
    return refObj;
};

exports.formatComments = (comments, articleRef) => {
    return comments.map( ({ belongs_to, created_by, created_at, ...rest }) => {
        return {
            article_id: articleRef[belongs_to],
            author: created_by,
            created_at: new Date(created_at),
            ...rest
        };
    });
}

// rejects promise if input is an empty array
exports.rejectEmptyArr = (arr, errObj = {code: 404, msg: 'not found'}) => {
    if (arr.length === 0) return Promise.reject(errObj)
    else return arr
};
