//  Represent matrix as Column Major Order
const transpose = (A) => {
  //  La transpuesta es igual a leer el vector como si fuera Row Major Order
  let C = []
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      C.push(A[j * 4 + i])
    }
  }
  return C
}

const multiply = (A, B) => {
  let C = []
  let j = 0 //  Indice de A
  let k = 0 //  Indice de B
  for (let i = 0; i < 16; i++, j++) {
    //  Si recorrimos toda la fila -> Mover
    if (i % 4 === 0) {
      j = 0 //  Mover al inicio de la fila
      k = i //  Mover a nueva columna
    }
    //  Calcular valor en C_i
    //  C_i = Sum (a_[j+m*n] * b_[k+m] ), m: 0->n
    let sum = 0
    for (let m = 0; m < 4; m++) {
      sum += (A[j + m * 4] * B[k + m])
    }
    C.push(sum)
  }
  return C
}

module.exports = {
  transpose,
  multiply
}
