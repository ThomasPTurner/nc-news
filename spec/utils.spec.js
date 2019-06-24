process.env.NODE_ENV = 'test'
const { expect } = require('chai');
const { formatDate, makeRefObj, formatComments } = require('../db/utils/utils');

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
        const time1 = Date.now()
        const time2 = time1 - 1000
        const result = formatDate([{created_at: time1},{created_at: time2},])
        dateObj1 = new Date(time1)
        dateObj2 = new Date(time2)
        expect(result).to.eql([{created_at: dateObj},{created_at: dateObj2}]);
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
    it('parses a single person into the refObj', () => {
      const input = [{name: 'Tom', article_name: '1', anotherKey: 'bar'}];
      const actual = makeRefObj(input, 'name', 'article_name');
      const expected = {Tom: '1'};
      expect(actual).to.eql(expected);
    });
    it('parses more than one person into the refObj', () => {
      const input = [{name: 'Tom', article_id: '1', anotherKey: 'bar'}, {name: 'Dick', article_id: '2', anotherKey: 'foo'}];
      const actual = makeRefObj(input, 'name', 'article_id');
      const expected = {Tom: '1', Dick: '2'};
      expect(actual).to.eql(expected);
    });
    it('takes other arguments to build the refObj', () => {
      const input = [{name: 'Tom', belongs_to: '1', anotherKey: 'bar'}, {name: 'Dick', belongs_to: '2', anotherKey: 'foo'}];
      const actual = makeRefObj(input, 'belongs_to', 'anotherKey');
      const expected = {1: 'bar', 2: 'foo'};
      expect(actual).to.eql(expected);
    });
  });
describe('formatComments', () => {
    it('throws back an empty array', () => {
        expect(formatComments([],{})).to.eql([])
    })
    it('changes a single KV pair', () => {
        const comments = [{created_by: 'bad', belongs_to: 'bacon'}];
        const refObj = {bacon: 1};
        const actual = formatComments(comments, refObj);
        const expected = [{author: 'bad', article_id: 1}];
        expect(actual).to.eql(expected);
    })
    it('changes multiple KV pairs for a single article', () => {
        const comments = [{created_by: 'bad', belongs_to: 'bacon'},{created_by: 'cake', belongs_to: 'bacon'}];
        const refObj = {bacon: 1};
        const actual = formatComments(comments, refObj);
        const expected = [{author: 'bad', article_id: 1},{author: 'cake', article_id: 1}];
        expect(actual).to.eql(expected);
    })
    it('changes multiple KV pairs for different articles', () => {
        const comments = [{created_by: 'bad', belongs_to: 'bacon'},{created_by: 'cake', belongs_to: 'batman'}];
        const refObj = {bacon: 1, batman: 2};
        const actual = formatComments(comments, refObj);
        const expected = [{author: 'bad', article_id: 1},{author: 'cake', article_id: 2}];
        expect(actual).to.eql(expected);
    })
    it('does not mutate the input', () => {
        const comments = [{created_by: 'bad', belongs_to: 'bacon'},{created_by: 'cake', belongs_to: 'batman'}];
        const refObj = {bacon: 1, batman: 2};
        const actual = formatComments(comments, refObj);
        const expected = [{author: 'bad', article_id: 1},{author: 'cake', article_id: 2}];
        expect(comments).to.eql([{created_by: 'bad', belongs_to: 'bacon'},{created_by: 'cake', belongs_to: 'batman'}]);
    })
    it('changes key "created_by" to "author"', () => {
        const comments = [{created_by: 'bad', belongs_to: 'bacon'}];
        const refObj = {bacon: 1};
        const actual = formatComments(comments, refObj);
        const expected = [{author: 'bad', article_id: 1}];
        expect(actual).to.eql(expected);
    });
});
