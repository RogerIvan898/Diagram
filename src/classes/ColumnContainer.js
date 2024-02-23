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
    toggleCssClass('column-compare', [firstColumn, secondColumn], force)

    await Promise.all([
      promisifyEvent(firstColumn, 'transitionend'),
      promisifyEvent(secondColumn, 'transitionend')
    ])
  }

  async animateColumnSwap(firstColumn, secondColumn){
    toggleCssClass('move-right', firstColumn)
    toggleCssClass('move-left', secondColumn)

    await Promise.all([
      promisifyEvent(firstColumn, 'animationend'),
      promisifyEvent(secondColumn, 'animationend')
    ])
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
      this.#externalLoopStep--
      this.#internalLoopStep = this.columnsCount - this.#externalLoopStep - 1
    }
  }

  getCurrentStepData(stepDirection){
    let firstIndx = null, secondIndx = null, isSwapped = null

    if(stepDirection === swapDirections.FORWARD){
      firstIndx = this.#internalLoopStep
      secondIndx = firstIndx + 1

      isSwapped = false
    }
    else if(stepDirection === swapDirections.BACKWARD){
      isSwapped = this.#iterations.pop()

      firstIndx = this.#internalLoopStep
      secondIndx = firstIndx - 1
    }

    return [this.#columns[firstIndx], this.#columns[secondIndx], isSwapped]
  }

  async handleSwap(direction, firstColumn, secondColumn){
    const swapColumnsArgs = direction === swapDirections.FORWARD ?
      [firstColumn, secondColumn] : [secondColumn, firstColumn]

    await this.swapColumns(swapColumnsArgs[0].element, swapColumnsArgs[1].element)
  }

  handleSortingFinish(){
    if(!this.#iterations.length || this.#externalLoopStep + 1 === this.columnsCount - 1 &&
      this.#internalLoopStep === this.columnsCount - this.#externalLoopStep - 1
    ) {
      this.#isSortingDone = true
    }
  }

  async step(direction){
    this.#isSortingDone = false

    this.handleDoneLoopIteration(direction)

    let [firstColumn, secondColumn, isSwapped] = this.getCurrentStepData(direction)

    if(!firstColumn || !secondColumn || isSwapped === undefined){
      return
    }

    const { FORWARD, BACKWARD } = swapDirections

    const shouldSwap = direction === FORWARD ?
      isAscendingOrder(firstColumn.value, secondColumn.value) : direction === BACKWARD && isSwapped

    await this.toggleColumnsHighlight(firstColumn.element, secondColumn.element)

    if(shouldSwap){
      await this.handleSwap(direction, firstColumn, secondColumn)
      isSwapped = true
    }

    if([firstColumn, secondColumn].some(column => column.element.classList.contains('column-compare'))){
      await this.toggleColumnsHighlight(secondColumn.element, firstColumn.element)
    }

    if(direction === FORWARD){
      this.#iterations.push(isSwapped)
    }

    this.#internalLoopStep += direction
    this.handleSortingFinish()
  }

  getColumnIndexByElement(columnElement){
    return this.#columns.indexOf(this.#columns.find(column => column.element.isEqualNode(columnElement)))
  }
}