import Kmeans from './kmeans.js';
import generateDatas, { sampleDatas, sampleOption } from './dataGenerator.js';

console.log( sampleOption );
console.log( sampleDatas );

const svg = d3.create('svg')
  .attr('viewBox', [0, 0, 400, 400]);
