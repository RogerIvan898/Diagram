import {createHTMLElement} from '../helpers.js'

export class Column {
  #element = null

  constructor(value, height) {
    this.#element = createHTMLElement('div', 'diagram-column')
    this.#element.style.height = height

    this.#element.textContent = Number(value)
  }

  get element(){
    return this.#element
  }

  get value(){
    return this.#element.textContent
  }

  remove(){
    this.#element.remove()
  }
}