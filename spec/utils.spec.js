process.env.NODE_ENV = 'test'
const { expect } = require('chai');
const { rejectEmptyArr, rejectBadOrderQuery, formatDate, makeRefObj, formatComments, addPagination, checkForBadProperty } = require('../db/utils/utils');
const app = require('../app');
const request = require('supertest')(app);
const {connection} = require('../connection')

describe('rejectBadOrderQuery', () => {
    it('does nothing if "order" is an allowed value', () => {
        const arr = []
        rejectBadOrderQuery(undefined, arr)
        rejectBadOrderQuery('asc', arr)
        rejectBadOrderQuery('desc', arr)
        expect(arr).to.eql([])
    });
    it('unshifts promise that will always reject on a disallowed value', () => {
        const arr = ['bar']
        rejectBadOrderQuery('foo', arr)
        return arr[0]
            .then(()=>{
                expect('the promise did not reject').to.equal('')
            })
            .catch(()=>{
                expect('the promise rejected').to.equal('the promise rejected')
            })
    });
    it('rejects with a 400 error object', () => {
        const arr = []
        rejectBadOrderQuery('foo', arr)
        return arr[0]
            .catch(({code})=>{
                expect(code).to.equal(400)
            })
    });
});


describe('rejectEmptyArr', () => {
    it('simply returns an array with contents', () => {
        expect(rejectEmptyArr([1])).to.eql([1])
    });
    it('returns a rejected promise on an empty array', () => {
        return rejectEmptyArr([])
            .then(()=>{
                expect('the promise did not reject').to.equal('')
            })
            .catch(()=>{
                expect('the promise rejected').to.equal('the promise rejected')
            })
    });
    it('the rejected promise provided a 404 error object by default', () => {
        return rejectEmptyArr([])
            .catch(({code})=>{
                expect(code).to.eql(404)
            })
    });
    it('the rejected promise passes the second argument if provided', () => {
        return rejectEmptyArr([], 'foo')
            .catch((err)=>{
                expect(err).to.eql('foo')
            })
    });
});


describe('addPagination', () => {
    beforeEach(() => {
        return connection.seed.run();
    });
    it('adds pagination to a query', () => {
        const query = connection('articles').select('*').orderBy('id')
        const [limit, page] = [5, 2]
        addPagination(query, limit, page)
        return query
            .then(([{id}]) =>
                expect(id).to.equal(6)
            )
        
    });
});

describe('checkForBadProperty', () => {
    beforeEach(() => {
        return connection.seed.run();
    });
    it('does nothing if value is falsy', () => {
        const [value, column, table, arr] = [undefined, 'id', 'articles', []]
        checkForBadProperty(value, column, table, arr)
        expect(arr).to.eql([])
    });
    it('unshifts a promise into the array on truthy value', () => {
        const [value, column, table, arr] = ['1', 'id', 'articles', [0]]
        checkForBadProperty(value, column, table, arr)
        return arr[0]
            .then(([{id}]) =>
                expect(id).to.equal(1)
            )
    });
    it('promise will reject if value is no in the table and column', () => {
        const [value, column, table, arr] = ['giraffe', 'id', 'articles', [0]]
        checkForBadProperty(value, column, table, arr)
        return arr[0]
            .then(()=>{
                expect('the promise did not reject').to.equal('')
            })
            .catch(()=>{
                expect('the promise rejected').to.equal('the promise rejected')
            })
    });
    it('rejected promise passes a pg error 22P02', () => {
        const [value, column, table, arr] = ['giraffe', 'id', 'articles', [0]]
        checkForBadProperty(value, column, table, arr)
        return arr[0]
            .catch(({code})=>{
                expect(code).to.equal('22P02')
            })
    });
});

