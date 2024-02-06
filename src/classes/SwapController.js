export class SwapController{
  #iterations
  #currentIterations

  constructor() {
    this.#iterations = []
    this.#currentIterations = []
  }

  addIteration(columns){
    const iteraion = []
    columns.forEach(column => iteraion.push(false))

    this.#iterations.push(iteraion)
    this.#currentIterations = iteraion
  }

  removeCurrentIteration(){
    this.#iterations.pop()
    this.#currentIterations = null

    if(this.#iterations.length){
      this.#currentIterations = this.#iterations[this.#iterations.length - 1]
    }
  }

  resetIterations(){
    this.#iterations = []
    this.#currentIterations = []
  }

  getSwapState = (index) => this.#currentIterations[index] && this.#currentIterations[index]
  setSwapState = (index, isSwaped) => this.#currentIterations[index] = isSwaped
}