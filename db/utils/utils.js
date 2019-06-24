exports.formatDate = list => {
    return list.map( obj => {
        obj.created_at = new Date(obj.created_at);
        return obj;
    });
};

exports.makeRefObj = ( arr, key = 'article_name', value = 'id') => {
    const refObj = {}
    arr.forEach(person => {
        refObj[person[key]] = person[value];
    })
    return refObj
}

exports.formatComments = (comments, articleRef) => {
    const output = [];
    let newMember = {};
    comments.forEach(comment => {
        newComment = Object.assign({}, comment);
        newComment.article_id = articleRef[comment.article_name]
        delete newComment.article_name
        output.push(newComment)
    })
    return output
};
