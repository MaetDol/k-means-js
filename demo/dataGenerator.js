import Kmeans from './kmeans.js';

const option = {
  dims: 1,
  maxValue: 255,
  centerCount: 3,
  spreads: [0.18, 0.3, 0.05],
  clusterDataCount: 100,
};
const sampleDatas = {
  _1d: generateDatas( option ),
  _2d: generateDatas({ ...option, dims: 2 }),
  _3d: generateDatas({ ...option, dims: 3 }),
};

export { sampleDatas, option as sampleOption };
export default generateDatas;

// Function definitions

function generateDatas({ 
  dims, maxValue, 
  centerCount, spreads, 
  clusterDataCount 
}) {
  const stdev = stDev( maxValue );
  const centroids = [];
  const weights = Array.from({ length: centerCount }, (_, idx) => {
    const randomPosition = nRandom( dims, r => r * maxValue );
    centroids.push( randomPosition );
    return Array.from( randomPosition, (r) => {
      const w = [];
      for( let i=0; i < maxValue; i++ ) {
        w[i] = ndf( i, r, stdev * spreads[idx] );
      }
      return w;
    });
  });

  const kmeans = new Kmeans();
  const datas = [];
  for( let i=0; i < centerCount; i++ ) {
    const w = weights[i];
    for( let k=0; k < clusterDataCount; k++ ) {
      const data = [];
      w.forEach( w => {
        data.push( kmeans.weightedRandom( w ));
      });
      datas.push( data );
    }
  }
  return {
    centroids,
    datas
  };
}

function nRandom( n, calc ) {
  return Array.from({ length: n }, () => calc( Math.random() ));
}

/*
 * @param {number} x
 * @param {number} u - mean
 * @param {number} stDev - standard deviation 
 * @description 
 *  Normal Distribution function(maybe)
 *  Large stDev will increase of spreads
 *  u will center of ndf
 */
function ndf(x, u, c) {
  return (1 / (c * Math.sqrt(Math.PI*2))) 
      * Math.E**-((x-u)**2 / (2*c**2));
}

function stDev( max ) {
  const vals = Array.from( new Array(max), (_, i) => i );
  const m = mean( vals );
  return Math.sqrt( vals.reduce((a,v) => (m-v)**2 + a, 0) / vals.length );
}

function mean( arr ) {
  return arr.reduce((a,v) => a+v) / arr.length;
}