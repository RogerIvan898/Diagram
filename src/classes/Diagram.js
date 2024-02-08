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
    this.#buttonStepForward = new Button('Вперед', () => this.processSorting(swapDirections.FORWARD))
    this.#buttonStepBackward = new Button('Назад', () => this.processSorting(swapDirections.BACKWARD), true)
    this.#columnContainer = new ColumnContainer(numbers, this.#element)

    this.#build()
  }

  #build(){
    const buttonsContainer = createHTMLElement('div', 'sort-direction')

    buttonsContainer.appendChild(this.#buttonStepForward.element)
    buttonsContainer.appendChild(this.#buttonStepBackward.element)
    
    this.#element.appendChild(buttonsContainer)
    this.#element.appendChild(this.#columnContainer.element)

    document.querySelector('body').appendChild(this.#element)


    if(this.#columnContainer.columnsLength <= 1){
      this.disableButtons(true, this.#buttonStepForward)
    }
  }

  redrawColumnContainer(numbers){
    this.#columnContainer.clear()
    this.#columnContainer.generateColumns(numbers)

    if(this.#columnContainer.columnsLength <= 1){
      this.disableButtons(true, this.#buttonStepForward)
      return
    }

    this.disableAllButtons(false)
    this.disableButtons(true, this.#buttonStepBackward)
  }

  async processSorting(direction){
    let sortResult = null
    let swapButton = null

    this.disableAllButtons(true)

    if(direction === swapDirections.FORWARD){
      sortResult = await this.#columnContainer.stepForward()
      swapButton = this.#buttonStepForward
    }
    else {
      sortResult = await this.#columnContainer.stepBackward()
      swapButton = this.#buttonStepBackward
    }

    this.disableAllButtons(false)

    if(!sortResult){
      this.disableButtons(true, swapButton)
    }
  }

  disableButtons(isDisabled, ...buttons){
    disableButtons(isDisabled, ...buttons.map(button => button.element))
  }

  disableAllButtons(isDisabled){
    this.disableButtons(isDisabled, this.#buttonCreateDiagram, this.#buttonStepForward, this.#buttonStepBackward)
  }
}