const K_means = require('./kmeans');
const kmeans = new K_means({
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

it('test for test', () => {
  kmeans.datas = [3, 1, 7, 9, 0, 2, 13, 5, 10];
  kmeans.axis = 1;
  const centroids = kmeans.fit().map( c => c.toFixed(2) );
  expect( centroids ).toBe([1.5, 7.75, 13]);
});

