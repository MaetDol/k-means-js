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

console.log( kmeans.fit() );
