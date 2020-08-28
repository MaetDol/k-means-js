import Kmeans from './kmeans.js';
import generateDatas, { sampleDatas, sampleOption } from './dataGenerator.js';

const { _1d, _2d, _3d } = sampleDatas;
console.log( sampleOption );
console.log( sampleDatas );

// Initialize tooltip
const tooltip = d3.select('body')
  .append('div')
  .attr('class', 'tooltip')
  .style('opacity', 0);



// Single dimensional
const kmeans1D = new Kmeans({
	tolerance: 0.01,
	max_iteration: 300,
	k: 3,
	dimension: 1,
	datas: _1d.datas.map( d => d[0] ),
});

console.groupCollapsed('1d');
const centroids1D = kmeans1D.fit();
console.groupEnd('1d');

document.body.append( scatterplot({
  srcData: _1d.datas,
  centroids: centroids1D.map( v => [v] ),
  width: 500,
  height: 32,
  dimension: 1,
  maxValue: sampleOption.maxValue
}));



// 2 Dimensional
const kmeans2D = new Kmeans({
	k: 3,
	dimension: 2,
	datas: _2d.datas,
  usePPS: false,
});

console.groupCollapsed('2d');
const centroids2D = kmeans2D.multipleFit(200);
console.groupEnd('2d');

document.body.append( scatterplot({
  srcData: _2d.datas,
  centroids: centroids2D,
  width: 500,
  height: 500,
  dimension: 2,
  maxValue: sampleOption.maxValue
}));


// 3 Dimensional
const kmeans3D = new Kmeans({
  k: 3,
  dimension: 3,
  datas: _3d.datas,
  usePPS: false,
});

console.groupCollapsed('3d');
const centroids3D = kmeans3D.multipleFit(200);
console.log(centroids3D);
console.groupEnd('3d');

document.body.append( scatterplot({
  srcData: _3d.datas,
  centroids: centroids3D,
  width: 500,
  height: 500,
  dimension: 3,
  pointRadius: 4,
  maxValue: sampleOption.maxValue
}));

export default function scatterplot({
  srcData,
  centroids,
  width,
  height,
  pointRadius=3,
  acentRadius=6,
  dimension,
  maxValue
}) {
  const margin = {
    left: 8,
    right: 8,
    top: 8,
    bottom: 8,
  };
  const svg = d3.create('svg')
    .attr('viewBox', [0, 0, width, height]);

  const x = d3.scaleLinear()
    .domain([0, maxValue])
    .range([margin.left, width - margin.right]);

  let y = ()=> margin.top;
  if( dimension !== 1 ) {
    y = d3.scaleLinear()
      .domain([0, maxValue])
      .range([height - margin.bottom, margin.top])
  }

  let z = ()=> 'SteelBlue';
  if( dimension === 3 ) {
    z = (r,g,b) => d3.rgb(r,g,b)
  }

  let grid = ()=>{};
  if( dimension !== 1 ) {
    grid = g => g
    .attr('stroke', 'currentColor')
    .attr('stroke-opacity', '0.1')
    .call( g => g.append('g')
      .selectAll('line')
      .data( x.ticks() )
      .join('line')
      .attr('x1', d => 0.5 + x(d))
      .attr('x2', d => 0.5 + x(d))
      .attr('y1', height - margin.bottom )
      .attr('y2', margin.top ))
    .call( g => g.append('g')
      .selectAll('line')
      .data( y.ticks() )
      .join('line')
      .attr('x1', margin.left )
      .attr('x2', width - margin.right )
      .attr('y1', d => 0.5 + y(d))
      .attr('y2', d => 0.5 + y(d)));
  }
  
  // Layouts
  svg.append('g').call( grid );

  // Tooltip
  svg.on('mousemove', () => {
    const clientWidth = svg.node().clientWidth;
    const scaleRatio = clientWidth / width;
    const scaledMargin = {
      left: margin.left * scaleRatio,
      right: margin.right * scaleRatio,
      top: margin.top * scaleRatio,
      bottom: margin.bottom * scaleRatio
    };
    const svgGridWidth = clientWidth - scaledMargin.left - scaledMargin.right;
    const ratio = maxValue / svgGridWidth;

    const xPos = parseInt( (d3.event.offsetX - scaledMargin.left) * ratio );
    const yPos = parseInt( maxValue - (d3.event.offsetY - scaledMargin.top) * ratio );

    tooltip
      .html(`
        X: ${xPos}<br>
        Y: ${yPos}`)
      .style('left', `${d3.event.pageX + 16}px`)
      .style('top', `${d3.event.pageY}px`)
      .transition()
        .duration(100)
        .style('opacity', 0.8);
  });
  svg.on('mouseout', () => {
    if( d3.event.target.isChildOf('svg')) {
      return false;
    }

    tooltip.transition()
      .duration(200)
      .style('opacity', 0);
  });

  // Append datas
  svg.append('g')
    .attr('stroke', 'black')
    .attr('stroke-opacity', '0.6')
    .attr('stroke-width', 1)
    .selectAll('circle')
    .data( srcData )
    .join('circle')
    .attr('fill', ([xVal, yVal=0, zVal=0]) => z( xVal, yVal, zVal ))
    .attr('cy', ([, yVal=0]) => y( yVal ))
    .attr('cx', ([xVal]) => x( xVal ))
    .attr('r', pointRadius )
    .attr('opacity', 0.8);

  if( !centroids ) {
    return svg.node();
  }

  // Append centroids
  svg.append('g')
    .attr('stroke', 'Chartreuse')
    .attr('stroke-width', 3)
    .selectAll('circle')
    .data( centroids )
    .join('circle')
    .attr('fill', ([r, g=0, b=0]) => z( r,g,b ))
    .attr('cy', ([, yVal=0]) => y( yVal ))
    .attr('cx', ([xVal]) => x( xVal ))
    .attr('r', acentRadius );

  return svg.node();
}

Element.prototype.isChildOf = function( tag ) {
  let parent = this.parentElement;
  while( parent !== null ) {
    if( parent.tagName === tag ) {
      return true;
    }
    parent = parent.parentElement;
  }
  return false;
};



