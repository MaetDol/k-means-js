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

  set axis( axis ) {
    this._axis = axis > 0 ? axis : 1;
  }

  get axis() {
    return axis;
  }

  fit() {
    // Init centroids with any value
    let centroids = this.datas.slice( 0, this.k );

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

module.exports = K_means;
