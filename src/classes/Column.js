import {createHTMLElement} from '../helpers.js'

export class Column {
  #element
  #value

  constructor(value, diagramOrder) {
    this.#element = createHTMLElement('div', 'diagram-column')
    this.#value = Number(value)

    this.#element.textContent = value
  }

  setHeight = (height) => this.#element.style.height = height
  getHeight = () => this.#element.style.height

  setElement = (element) => this.#element = element
  getElement = () => this.#element

  setValue = (value) => this.#value = value
  getValue = () => this.#value

  remove(){
    this.#element.remove()
  }

  highlight(){
    this.#element.classList.add('column-compare')
  }

  removeHighlight(){
    this.#element.classList.remove('column-compare')
  }

  addStyle(className){
    this.#element.classList.add(className)
  }

  removeStyle(className){
    this.#element.classList.remove(className)
  }
}
