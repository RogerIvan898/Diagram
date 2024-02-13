import {createHTMLElement} from "../helpers.js"

export class Button{
  #element

  constructor(props) {
    const {text, clickEvent, isDisabled, element, styles} = props

    this.#element = element || createHTMLElement('button', styles)
    this.#element.disabled = isDisabled || false
    clickEvent && this.#element.addEventListener('click', clickEvent)

    if(text) {
      this.#element.textContent = text
    }
  }

  get element(){
    return this.#element
  }
}