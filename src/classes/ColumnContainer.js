import {Column} from './Column.js'
import {swapDirections, MAX_COLUMN_HEIGHT, ANIMATION_DURATION} from '../constants.js'
import {delay, isAscendingOrder, createHTMLElement} from '../helpers.js'

export class ColumnContainer{
  #columns
  #element
  #iterations
  #externalLoopStep
  #iternalLoopStep

  constructor(numbers) {
    this.#element = createHTMLElement('div', 'diagram')
    this.#columns = []
    this.#iterations = []
    this.#externalLoopStep = 0
    this.#iternalLoopStep = 0

    this.generateColumns(numbers)
  }

  get element(){
    return this.#element
  }

  get columnsLength(){
    return this.#columns.length
  }

  addColumn(column){
    this.#columns.push(column)
    this.#element.appendChild(column.element)
  }

  clear(){
    if(!this.#columns.length){
      return
    }

    this.#columns.forEach(column => column.remove())
    this.#columns = []
    this.#iterations = []

    this.#iternalLoopStep = 0
    this.#externalLoopStep = 0
  }

  generateColumns(numbers){
    const maxNumber = Math.max(...numbers)

    numbers.forEach((number) => {
      const columnHeight = `${ (MAX_COLUMN_HEIGHT * number) / maxNumber }%`
      const column = new Column(number, columnHeight)

      this.addColumn(column)
    })
  }

  async highlightColumns(firstColumn, secondColumn){
    firstColumn.highlight()
    secondColumn.highlight()

    await delay(ANIMATION_DURATION)
  }

  removeColumnsHighlight(firstColumn, secondColumn){
    firstColumn.removeHighlight()
    secondColumn.removeHighlight()
  }

  async animateColumnSwap(firstColumn, secondColumn){
    firstColumn.addStyle('move-right')
    secondColumn.addStyle('move-left')

    await delay(ANIMATION_DURATION)

    firstColumn.removeStyle('move-right')
    secondColumn.removeStyle('move-left')
  }

  async swapColumns(firstColumn, secondColumn){
    const firstColumnElement = firstColumn.element
    const secondColumnElement = secondColumn.element

    const firstColumnIndex = this.getColumnIndex(firstColumn)
    const secondColumnIndex = this.getColumnIndex(secondColumn)

    await this.animateColumnSwap(firstColumn, secondColumn)

    secondColumnElement.after(firstColumnElement)
    firstColumnElement.before(secondColumnElement)

    const tmp = this.#columns[firstColumnIndex]
    this.#columns[firstColumnIndex] = this.#columns[secondColumnIndex]
    this.#columns[secondColumnIndex] = tmp
  }

  async stepForward() {
    if(this.#iternalLoopStep === this.#columns.length - this.#externalLoopStep - 1){
      this.#iternalLoopStep = 0
      this.#externalLoopStep++
    }

    const iteration = {isSwaped: false, index: this.#iternalLoopStep + 1}
    const firstColumn = this.#columns[this.#iternalLoopStep]
    const secondColumn = this.#columns[this.#iternalLoopStep + 1]
    const length = this.#columns.length

    await this.highlightColumns(firstColumn, secondColumn)

    if (isAscendingOrder(firstColumn.value, secondColumn.value)) {
      await this.swapColumns(firstColumn, secondColumn)
      iteration.isSwaped = true
    }
    this.#iterations.push(iteration)

    this.removeColumnsHighlight(firstColumn, secondColumn)

    this.#iternalLoopStep++

    if(this.#externalLoopStep + 1 === this.#columns.length - 1 &&
      this.#iternalLoopStep === this.#columns.length - this.#externalLoopStep - 1){
      return false
    }

    return true
  }

  async stepBackward() {
    const iteration = this.#iterations.pop()

    if(this.#iternalLoopStep === 0){
      this.#iternalLoopStep = this.#columns.length - 1
      this.#externalLoopStep--
    }

    const firstColumn = this.#columns[iteration.index]
    const secondColumn = this.#columns[iteration.index - 1]

    await this.highlightColumns(firstColumn, secondColumn)

    if (iteration.isSwaped) {
      await this.swapColumns(secondColumn, firstColumn)
    }

    this.removeColumnsHighlight(firstColumn, secondColumn)
    this.#iternalLoopStep = iteration.index

    if(!this.#iterations.length){
      return false
    }

    return true
  }

  getColumnIndex(columnElement){
    return this.#columns.indexOf(columnElement)
  }
}