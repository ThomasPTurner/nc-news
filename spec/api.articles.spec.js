process.env.NODE_ENC = 'test';
const { expect } = require('chai');
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
        it('POST', () => {
            return request
                .post('/api/articles/')
                .expect(405)
        });
        it('PATCH', () => {
            return request
                .patch('/api/articles/')
                .expect(405)
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
                    expect(articles).to.be.ascendingBy('votes')
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
        
    });
    describe('api/article/:id', () => {
        describe('invalid methods caught', () => {
            it('PUT', () => {
                return request
                    .put('/api/articles/1')
                    .expect(405)
            });
            it('DELETE', () => {
                return request
                    .delete('/api/articles/1')
                    .expect(405)
            });
            it('POST', () => {
                return request
                    .post('/api/articles/1')
                    .expect(405)
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
                        expect(msg).to.equal('article not found')
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
                        expect(msg).to.equal('article not found')
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