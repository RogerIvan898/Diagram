import {Column} from './Column.js'
import {createHTMLElement, removeCSSClass, addCSSClass, delay, isAscendingOrder} from '../helpers.js'
import {MAX_COLUMN_HEIGHT, ANIMATION_DURATION} from '../constants.js'
import {disableAllDiagramControlButtons, disableBackwardSwapButton, disableForwardSwapButton} from '../../App.js'

export class Diagram {
  columns
  element
  currentColumn

  constructor(){
    this.columns = []
    this.element = document.getElementById('diagram')
    this.currentColumnIndex = null
  }

  clear(){
    if(!this.columns.length) {
      return
    }

    this.currentColumn = null
    this.columns.forEach(column => column.element.remove())
    this.columns = []
    disableAllDiagramControlButtons(true)
  }

  draw(numbers){
    const maxNumber = Math.max(...numbers)

    numbers.forEach((number, order) => {
      const columnElement = createHTMLElement('div', 'diagram-column')

      columnElement.style.height = `${ (MAX_COLUMN_HEIGHT * number) / maxNumber }%`
      columnElement.textContent = number

      this.element.appendChild(columnElement)
      this.columns.push(new Column(columnElement, order))
    })

    this.currentColumn = this.columns[0]
  }

  async swapColumns(firstColumn, secondColumn){
    const firstColumnElement = firstColumn.element
    const secondColumnElement = secondColumn.element

    const firstColumnIndex = this.columns.indexOf(firstColumn)
    const secondColumnIndex = this.columns.indexOf(secondColumn)

    await this.animateColumnSwap(firstColumn, secondColumn)

    secondColumnElement.after(firstColumnElement)
    firstColumnElement.before(secondColumnElement)

    const tmp = this.columns[firstColumnIndex]
    this.columns[firstColumnIndex] = this.columns[secondColumnIndex]
    this.columns[secondColumnIndex] = tmp

    const tmpOrder = firstColumn.currentOrder
    firstColumn.currentOrder = secondColumn.currentOrder
    secondColumn.currentOrder = tmpOrder
  }

  async animateColumnSwap(firstColumn, secondColumn){
    const firstColumnElement = firstColumn.element
    const secondColumnElement = secondColumn.element

    addCSSClass('move-right', firstColumnElement)
    addCSSClass('move-left', secondColumnElement)

    await delay(ANIMATION_DURATION)

    removeCSSClass('move-right', firstColumnElement)
    removeCSSClass('move-left', secondColumnElement)
  }

  async highliteColumns(firstColumn, secondColumn, timeout = ANIMATION_DURATION){
    addCSSClass('column-compare', firstColumn.element, secondColumn.element)
    await delay(timeout)
  }

  removeColumnsHighlite(firstColumn, secondColumn){
    removeCSSClass('column-compare', firstColumn.element, secondColumn.element)
  }

  async forwardSwap(){
    const firstColumn = this.currentColumn

    const currentColumnIndex = this.columns.indexOf(this.currentColumn)
    let secondColumn = this.columns[currentColumnIndex + 1]

    disableAllDiagramControlButtons(true)

    await this.highliteColumns(firstColumn, secondColumn)

    if(isAscendingOrder(firstColumn.value, secondColumn.value)){
      await this.swapColumns(firstColumn, secondColumn)
    }
    else {
      this.currentColumn = secondColumn
    }

    this.removeColumnsHighlite(firstColumn, secondColumn)
    disableAllDiagramControlButtons(false)

    if(this.columns.indexOf(this.currentColumn) === this.columns.length - 1){
      disableForwardSwapButton(true)
    }
  }

  async backwardSwap(){
    const firstColumn = this.currentColumn
    const currentColumnIndex = this.columns.indexOf(this.currentColumn)

    let secondColumn = null

    if(currentColumnIndex !== 0){
      secondColumn = this.columns[currentColumnIndex - 1]
    }
    disableAllDiagramControlButtons(true)

    await this.highliteColumns(firstColumn, secondColumn)

    if (firstColumn.currentOrder !== firstColumn.originOrder) {
      await this.swapColumns(secondColumn, firstColumn)
    }
    else {
      this.currentColumn = secondColumn
    }

    this.removeColumnsHighlite(firstColumn, secondColumn)
    disableAllDiagramControlButtons(false)

    if(this.columns.indexOf(this.currentColumn) === 0){
      disableBackwardSwapButton(true)
    }
  }
}