import Kmeans from './index.js';

describe('merge by min', () => {
  const kmeans = new Kmeans();
  const arr1 = [1,3,5,7,9];
  const arr2 = [0,4,3,8];
  it('merge to lower values', () => {
    expect( kmeans.min( arr1, arr2 )).toStrictEqual([0,3,3,7,9]);
  });

  it('merge to lower values', () => {
    expect( kmeans.min( arr2, arr1 )).toStrictEqual([0,3,3,7,9]);
  });
});

describe('distanceTo', () => {

  it('distance of signle dimensional', () => {
    const kmeans = new Kmeans();
    Kmeans.dims = 1;
    kmeans.datas = [0,1,2,3];
    expect( kmeans.distanceTo( 2 )).toStrictEqual([4, 1, 0, 1]);
  });

  it('distance of 2 dimensional', () => {
    const kmeans = new Kmeans();
    kmeans.dims = 2;
    kmeans.datas = [[0,1], [1,2], [2,3], [4,4]];
    expect( kmeans.distanceTo([3, 1])).toStrictEqual([9, 5, 5, 10]);
  });

  it('distance of 3 dimensional', () => {
    const kmeans = new Kmeans();
    kmeans.dims = 3;
    kmeans.datas = [
      [0, 2, 5],
      [6, 7, 2],
      [10, 10, 10],
    ];
    expect( kmeans.distanceTo([2, 2, 2])).toStrictEqual([13, 41, 192]);
  });
});

describe('weightedRandom', () => {
  const kmeans = new Kmeans();
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

describe('clurstering single dimensional', () => {
  const kmeans = new Kmeans({
    k: 3,
    dimension: 1,
  });
  it('Little datas', () => {
    kmeans.datas = [3, 1, 7, 9, 0, 2, 13, 5, 10];
    global.Math.random = () => 0.7;
    const centroids = kmeans.fit().map( c => parseFloat(c.toFixed(2)) );
    expect( centroids ).toStrictEqual([4.25, 10.67, 0.50]);
  });
});

describe('clurstering 2 dimensional', () => {
  const kmeans = new Kmeans({
    k: 3,
    dimension: 2,
  });
  it('Little datas', () => {
    kmeans.datas = [[0,1],[3,2],[2,2],[2,10],[4,8],[1,9],[9,9],[8,7],[12,11]];
    global.Math.random = () => 0.6;
    const centroids = kmeans.fit().map(([x,y]) => [parseFloat(x.toFixed(2)), parseFloat(y.toFixed(2))] );
    expect( centroids ).toStrictEqual([
      [1.67, 1.67],
      [9.67, 9.00],
      [2.33, 9.00]
    ]);
  });
});

describe('clustering 3 dimensional', () => {
  const kmeans = new Kmeans({
    k:3,
    dimension: 3,
  });
  it('Little datas', () => {
    kmeans.datas = [
      [ 3, 7, 1 ], [ 7, 19, 6 ], [ 17, 8, 12 ],
      [ 3, 4, 1 ], [ 14, 17, 8 ], [ 16, 4, 11 ],
      [ 2, 3, 2 ], [ 13, 16, 9 ], [ 17, 5, 9 ],
      [ 0, 16, 4 ], [ 1, 17, 6 ], [ 16, 3, 12 ]
    ];
    global.Math.random = () => 0.6;
    const centroids = kmeans.fit().map(([x,y,z]) => [
      parseFloat( x.toFixed(2) ),
      parseFloat( y.toFixed(2) ),
      parseFloat( z.toFixed(2) ),
    ]);
    expect( centroids ).toStrictEqual([
      [ 2.67,  4.67, 1.33],
      [14.29, 10.29, 9.57],
      [ 0.50, 16.50, 5.00],
    ]);
  });
});
