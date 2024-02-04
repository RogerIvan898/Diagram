export class Column {
  element
  value
  originOrder
  currentOrder

  constructor(element, diagramOrder) {
    this.element = element
    this.value = +element.textContent
    this.originOrder = +diagramOrder
    this.currentOrder = this.originOrder
  }
}