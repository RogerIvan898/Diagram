import {Column} from './Column.js'
import {SwapController} from './SwapController.js'
import {MAX_COLUMN_HEIGHT, ANIMATION_DURATION} from '../constants.js'
import {delay, isAscendingOrder} from '../helpers.js'

export class ColumnContainer{
  #columns
  #element
  #currentColumn
  #currentIteration
  #swapController

  constructor() {
    this.#columns = []
    this.#currentColumn = null
    this.#element = document.getElementById('diagram')
    this.#currentIteration = 0
    this.#swapController = new SwapController()
  }


  addColumn(column){
    this.#columns.push(column)
    this.#element.appendChild(column.getElement())
  }

  clear(){
    if(!this.#columns.length){
      return
    }

    this.#columns.forEach(column => column.remove())
    this.#columns = []
  }

  draw(numbers){
    const maxNumber = Math.max(...numbers)

    numbers.forEach((number, order) => {
      const column = new Column(number, order)
      column.setHeight(`${ (MAX_COLUMN_HEIGHT * number) / maxNumber }%`)

      this.addColumn(column)
    })
    this.#currentColumn = this.#columns[0]
    this.#swapController.addIteration(this.#columns)
    console.log(this.#columns)
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
    const firstColumnElement = firstColumn.getElement()
    const secondColumnElement = secondColumn.getElement()

    const firstColumnIndex = this.getColumnIndex(firstColumn)
    const secondColumnIndex = this.getColumnIndex(secondColumn)

    await this.animateColumnSwap(firstColumn, secondColumn)

    secondColumnElement.after(firstColumnElement)
    firstColumnElement.before(secondColumnElement)

    const tmp = this.#columns[firstColumnIndex]
    this.#columns[firstColumnIndex] = this.#columns[secondColumnIndex]
    this.#columns[secondColumnIndex] = tmp

    const tmpOrder = firstColumn.currentOrder
    firstColumn.currentOrder = secondColumn.currentOrder
    secondColumn.currentOrder = tmpOrder

    this.#swapController.setSwapState(firstColumnIndex, true)
    this.#swapController.setSwapState(secondColumnIndex, true)
  }

  async forwardSwap(){
    if(this.getColumnIndex(this.#currentColumn) === this.#columns.length - 1){
      this.#currentColumn = this.#columns[0]
      this.#currentIteration++
      this.#swapController.addIteration(this.#columns)
    }

    const currentColumnIndex = this.getColumnIndex(this.#currentColumn)
    const firstColumn = this.#currentColumn
    const secondColumn = this.#columns[currentColumnIndex + 1]

    await this.highlightColumns(firstColumn, secondColumn)

    if(isAscendingOrder(firstColumn.getValue(), secondColumn.getValue())){
      await this.swapColumns(firstColumn, secondColumn)
    }
    else {
      this.#currentColumn = secondColumn
    }

    this.removeColumnsHighlight(firstColumn, secondColumn)
  }

  async swapBackward() {
    const currentColumnIndex = this.getColumnIndex(this.#currentColumn)
    const firstColumn = this.#currentColumn
    const secondColumn = this.#columns[currentColumnIndex - 1]

    await this.highlightColumns(firstColumn, secondColumn)

    if (this.#swapController.getSwapState(currentColumnIndex)) {
      await this.swapColumns(secondColumn, firstColumn)

      this.#swapController.setSwapState(currentColumnIndex, false)
      this.#swapController.setSwapState(currentColumnIndex - 1, false)
    }
    else {
      this.#currentColumn = secondColumn
    }

    this.removeColumnsHighlight(firstColumn, secondColumn)

    if (this.getColumnIndex(this.#currentColumn) === 0) {
      if (this.#currentIteration === 0) {
        return
      }
      this.#currentColumn = this.#columns[this.#columns.length - 1]
      this.#currentIteration--
      this.#swapController.removeCurrentIteration()
    }
  }

  getColumnByIndex(index){
    return this.#columns[index]
  }

  getColumnIndex(columnElement){
    return this.#columns.indexOf(columnElement)
  }
}