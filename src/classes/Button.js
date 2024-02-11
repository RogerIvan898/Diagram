export class Button{
  #element

  constructor(props) {
    const {text, clickEvent, isDisabled, element} = props

    this.#element = element || document.createElement('button')
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