import {disableButtons, createHTMLElement} from '../helpers.js'
import {swapDirections} from '../constants.js'
import {Button} from './Button.js'
import {ColumnContainer} from './ColumnContainer.js'

export class Diagram {
  #element
  #columnContainer
  #buttonStepForward
  #buttonStepBackward
  #buttonCreateDiagram

  constructor(numbers, buttonCreate){
    this.#element = document.createElement('div')
    this.#buttonCreateDiagram = buttonCreate
    this.#columnContainer = new ColumnContainer()
    this.#build()

    this.drawColumnContainer(numbers)
  }

  #initControlButtons(){
    this.#buttonStepForward = new Button({
      text: 'Вперед',
      clickEvent: () => this.processSorting(swapDirections.FORWARD),
    })
    this.#buttonStepBackward = new Button({
      text: 'Назад',
      clickEvent: () => this.processSorting(swapDirections.BACKWARD),
      isDisabled: true,
    })
  }

  #build(){
    const buttonsContainer = createHTMLElement('div', 'diagram-button-container')

    this.#initControlButtons()

    buttonsContainer.appendChild(this.#buttonStepForward.element)
    buttonsContainer.appendChild(this.#buttonStepBackward.element)
    
    this.#element.appendChild(buttonsContainer)
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

    if(direction === swapDirections.FORWARD){
      await this.#columnContainer.stepForward()
      buttonStep = this.#buttonStepForward
    }
    else {
      await this.#columnContainer.stepBackward()
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
    this.disableControlButtons(isDisabled,
      this.#buttonCreateDiagram, this.#buttonStepForward, this.#buttonStepBackward)
  }
}