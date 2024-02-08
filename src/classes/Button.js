export class Button{
  #element

  constructor(buttonText, clickEvent, isDisabled = false) {
    this.#element = document.createElement('button')

    this.#element.textContent = buttonText
    this.#element.addEventListener('click', clickEvent)
    this.#element.disabled = isDisabled
  }

  get element(){
    return this.#element
  }
}