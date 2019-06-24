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
};
