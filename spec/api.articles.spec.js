process.env.NODE_ENC = 'test';
const chai = require('chai');
const { expect } = chai;
chai.use(require('chai-sorted'));
const app = require('../app');
const request = require('supertest')(app);
const {connection} = require('../connection');

describe('api/articles', () => {
    beforeEach(() => {
        return connection.seed.run();
    });
    describe('invalid methods caught', () => {
        it('PUT', () => {
            return request
                .put('/api/articles/')
                .expect(405)
        });
        it('DELETE', () => {
            return request
                .delete('/api/articles/')
                .expect(405)
        });
        it('PATCH', () => {
            return request
                .patch('/api/articles/')
                .expect(405)
        });
    });
    describe('POST', () => {
        it('posts an article', () => {
            return request
                .post('/api/articles/')
                .send({body: 'this is a new article', username: 'fred', title: 'this is a title', topic: 'cats'})
                .expect(201)
                .then(({body: {article: {body}}}) => {
                    expect(body).to.equal('this is a new article')
                })
        });
        it('400 on posting without required properties: body', () => {
            return request
                .post('/api/articles/')
                .send({username: 'fred', title: 'this is a title', topic: 'cats'})
                .expect(400)
                .then(({body: {msg}}) => {
                    expect(msg).to.equal('bad request: value cannot be null')
                })
        });
        it('400 on posting without required properties: topic', () => {
            return request
                .post('/api/articles/')
                .send({body: 'this is a new article', username: 'fred', topic: 'cats'})
                .expect(400)
                .then(({body: {msg}}) => {
                    expect(msg).to.equal('bad request: value cannot be null')
                })
        });
        it('404 on post from a username that does not exist', () => {
            return request
                .post('/api/articles/')
                .send({body: 'this is a new article', username: 'foo', title: 'this is a title', topic: 'cats'})
                .expect(404)
                .then(({body: {msg}}) => {
                    expect(msg).to.equal('dependant resource not found')
                })
        });
        it('404 on post to a topic that does not exist', () => {
            return request
                .post('/api/articles/')
                .send({body: 'this is a new article', username: 'fred', title: 'this is a title', topic: 'foo'})
                .expect(404)
                .then(({body: {msg}}) => {
                    expect(msg).to.equal('dependant resource not found')
                })
        });
        it('400 on additional keys', () => {
            return request
                .post('/api/articles/')
                .send({body: 'this is a new article', username: 'fred', title: 'this is a title', topic: 'cats', foo: 'bar'})
                .expect(400)
                .then(({body: {msg}}) => {
                    expect(msg).to.equal('bad request')
                })
        });
    });
    describe('GET', () => {
        it('gets a list of articles', () => {
            return request
                .get('/api/articles/')
                .expect(200)
                .then(( {body: {articles}} ) => {
                    expect(articles.length).to.be.greaterThan(1);
                });
        });
        it('articles have correct keys', () => {
            return request
                .get('/api/articles/')
                .expect(200)
                .then(({body: {articles: [article]}}) => {
                    expect(article).to.have.keys(
                        'author',
                        'title',
                        'id',
                        'body',
                        'topic',
                        'created_at',
                        'votes',
                        'comment_count'
                    );
                });
        });
        it('articles are sorted by descending created_at by default', () => {
            return request
                .get('/api/articles/')
                .expect(200)
                .then(({body: {articles}})=> {
                    expect(articles).to.be.descendingBy('created_at')
                })
        });
        it('articles can be sorted by query', () => {
            return request
                .get('/api/articles/?sort_by=author')
                .expect(200)
                .then(({body: {articles}})=> {
                    expect(articles).to.be.descendingBy('author')
                })
        });
        it('default limit of 10', () => {
            return request
                .get('/api/articles/')
                .expect(200)
                .then(({body: {articles}})=> {
                    expect(articles.length).to.equal(10)
                })
        });
        it('page query to get to the next page', () => {
            return request
                .get('/api/articles/?p=2')
                .expect(200)
                .then(({body: {articles}})=> {
                    expect(articles.length).to.equal(3)
                })
        });
        it('page query is dynamic with limit', () => {
            return request
                .get('/api/articles/?p=4&limit=4')
                .expect(200)
                .then(({body: {articles}})=> {
                    expect(articles.length).to.equal(1)
                })
        });
        it('can limit by query', () => {
            return request
                .get('/api/articles/?limit=2')
                .expect(200)
                .then(({body: {articles}})=> {
                    expect(articles.length).to.equal(2)
                })
        });
        it('400 on bad sort query', () => {
            return request
                .get('/api/articles/?sort_by=batman')
                .expect(400)
                .then(({body: {msg}})=> {
                    expect(msg).to.equal('bad request')
                })
        });
        it('articles ordered query', () => {
            return request
                .get('/api/articles/?order=asc')
                .expect(200)
                .then(({body: {articles}})=> {
                    expect(articles).to.be.ascendingBy('created_at')
                })
        });
        it('400 on bad orders query', () => {
            return request
                .get('/api/articles/?order=batman')
                .expect(400)
                .then(({body: {msg}})=> {
                    expect(msg).to.equal('bad request')
                })
        });
        it('query of topics to restrict results',() => {
            return request 
                .get('/api/articles/?topic=cats')
                .expect(200)
                .then(({body: {articles}})=>{
                    const checkTopics = articles.every(({topic})=> {
                        return (topic === 'cats')
                    })
                    expect(checkTopics).to.be.true
                })
        })
        it('404 on bad topic query',() => {
            return request 
                .get('/api/articles/?topic=batman')
                .expect(404)
                .then(({body: {msg}})=>{
                    expect(msg).to.equal('not found')
                })
        })
        it('404 on bad author query',() => {
            return request 
                .get('/api/articles/?author=batman')
                .expect(404)
                .then(({body: {msg}})=>{
                    expect(msg).to.equal('not found')
                })
        })
        it("multiple queries doesn't break it", () => {
            return request
                .get('/api/articles/?sort_by=id&order=desc&topic=mitch&author=icellusedkars')
                .expect(200)
                .then(({body: {articles}})=>{
                    const checkValues = articles.every( ({topic, author}) => {
                        return (topic === 'mitch' && author === 'icellusedkars')
                    })
                    expect(checkValues).to.be.true;
                    expect(articles).to.be.descendingBy('id');
                })
        })
        it('query of author to restrict results',() => {
            return request 
                .get('/api/articles/?author=icellusedkars')
                .expect(200)
                .then(({body: {articles}})=>{
                    const checkAuthor = articles.every(({author})=> {
                        return (author === 'icellusedkars')
                    })
                    expect(checkAuthor).to.be.true
                })
        })
        it('404 on bad topic query',() => {
            return request 
                .get('/api/articles/?topic=batman')
                .expect(404)
                .then(({body: {msg}})=>{
                    expect(msg).to.equal('not found')
                })
        })
        it('404 on bad author query',() => {
            return request 
                .get('/api/articles/?author=batman')
                .expect(404)
                .then(({body: {msg}})=>{
                    expect(msg).to.equal('not found')
                })
        })
        it('has a total count', () => {
            return request
                .get('/api/articles/')
                .expect(200)
                .then(({body: {total_count}}) => {
                    expect(total_count).to.equal('13')
                })
        });
        it('total count changes with queries', () => {
            return request
                .get('/api/articles/?limit=4&page=2&topic=cats')
                .expect(200)
                .then(({body: {total_count}}) => {
                    expect(total_count).to.equal('1')
                })
        });
        
    });
    describe('api/article/:id', () => {
        describe('invalid methods caught', () => {
            it('PUT', () => {
                return request
                    .put('/api/articles/1')
                    .expect(405)
            });
            it('POST', () => {
                return request
                    .post('/api/articles/1')
                    .expect(405)
            });
        });
        describe('DELETE', () => {
            it('removes an article by id. Returns nothing.', () => {
                return request
                    .delete('/api/articles/1')
                    .expect(204)
                    .then(({body})=>{
                        expect(body).to.eql({})
                    })
                    .then(()=>{
                        return connection('articles')
                            .select('*')
                            .where('id','=',1)
                    })
                    .then(([article])=> {
                        expect(article).to.be.undefined
                    })
            });
            it('also removes associated comments', () => {
                return request
                    .delete('/api/articles/1')
                    .expect(204)
                    .then(() => connection('comments')
                        .select('*')
                        .where('article_id','=',1)
                    )
                    .then(([comments]) => {
                        expect(comments).to.be.undefined
                    })
            });
            it('404 on bad article', () => {
                return request 
                    .delete('/api/articles/9001')
                    .expect(404)
                    .then( ({body: {msg}}) => {
                      expect(msg).to.equal('not found')
                    })
            });
        });
        describe('GET', () => {
            it('retrives a single article with the correct keys', () => {
                return request
                    .get('/api/articles/1')
                    .expect(200)
                    .then(({body: {article}}) => {
                        expect(article).to.have.keys(
                            'author',
                            'title',
                            'id',
                            'body',
                            'topic',
                            'created_at',
                            'votes',
                            'comment_count'
                        );
                        expect(article.id).to.equal(1)
                    });
            });
            it('article has correct comment_count', () => {
                return request
                    .get('/api/articles/1')
                    .expect(200)
                    .then(( {body: {article: {comment_count}}} ) => {
                        expect(comment_count).to.equal('13');
                    });
            });
            it('404 on valid but absent id', ()=> {
                return request 
                    .get('/api/articles/9001')
                    .expect(404)
                    .then(({body: {msg}}) => {
                        expect(msg).to.equal('not found')
                    });
            });
            it('400 on invalid id', ()=> {
                return request 
                    .get('/api/articles/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
                    .expect(400)
                    .then(({body: {msg}}) => {
                        expect(msg).to.equal('bad request')
                    });
            });
        });
        describe('PATCH', () => {
            it('updates votes, responds with updated article', () => {
                return request  
                    .patch('/api/articles/1')
                    .send({inc_votes: 1})
                    .expect(200)
                    .then(({ body: { article}}) => {
                        expect(article.id).to.equal(1)
                        expect(article.votes).to.equal(101)
                        expect(article).to.have.keys(
                            'author',
                            'title',
                            'id',
                            'body',
                            'topic',
                            'created_at',
                            'votes',
                            'comment_count'
                        );
                    })
            });
            it('allows negative votes', () => {
                return request  
                    .patch('/api/articles/1')
                    .send({inc_votes: -1})
                    .expect(200)
                    .then(({ body: { article: { votes }}}) => {
                        expect(votes).to.equal(99)
                    })
            });
            it('allows votes to be negative', () => {
                return request  
                    .patch('/api/articles/1')
                    .send({inc_votes: -101})
                    .expect(200)
                    .then(({ body: { article: { votes }}}) => {
                        expect(votes).to.equal(-1)
                    })
            });
            it('404 on valid but absent id', ()=> {
                return request 
                    .patch('/api/articles/9001')
                    .send({inc_votes: 1})
                    .expect(404)
                    .then(({body: {msg}}) => {
                        expect(msg).to.equal('not found')
                    });
            });
            it('400 on invalid id', ()=> {
                return request 
                    .patch('/api/articles/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
                    .send({inc_votes: 1})
                    .expect(400)
                    .then(({body: {msg}}) => {
                        expect(msg).to.equal('bad request')
                    });
            });
        });
    });
});