import {createHTMLElement} from '../helpers.js'

export class Column {
  #element

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

  highlight(){
    this.addStyle('column-compare')
  }

  removeHighlight(){
    this.removeStyle('column-compare')
  }

  addStyle(className){
    this.#element.classList.add(className)
  }

  removeStyle(className){
    this.#element.classList.remove(className)
  }
}