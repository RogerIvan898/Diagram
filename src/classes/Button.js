export class Button{
  #element
  #clickEvent

  constructor(buttonElement, clickEvent) {
    this.#element = buttonElement
    this.#clickEvent = clickEvent

    this.#element.addEventListener('click', this.#clickEvent)
  }

  setElement = (HTMLElement) => this.#element = HTMLElement
  getElement = () => this.#element

  setClickEvent = (event) => this.#clickEvent = event
  getClickEvent = () => this.#clickEvent
}