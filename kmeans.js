class Kmeans {

  constructor({
    tolerance = 0.01,
    max_iteration = 300,
    k = 0,
    dimension: dims = 1,
    datas = [],
  }={}) {

    this.tolerance = tolerance;
    this.max_iteration = max_iteration;
    this.k = k;

    this.dims = dims > 0 ? dims : 1;
    this.datas = datas;

    this.centroids = [];
  }

  set datas( datas ) {
    this._datas = datas;
  }

  get datas() {
    return this._datas;
  }

  set dims( dims ) {
    this._dims = dims > 0 ? dims : 1;
  }

  get dims() {
    return dims;
  }

  distanceTo( centroid ) {
    return this.datas.map( d => (d - centroid)**2 );
  }

  min( a, b ) {
    const [longArr, shortArr] = a.length > b.length ? [a, b] : [b, a];
    return longArr.map((val, idx) => 
      Math.min( 
        val, 
        shortArr.length > idx ? shortArr[idx] : val 
      )
    );
  }

  sum( a ) {
    return a.reduce((acc, val) => acc + val, 0);
  }

  weightedRandom( weights ) {
    const weightsSum = this.sum( weights ),
          r = Math.random();
    let sum = 0;
    for( let i=0; i < weights.length; i++ ) {
      sum += weights[i] / weightsSum;
      if( r <= sum ) {
        return i;
      }
    }
  }

  kmeansPP() {
    // Pick one randomly
    let centroids = [this.datas[0]];

    let minDistances = this.distanceTo( centroids[0] );
    for( let i=0; i < this.k-1; i++ ) {
      // Get nearest distances from centroids
      const distances = 
        this.min( minDistances, this.distanceTo( centroids[i] ));
      // Select new centroid based on probability proportional to size
      const newCentroid = 
        this.datas[this.weightedRandom( distances )];

      centroids.push( newCentroid );
      minDistances = distances;
    }

    return centroids;
  }

  fit() {
    // Init centroids using kmeans++
    let centroids = this.kmeansPP();

    for( let iterate=0; iterate < this.max_iteration; iterate++ ) {
      
      const classifications = Array.from({length: this.k}, ()=>[]);
      // Clustering
      this.datas.forEach( data => {
        const {centroidIndex} = this.nearestOf( data, centroids );
        classifications[centroidIndex].push( data );
      });

      let inTolerance = true;
      const previousCentroids = [...centroids];
      // Assign centroids as average of cluster
      centroids = classifications.map( clss => 
        clss.reduce((sum, val) => sum + val, 0) / clss.length
      );

      for( let i=0; i < previousCentroids.length; i++ ) {
        const difference = Math.abs( (previousCentroids[i] - centroids[i]) / previousCentroids[i] * 100 );
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

  nearestOf( data, centroids ) {
    const distances = centroids.map((c, idx) => ({
      centroidIndex: idx, 
      value: Math.abs( data - c ) 
    }));
    const nearest = distances.sort((a, b) => a.value - b.value )[0];
    return nearest;
  }

}

module.exports = Kmeans;
