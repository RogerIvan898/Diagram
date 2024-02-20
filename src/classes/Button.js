import {createHTMLElement} from "../helpers.js"

export class Button{
  #element = null

  constructor(props) {
    const {text, clickEvent, isDisabled, styles} = props

    this.#element = createHTMLElement('button', styles)
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