describe('formatDate', () => {
    it('handles an empty array', () => {
        expect(formatDate([])).to.eql([]);
    });
    it('changes a single timeStamp', () => {
        const time = Date.now()
        const [{ created_at }] = formatDate([{created_at: time}])
        dateObj = new Date(time)
        expect(created_at).to.eql(dateObj);
    });
    it('changes multiple timestamps with different times', () => {
        const time1 = new Date('October 29, 2011 03:24:00')
        const time2 = new Date('October 28, 1986 03:24:00')
        const result = formatDate([{created_at: time1},{created_at: time2},])
        dateObj1 = new Date(time1)
        dateObj2 = new Date(time2)
        expect(result).to.eql([{created_at: dateObj1},{created_at: dateObj2}]);
    });
    it('does not change the rest of the object', () => {
        const time = Date.now();
        const result = formatDate([{a: 1, created_at: time, b: 'Hello'}]);
        expect(result[0].a).to.equal(1);
        expect(result[0].b).to.equal('Hello');
    });
});
describe('makeRefObj', () => {
    it('returns an empty object, when passed an empty array', () => {
      const input = [];
      const actual = makeRefObj(input);
      const expected = {};
      expect(actual).to.eql(expected);
    });
    it('parses a single article into the refObj', () => {
      const input = [{title: 'Tom', id: '1', anotherKey: 'bar'}];
      const actual = makeRefObj(input);
      const expected = {Tom: '1'};
      expect(actual).to.eql(expected);
    });
    it('parses more than one article into the refObj', () => {
      const input = [{title: 'Tom', id: '1', anotherKey: 'bar'}, {title: 'Dick', id: '2', anotherKey: 'foo'}];
      const actual = makeRefObj(input);
      const expected = {Tom: '1', Dick: '2'};
      expect(actual).to.eql(expected);
    });
  });
describe('formatComments', () => {
    it('throws back an empty array', () => {
        expect(formatComments([],{})).to.eql([])
    })
    it('changes a single KV pair', () => {
        const comments = [{created_by: 'bad', belongs_to: 'bacon',created_at: Date.now()}];
        const refObj = {bacon: 1};
        const [{article_id}] = formatComments(comments, refObj);
        expect(article_id).to.equal(1);
    })
    it('changes multiple KV pairs for a single article', () => {
        const comments = [{created_by: 'bad',created_at: Date.now(), belongs_to: 'bacon'},{created_by: 'cake',created_at: Date.now(), belongs_to: 'bacon'}];
        const refObj = {bacon: 1};
        const [{article_id: id1}, {article_id: id2}] = formatComments(comments, refObj);
        expect(id1).to.eql(id2);
    })
    it('changes multiple KV pairs for different articles', () => {
        const comments = [{created_by: 'bad',created_at: Date.now(), belongs_to: 'bacon'},{created_by: 'cake',created_at: Date.now(), belongs_to: 'batman'}];
        const refObj = {bacon: 1, batman: 2};
        const [{article_id: id1}, {article_id: id2}] = formatComments(comments, refObj);
        expect([id1, id2]).to.eql([1, 2]);
    })
    it('does not mutate the input', () => {
        const time = new Date('October 29, 2011 03:24:00')
        const comments = [{created_by: 'bad', created_at: time, belongs_to: 'bacon'},{created_by: 'cake', created_at: time, belongs_to: 'batman'}];
        const refObj = {bacon: 1, batman: 2};
        formatComments(comments, refObj);
        expect(comments).to.eql([{created_by: 'bad', created_at: time, belongs_to: 'bacon'},{created_by: 'cake', created_at: time, belongs_to: 'batman'}]);
    })
    it('changes key "created_by" to "author"', () => {
        const comments = [{created_by: 'bad', created_at: Date.now(), belongs_to: 'bacon'}];
        const refObj = {bacon: 1};
        const [{author, belongs_to}] = formatComments(comments, refObj);
        expect(author).to.equal('bad');
        expect(belongs_to).to.equal(undefined);
    });
    it('reformats the date timestamp in "created_by"', () => {
        const time = new Date('October 29, 2011 03:24:00')
        const comments = [{created_by: 'bad', created_at: time, belongs_to: 'bacon'}];
        const refObj = {bacon: 1};
        const [{created_at}] = formatComments(comments, refObj);
        expect(created_at).to.eql(new Date(time));
    });
});
