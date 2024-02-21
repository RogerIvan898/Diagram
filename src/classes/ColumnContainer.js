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

    await Promise.race([
      promisifyEvent(firstColumn, 'transitionend'),
      promisifyEvent(secondColumn, 'transitionend')
    ])
  }

  async animateColumnSwap(firstColumn, secondColumn){
    toggleCssClass('move-right', firstColumn)
    toggleCssClass('move-left', secondColumn)

    await Promise.race([
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
    let firstIndx = null
    let secondIndx = null
    let iteration = null

    if(stepDirection === swapDirections.FORWARD){
      firstIndx = this.#internalLoopStep
      secondIndx = firstIndx + 1

      iteration = false
    }
    if(stepDirection === swapDirections.BACKWARD){
      iteration = this.#iterations.pop()

      firstIndx = this.#internalLoopStep
      secondIndx = firstIndx - 1
    }

    return [firstIndx, secondIndx, iteration]
  }

  async step(direction){
    this.#isSortingDone = false
    
    this.handleDoneLoopIteration(direction)

    const [firstIndx, secondIndx, isSwapped] = this.getCurrentStepData(direction)

    const { FORWARD, BACKWARD } = swapDirections

    const firstColumn = this.#columns[firstIndx]
    const secondColumn = this.#columns[secondIndx]

    let newSwapState = isSwapped

    if(!firstColumn || !secondColumn){
      return
    }

    const swapColumnsArg = [firstColumn, secondColumn]

    await this.toggleColumnsHighlight(firstColumn.element, secondColumn.element)

    if(direction === FORWARD){
      if(isAscendingOrder(firstColumn.value, secondColumn.value)){
        newSwapState = true
      }
      this.#iterations.push(newSwapState)
    }
    if(direction === BACKWARD && isSwapped){
        swapColumnsArg.reverse()
        newSwapState = false
    }

    this.#internalLoopStep += direction

    if(newSwapState !== isSwapped){
      await this.swapColumns(swapColumnsArg[0].element, swapColumnsArg[1].element)
    }

    await this.toggleColumnsHighlight(secondColumn.element, firstColumn.element, false)

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