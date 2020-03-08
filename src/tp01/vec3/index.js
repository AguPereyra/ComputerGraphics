const normalize = (a) => {
  //  Check if a is 0 vector
  if (a.length === 0 || (a[0] === a[1] === a[2]) === 0) {
    throw new Error('Zero vector is not accepted.')
  }
  const norm = Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2])
  return [
    a[0] / norm,
    a[1] / norm,
    a[2] / norm
  ]
}

const cross = (a, b) => {
  const c = [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0]
  ]
  return c
}

const normals = (a, b, c) => {
  const u = [
    b[0] - a[0],
    b[1] - a[1],
    b[2] - a[2]
  ]
  const v = [
    c[0] - b[0],
    c[1] - b[1],
    c[2] - b[2]
  ]
  const res = cross(u, v)
  return normalize(res)
}

module.exports = {
  normalize,
  cross,
  normals
}
