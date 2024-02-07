import {disableButtons} from '../helpers.js'
import {swapDirections} from '../constants.js'
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

    this.#inputElement = document.getElementById('diagram-options-input')

    this.#initButtons()
  }

  #initButtons(){
    const createColumnButton = document.getElementById('diagram-options-button')
    this.#createDiagramButton = new Button(createColumnButton, () => this.drawColumns())

    const forwardButton = document.getElementById('sort-forward')
    this.#forwardSwapButton = new Button(forwardButton, () => this.swapColumns(swapDirections.FORWARD))

    const backwardButton = document.getElementById('sort-backward')
    this.#backwardSwapButton = new Button(backwardButton, () => this.swapColumns(swapDirections.BACKWARD))
  }

  drawColumns(){
    this.#columnContainer.clear()

    this.#columnContainer.draw(this.getInputNumbers())

    this.#backwardSwapButton.getElement().disabled = true
    this.#forwardSwapButton.getElement().disabled = false
  }

  getInputNumbers(){
    const inputText = this.#inputElement.value
    const numbers = inputText.split(' ').filter(number => !isNaN(Number(number)) && number !== '')

    return numbers.map(Number)
  }

  async swapColumns(direction){
    let sortResult = null
    let swapButton = null

    this.disableAllButtons(true)

    if(direction === swapDirections.FORWARD){
      sortResult = await this.#columnContainer.swapForward()
      swapButton = this.#forwardSwapButton
    }
    else {
      sortResult = await this.#columnContainer.swapBackward()
      swapButton = this.#backwardSwapButton
    }

    this.disableAllButtons(false)

    if(sortResult){
      this.disableButtons(true, swapButton)
    }
  }

  disableButtons(isDisabled, ...buttons){
    disableButtons(isDisabled, ...buttons.map(button => button.getElement()))
  }

  disableAllButtons(isDisabled){
    this.disableButtons(isDisabled, this.#createDiagramButton, this.#forwardSwapButton, this.#backwardSwapButton)
  }
}