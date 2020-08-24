const Kmeans = require('./kmeans');
const kmeans = new Kmeans({
  tolerance: 0.1,
  max_iteration: 300,
  k: 3,
  axis: 3,
  datas: [
    [124, 72, 241],
    [39, 66, 172],
    [211, 132, 124],
    [31, 64, 95],
  ],
});

describe('merge by min', () => {
  const arr1 = [1,3,5,7,9];
  const arr2 = [0,4,3,8];
  it('merge to lower values', () => {
    expect( kmeans.min( arr1, arr2 )).toStrictEqual([0,3,3,7,9]);
  });

  it('merge to lower values', () => {
    expect( kmeans.min( arr2, arr1 )).toStrictEqual([0,3,3,7,9]);
  });
});

describe('weightedRandom', () => {
  const weights = [3, 7, 1, 9, 18, 2];
  it('higher percentage', () => {
    global.Math.random = () => 0.96;
    const result = kmeans.weightedRandom( weights );
    expect( result ).toBe(5);
  });
  
  it('lower percentage', () => {
    global.Math.random = () => 0.25;
    const result = kmeans.weightedRandom( weights );
    expect( result ).toBe(1);
  });
});

/* it('test for test', () => {
  kmeans.datas = [3, 1, 7, 9, 0, 2, 13, 5, 10];
  kmeans.axis = 1;
  const centroids = kmeans.fit().map( c => c.toFixed(2) );
  expect( centroids ).toBe([1.5, 7.75, 13]);
});
*/

