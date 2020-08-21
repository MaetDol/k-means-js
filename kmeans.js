class K_means {

  constructor({
    tolerance = 0.01,
    max_iteration = 300,
    k = 0,
    axis = 1,
    datas = [],
  }) {

    this.tolerance = tolerance;
    this.max_iteration = max_iteration;
    this.k = k;

    this.axis = axis > 0 ? axis : 1;
    this.datas = datas;
  }

  set datas( datas ) {
    this._datas = datas;
  }

  get datas() {
    return this._datas;
  }

  fit() {
    // Init centroids with any value
    const centroids = this.datas.slice( 0, this.k );

    for( let iterate=0; iterate < this.max_iteration; iterate++ ) {
      
      const classifications = (new Array( this.k )).fill([]);
      // Clustering
      this.datas.forEach( data => {
        const {centroidIndex} = this.nearestOf( data, centroids );
        classifications[centroidIndex].push( data );
      });

      const inTolerance = true;
      const previousCentroids = [...centroids];
      // Assign centroids as average of cluster
      centroids = classifications.map( clss => 
        clss.reduce((sum, val) => sum + val, 0) / clss.length
      );
      for( let i=0; i < previousCentroids.length; i++ ) {
        const difference = (previousCentroids[i] - centroids[i]) / previousCentroids[i] * 100;
        if( difference > this.tolerance ) {
          inTolerance = false;
        }
      }

      if( inTolerance ) {
        break;
      }

    }
  }

  nearestOf( data, centroids ) {
    const distances = centroids.map((c, idx) => ({
      centroidIndex: idx, 
      value: Math.abs( data - c ) 
    }));
    const nearest = distances.sort((a, b) => b.value - a.value )[0];
    return nearest;
  }

}

export default K_means;
