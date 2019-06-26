process.env.NODE_ENC = 'test';
const { expect } = require('chai');
const app = require('../app');
const request = require('supertest')(app);
const {connection} = require('../connection');


describe('api/articles', () => {
    beforeEach(() => {
        return connection.seed.run();
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
        it('articles are sorted by votes by default', () => {
            return request
                .get('/api/articles/')
                .expect(200)
                .then(({body: {articles}})=> {
                    expect(articles).to.be.descendingBy('votes')
                })
        });
        it('articles can be sorted by query', () => {
            return request
                .get('/api/articles/?sort_by=author')
                .expect(200)
                .then(({body: {articles}})=> {
                    expect(articles).to.be.ascendingBy('author')
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
                    .then(({ body: { article: { id, votes }}}) => {
                        expect(id).to.equal(1)
                        expect(votes).to.equal(101)
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
            it('400 on bad value', () => {
                return request  
                    .patch('/api/articles/1')
                    .send({inc_votes: 'batman'})
                    .expect(400)
                    .then(({body: {msg}}) => {
                        expect(msg).to.equal('bad request')
                    })
            });
            it('400 on bad key', () => {
                return request  
                    .patch('/api/articles/1')
                    .send({batman: 1})
                    .expect(400)
                    .then(({body: {msg}}) => {
                        expect(msg).to.equal('bad request')
                    })
            });
            it('400 on additional keys', () => {
                return request  
                    .patch('/api/articles/1')
                    .send({batman: 1, inc_votes: 1})
                    .expect(400)
                    .then(({body: {msg}}) => {
                        expect(msg).to.equal('bad request')
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