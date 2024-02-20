import {Column} from './Column.js'
import {MAX_COLUMN_HEIGHT, swapDirections} from '../constants.js'
import {isAscendingOrder, createHTMLElement, toggleCssClass, promisifyEvent} from '../helpers.js'

export class ColumnContainer{
  #columns = []
  #element = null
  #iterations = []
  #externalLoopStep = 0
  #internalLoopStep = 0
  #isSortingDone = false

  constructor(numbers) {
    this.#element = createHTMLElement('div', 'diagram')

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

  async toggleColumnsHighlight(firstColumn, secondColumn, force){
    toggleCssClass('column-compare',
      [firstColumn, secondColumn], force)

    await promisifyEvent(secondColumn, 'transitionend')
  }

  async animateColumnSwap(firstColumn, secondColumn){
    toggleCssClass('move-right', firstColumn)
    toggleCssClass('move-left', secondColumn)

    await promisifyEvent(firstColumn, 'animationend')
  }

  async swapColumns(firstColumnElement, secondColumnElement){
    const firstColumnIndex = this.getColumnIndexByElement(firstColumnElement)
    const secondColumnIndex = this.getColumnIndexByElement(secondColumnElement)

    await this.animateColumnSwap(firstColumnElement, secondColumnElement)
    await this.toggleColumnsHighlight(firstColumnElement, secondColumnElement)

    toggleCssClass('move-right', firstColumnElement)
    toggleCssClass('move-left', secondColumnElement)

    secondColumnElement.after(firstColumnElement)

    const tmp = this.#columns[firstColumnIndex]
    this.#columns[firstColumnIndex] = this.#columns[secondColumnIndex]
    this.#columns[secondColumnIndex] = tmp
  }

  handleDoneLoopIteration(stepDirection){
    if(stepDirection === swapDirections.FORWARD &&
      this.#internalLoopStep === this.columnsCount - this.#externalLoopStep - 1
    ) {
      this.#internalLoopStep = 0
      this.#externalLoopStep++
    }
    if(stepDirection === swapDirections.BACKWARD && this.#internalLoopStep === 0){
      this.#internalLoopStep = this.columnsCount - 1
      this.#externalLoopStep--
    }
  }

  async step(direction){
    this.#isSortingDone = false

    const { FORWARD, BACKWARD } = swapDirections

    let iteration = null
    let firstColumn = null
    let secondColumn = null

    this.handleDoneLoopIteration(direction)

    if(direction === FORWARD) {
      iteration = {isSwapped: false, index: this.#internalLoopStep + 1}

      firstColumn = this.#columns[this.#internalLoopStep]
      secondColumn = this.#columns[this.#internalLoopStep + 1]
    }
    if(direction === BACKWARD){
      iteration = this.#iterations.pop()

      firstColumn = this.#columns[iteration.index]
      secondColumn = this.#columns[iteration.index - 1]
    }

    if(!firstColumn || !secondColumn || !iteration){
      return
    }

    await this.toggleColumnsHighlight(firstColumn.element, secondColumn.element)

    if(direction === FORWARD){
      if(isAscendingOrder(firstColumn.value, secondColumn.value)) {
        await this.swapColumns(firstColumn.element, secondColumn.element)
        iteration.isSwapped = true
      }
      this.#iterations.push(iteration)
      this.#internalLoopStep++
    }
    if(direction === BACKWARD){
      iteration.isSwapped && await this.swapColumns(secondColumn.element, firstColumn.element)
      this.#internalLoopStep = iteration.index - 1
    }

    if(firstColumn.element.classList.contains('column-compare') &&
      secondColumn.element.classList.contains('column-compare')
    ) {
      await this.toggleColumnsHighlight(firstColumn.element, secondColumn.element, false)
    }

    if(!this.#iterations.length ||
      this.#externalLoopStep + 1 === this.columnsCount - 1 &&
      this.#internalLoopStep === this.columnsCount - this.#externalLoopStep - 1
    ) {
      this.#isSortingDone = true
    }
  }

  getColumnIndexByElement(columnElement){
    return this.#columns.indexOf(this.#columns.find(column => column.element.isEqualNode(columnElement)))
  }
}