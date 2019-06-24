exports.formatDate = list => {
    return list.map( obj => {
        obj.created_at = new Date(obj.created_at);
        return obj;
    });
};

exports.makeRefObj = ( arr, key = 'title', value = 'id') => {
    const refObj = {}
    arr.forEach(article => {
        refObj[article[key]] = article[value];
    })
    return refObj
}

exports.formatComments = (comments, articleRef) => {
    const output = [];
    let newMember = {};
    comments.forEach(comment => {
        newComment = Object.assign({}, comment);
        newComment.article_id = articleRef[comment.belongs_to]
        delete newComment.belongs_to
        newComment.author = comment.created_by
        delete newComment.created_by
        output.push(newComment)
    })
    return output
};
