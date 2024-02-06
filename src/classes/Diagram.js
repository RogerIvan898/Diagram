import {createHTMLElement, disableButtons, addCSSClass, delay, isAscendingOrder, isDescendingOrder} from '../helpers.js'
import {MAX_COLUMN_HEIGHT, ANIMATION_DURATION, swapDirections} from '../constants.js'
import {Button} from './Button.js'
import {ColumnContainer} from './ColumnContainer.js'

export class Diagram {
  #columnContainer
  #forwardSwapButton
  #backwardSwapButton
  #createDiagramButton
  #inputElement

  constructor(){
    this.#columnContainer = new ColumnContainer()

    this.#initButtons()

    console.log(this.#columnContainer)
    console.log(this.#forwardSwapButton)
    this.#inputElement = document.getElementById('diagram-options-input')
  }

  #initButtons(){
    const createColumnButton = document.getElementById('diagram-options-button')
    this.#createDiagramButton = new Button(createColumnButton, () => this.drawColumns())

    const forwardButton = document.getElementById('sort-forward')
    this.#forwardSwapButton = new Button(forwardButton, () => this.swapColumnsFroward())

    const backwardButton = document.getElementById('sort-backward')
    this.#backwardSwapButton = new Button(backwardButton, () => this.swapColumnsBackward())
  }

  drawColumns(){
    this.#columnContainer.clear()
    this.#columnContainer.draw(this.getInputNumbers())

    this.#forwardSwapButton.getElement().disabled = false
  }

  getInputNumbers(){
    const inputText = this.#inputElement.value
    const numbers = inputText.split(' ').filter(number => !isNaN(Number(number)) && number !== '')

    return numbers.map(Number)
  }

  async swapColumnsFroward(){

    this.disableAllButtons(true)
    await this.#columnContainer.forwardSwap()
    this.disableAllButtons(false)
  }

  async swapColumnsBackward() {
    this.disableAllButtons(true)
    await this.#columnContainer.swapBackward()
    this.disableAllButtons(false)
  }

  disableButtons(isDisabled, ...buttons){
    disableButtons(isDisabled, buttons.map(button => button.getElement()))
  }

  disableAllButtons(isDisabled){
    this.disableButtons(isDisabled, this.#createDiagramButton, this.#forwardSwapButton, this.#backwardSwapButton)
  }
}