import {disableButtons, createHTMLElement} from '../helpers.js'
import {swapDirections} from '../constants.js'
import {Button} from './Button.js'
import {ColumnContainer} from './ColumnContainer.js'

export class Diagram {
  #element = null
  #columnContainer = null
  #buttonStepForward = null
  #buttonStepBackward = null

  constructor(numbers){
    this.#element = document.createElement('div')
    this.#columnContainer = new ColumnContainer()

    this.#build()

    this.drawColumnContainer(numbers)
  }

  #initControlButtons(){
    const buttonsContainer = createHTMLElement('div', 'diagram-button-container')

    this.#buttonStepForward = new Button({
      text: 'Вперед',
      clickEvent: () => this.processSorting(swapDirections.FORWARD),
    })

    this.#buttonStepBackward = new Button({
      text: 'Назад',
      clickEvent: () => this.processSorting(swapDirections.BACKWARD),
      isDisabled: true,
    })

    buttonsContainer.appendChild(this.#buttonStepForward.element)
    buttonsContainer.appendChild(this.#buttonStepBackward.element)

    this.#element.appendChild(buttonsContainer)
  }

  #build(){
    this.#initControlButtons()
    this.#element.appendChild(this.#columnContainer.element)

    document.body.appendChild(this.#element)
  }

  drawColumnContainer(numbers){
    this.#columnContainer.generateColumns(numbers)

    if(this.#columnContainer.columnsCount <= 1){
      this.disableControlButtons(true, this.#buttonStepForward)
      return
    }

    this.disableAllButtons(false)
    this.disableControlButtons(true, this.#buttonStepBackward)
  }

  redrawColumnContainer(numbers){
    this.#columnContainer.clear()
    this.drawColumnContainer(numbers)
  }

  async processSorting(direction){
    let buttonStep = null

    this.disableAllButtons(true)

    await this.#columnContainer.step(direction)

    if(direction === swapDirections.FORWARD){
      buttonStep = this.#buttonStepForward
    }
    else {
      buttonStep = this.#buttonStepBackward
    }

    this.disableAllButtons(false)

    if(this.#columnContainer.isSortingDone){
      this.disableControlButtons(true, buttonStep)
    }
  }

  disableControlButtons(isDisabled, ...buttons){
    disableButtons(isDisabled, ...buttons.map(button => button.element))
  }

  disableAllButtons(isDisabled){
    this.disableControlButtons(isDisabled, this.#buttonStepForward, this.#buttonStepBackward)
  }
}