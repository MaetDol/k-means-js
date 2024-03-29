# Kmeans.js
Simply(or not) clustering array data using kmeans.js

![Draw rgb format data using D3.js](/demo/demo.jpg?raw=true "Clustered 3 Dimensional data")\
Above image was implemented using d3.js. You can check demo page [here](https://maetdol.github.io/k-means-js/demo/).

## Usage
1 Dimensional data array
```javascript
import Kmeans from './kmeans.js';
const kmeans = new Kmeans({
  k: 3,
  datas: [0, 67, 18, 62, 8, 5, 2, 9, 81, 15, 72]
});

// It can be different result
console.log( kmeans.fit() ); // [70.5, 14, 3.75]
console.log( kmeans.multipleFit(300) ); // [4.8, 70.5, 16.5]
```

2 Dimensional data array
```javascript
import Kmeans from './kmeans.js';
const kmeans = new Kmeans({
  k: 3,
  dimension: 2,
  datas: [
    [3, 21], [5, 16], [8, 19],
    [12, 65], [24, 68], [18, 72],
    [71, 1], [73, 5], [68, 2],
  ],
});
console.log( kmeans.fit() );
```

3 Dimensional data array
```javascript
import Kmeans from './kmeans.js';
const kmeans = new Kmeans({
  k: 3,
  dimension: 3,
  datas: [
    [3, 21, 8], [5, 16, 3], [8, 19, 6],
    [14, 20, 36], [15, 21, 35], [16, 18, 32],
    [42, 0, 8], [48, 1, 5], [46, 3, 5],
  ],
});
console.log( kmeans.fit() );
```

If you does not matter on performance critical, recommend use `kmeans.multipleFit( n )`.
It runs `kmeans.fit` but `n` times. It helps initialize better.

### Access to clursted datas
```javascript
import Kmeans from './kmeans.js';
const kmeans = new Kmeans({ k: 3 });
const datas = [0, 67, 18, 62, 8, 5, 2, 9, 81, 15, 72];
kmeans.fit({ datas });
console.log( kmeans.classifications );
/*
  [
    [18, 9, 15],
    [67, 62, 81, 72],
    [0, 8, 5, 2 ]
  ]
*/
```
It ordered by cluster it result of fit
