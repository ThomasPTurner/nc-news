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
describe.skip('makeRefObj', () => {
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
describe.skip('formatComments', () => {
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
