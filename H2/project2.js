// Returns a 3x3 transformation matrix as an array of 9 values in column-major order.
// The transformation first applies scale, then rotation, and finally translation.
// The given rotation value is in degrees.
function GetTransform(positionX, positionY, rotation, scale) {
  // transform rotation to radians
  rotation = (rotation * Math.PI) / 180;
  let T = [1, 0, 0, 0, 1, 0, positionX, positionY, 1];
  let S = [scale, 0, 0, 0, scale, 0, 0, 0, 1];
  let R = [
    Math.cos(rotation),
    Math.sin(rotation),
    0,
    Math.sin(rotation),
    -Math.cos(rotation),
    0,
    0,
    0,
    1,
  ];
  return ApplyTransform(ApplyTransform(S, R), T);
}

// Returns a 3x3 transformation matrix as an array of 9 values in column-major order.
// The arguments are transformation matrices in the same format.
// The returned transformation first applies trans1 and then trans2.
function ApplyTransform(trans1, trans2) {
  let result = new Array(9);

  // Loop over each row and column
  for (let col = 0; col < 3; col++) {
    for (let row = 0; row < 3; row++) {
      let sum = 0;
      for (let k = 0; k < 3; k++) {
        sum += trans2[row + k * 3] * trans1[k + col * 3];
      }
      result[row + col * 3] = sum;
    }
  }

  return result;
}
