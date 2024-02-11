import {Column} from './Column.js'
import {MAX_COLUMN_HEIGHT, ANIMATION_DURATION} from '../constants.js'
import {delay, isAscendingOrder, createHTMLElement, toggleCssClass} from '../helpers.js'

export class ColumnContainer{
  #columns
  #element
  #iterations
  #externalLoopStep
  #internalLoopStep
  #isSortingDone

  constructor(numbers) {
    this.#element = createHTMLElement('div', 'diagram')
    this.#columns = []
    this.#iterations = []
    this.#externalLoopStep = 0
    this.#internalLoopStep = 0
    this.#isSortingDone = false

    numbers && this.generateColumns(numbers)
  }

  get element(){
    return this.#element
  }

  get columnsCount(){
    return this.#columns.length
  }

  get isSortingDone(){
    return this.#isSortingDone
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

    this.#internalLoopStep = 0
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

  async toggleColumnsHighlight(firstColumn, secondColumn, isHighlight){
    toggleCssClass('column-compare', [firstColumn.element, secondColumn.element],
      isHighlight)
    await delay(ANIMATION_DURATION)
  }

  async animateColumnSwap(firstColumn, secondColumn){
    toggleCssClass('move-right', firstColumn.element, true)
    toggleCssClass('move-left', secondColumn.element, true)

    await delay(ANIMATION_DURATION)

    toggleCssClass('move-right', firstColumn.element, false)
    toggleCssClass('move-left', secondColumn.element, false)
  }

  async swapColumns(firstColumn, secondColumn){
    const firstColumnElement = firstColumn.element
    const secondColumnElement = secondColumn.element

    const firstColumnIndex = this.getColumnIndex(firstColumn)
    const secondColumnIndex = this.getColumnIndex(secondColumn)

    await this.animateColumnSwap(firstColumn, secondColumn)

    secondColumnElement.after(firstColumnElement)

    const tmpOrder = getComputedStyle(firstColumnElement).order
    firstColumnElement.style.order = getComputedStyle(secondColumnElement).order
    secondColumnElement.style.order = tmpOrder

    const tmp = this.#columns[firstColumnIndex]
    this.#columns[firstColumnIndex] = this.#columns[secondColumnIndex]
    this.#columns[secondColumnIndex] = tmp
  }

  async stepForward() {
    this.#isSortingDone = false

    if(this.#internalLoopStep === this.#columns.length - this.#externalLoopStep - 1){
      this.#internalLoopStep = 0
      this.#externalLoopStep++
    }

    const iteration = {isSwapped: false, index: this.#internalLoopStep + 1}
    const firstColumn = this.#columns[this.#internalLoopStep]
    const secondColumn = this.#columns[this.#internalLoopStep + 1]

    await this.toggleColumnsHighlight(firstColumn, secondColumn, true)

    if (isAscendingOrder(firstColumn.value, secondColumn.value)) {
      await this.swapColumns(firstColumn, secondColumn)
      iteration.isSwapped = true
    }
    this.#iterations.push(iteration)

    await this.toggleColumnsHighlight(firstColumn, secondColumn, false)

    this.#internalLoopStep++

    if(this.#externalLoopStep + 1 === this.#columns.length - 1 &&
      this.#internalLoopStep === this.#columns.length - this.#externalLoopStep - 1){
      this.#isSortingDone = true
    }
  }

  async stepBackward() {
    this.#isSortingDone = false

    const iteration = this.#iterations.pop()

    if(this.#internalLoopStep === 0){
      this.#internalLoopStep = this.#columns.length - 1
      this.#externalLoopStep--
    }

    const firstColumn = this.#columns[iteration.index]
    const secondColumn = this.#columns[iteration.index - 1]

    await this.toggleColumnsHighlight(firstColumn, secondColumn, true)

    if (iteration.isSwapped) {
      await this.swapColumns(secondColumn, firstColumn)
    }

    await this.toggleColumnsHighlight(firstColumn, secondColumn, false)
    this.#internalLoopStep = iteration.index - 1

    if(!this.#iterations.length){
      this.#isSortingDone = true
    }
  }

  getColumnIndex(columnElement){
    return this.#columns.indexOf(columnElement)
  }
}