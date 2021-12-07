export default class Kmeans {

  constructor({
    tolerance = 0.01,
    max_iteration = 300,
    k = 0,
    dimension: dims = 1,
    datas = [],
    usePPS = true,
  }={}) {

    this.tolerance = tolerance;
    this.max_iteration = max_iteration;
    this.usePPS = usePPS;
    this.k = k;

    this.dims = dims > 0 ? dims : 1;
    this.datas = datas;

    this.centroids = [];
    this.initSub();
  }

  initSub() {
    switch( this.dims ) {
      case 1:
        this.add = (a, b) => a + b;
        this.sub = (a, b) => (a - b)**2;
        this.divider = (a, b) => a / b;
        this.ZERO_POINT = 0;
        break;

      case 2:
        this.add = ([x, y], [x2, y2=y2]) => [x+x2, y+y2];
        this.sub = ([x, y], [x2, y2=x2]) => (x-x2)**2 + (y-y2)**2;
        this.divider = ([x, y], [x2, y2=x2]) => [x/x2, y/y2];
        this.ZERO_POINT = [0, 0];
        break;

      case 3:
        this.add = ([x, y, z], [x2, y2=x2, z2=x2]) => [x+x2, y+y2, z+z2];
        this.sub = ([x, y, z], [x2, y2=x2, z2=x2]) => (x-x2)**2 + (y-y2)**2 + (z-z2)**2;
        this.divider = ([x, y, z], [x2, y2=x2, z2=x2]) => [x/x2, y/y2, z/z2];
        this.ZERO_POINT = [0, 0, 0];
        break;
    }
  }

  sub() {}
  add() {}
  divider() {}

  set datas( datas ) {
    this._datas = datas;
  }

  get datas() {
    return this._datas;
  }

  set dims( dims ) {
    this._dims = dims > 0 ? dims : 1;
    this.initSub();
  }

  get dims() {
    return this._dims;
  }

  distanceTo( centroid ) {
    return this.datas.map( d => this.sub( d, centroid ));
  }

  min( a, b ) {
    const [longArr, shortArr] = a.length > b.length ? [a, b] : [b, a];
    return longArr.map((val, idx) => Math.min(
        val, 
        shortArr.length > idx ? shortArr[idx] : val 
    ));
  }

  sum( a ) {
    return a.reduce((acc, val) => acc + val, 0);
  }

  weightedRandom( weights ) {
    const weightsSum = this.sum( weights ),
          r = Math.random();
    let sum = 0;

    if( weightsSum === 0 ) return 0;

    for( let i=0; i < weights.length; i++ ) {
      sum += weights[i] / weightsSum;
      if( r <= sum ) {
        return i;
      }
    }
    return sum / weights.length;
  }

  indexOfMax( arr ) {
    return arr.reduce((max, val, idx, arr) =>
      arr[max] < val ? idx : max 
      , 0 );
  }

  kmeansPP() {
    const randomIndex = parseInt( Math.random() * this.datas.length );
    let centroids = [this.datas[randomIndex]];

    let minDistances = this.distanceTo( centroids[0] );
    for( let i=0; i < this.k-1; i++ ) {
      // Get nearest distances from centroids
      const distances = 
        this.min( minDistances, this.distanceTo( centroids[i] ));
      // Select new centroid based on probability proportional to size
      let newCentroid = null;
      if( this.usePPS ) {
        newCentroid = this.datas[this.weightedRandom( distances )];
      } else {
        newCentroid = this.datas[this.indexOfMax( distances )];
      }

      centroids.push( newCentroid );
      minDistances = distances;
    }

    return centroids;
  }

  multipleFit( runCount ) {
    const centroidCandidates = [];
    for( let i=0; i < runCount; i++ ) {
      this.fit().forEach( c => centroidCandidates.push(c) );
    }

    const centroids = this.fit({ datas: centroidCandidates });
    return this.fit({ centroids });
  }

  fit({ centroids, datas=this.datas }={}) {
    if( !(datas instanceof Array) || !datas.flat().length ) throw new Error('Empty data is not valid. Please provide datas');

    this.datas = datas; 
    centroids = centroids || this.kmeansPP();

    // Init centroids using kmeans++
    for( let iterate=0; iterate < this.max_iteration; iterate++ ) {
      
      // Generate k empty arrays
      const classifications = Array.from({length: this.k}, ()=>[]);
      this.classifications = classifications;
      // Clustering
      datas.forEach( data => {
        const {centroidIndex} = this.nearestOf( data, centroids );
        classifications[centroidIndex].push( data );
      });

      let inTolerance = true;
      const previousCentroids = [...centroids];
      // Assign centroids as average of cluster
      centroids = classifications.map( (cls, i) => {
        return cls.length 
          ? this.average( cls )
          : centroids[i];
      });

      for( let i=0; i < previousCentroids.length; i++ ) {
        const difference = this.difference( previousCentroids[i], centroids[i] );
        if( difference > this.tolerance ) {
          inTolerance = false;
          break;
        }
      }

      if( inTolerance ) {
        break;
      }
    }
    return centroids;
  }

  difference( data1, data2 ) {
    return this.sub( data1, data2 ) / this.maxData * 100;
  }

  average( arr ) {
    const length = this.dims === 1 
      ? arr.length
      : Array.from( this.ZERO_POINT, () => arr.length );

    return this.divider( 
      arr.reduce( this.add ),
      length,
    );
  }

  nearestOf( data, centroids ) {
    let nearest = { value: Number.MAX_SAFE_INTEGER };
    centroids.forEach((c, idx) => {
      const d = {
        centroidIndex: idx, 
        value: this.sub( data, c )
      };
      nearest = nearest.value > d.value ? d : nearest;
    });
    return nearest;
  }
}
