export default {
  /**
   * 
   * @param {number} p1x X coord of 1st circle
   * @param {number} p1y Y coord of 1st circle
   * @param {number} r1 Radius of 1st circle
   * @param {number} p2x X coord of 2nd circle
   * @param {number} p2y Y coord of 2nd circle
   * @param {number} r2 Radius of 2nd circle
   * @returns {boolean} `true` if circle collides, otherwise `false`
   */
  checkCircleCollision: (p1x, p1y, r1, p2x, p2y, r2) => ((r1 + r2) ** 2 > (p1x - p2x) ** 2 + (p1y - p2y) ** 2),

  /**
   * 
   * @param {number} val Value to interpolate
   * @param {number} min 
   * @param {number} max 
   * @param {number} newMin 
   * @param {number} newMax 
   * @returns {number} Interpolated value between `newMin` and `newMax`
   */
  interpolation: (val, min, max, newMin, newMax) => (( (val-min) / (max-min) ) * (newMax-newMin) + newMin),
}
