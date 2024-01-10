const MAX_COLUMN_HEIGHT = 100

const buttonCreateDiagram = document.getElementById('diagram-options-button')
const buttonSortToMax = document.getElementById('sort-max')
const buttonSortToMin = document.getElementById('sort-min')
const diagramElement = document.getElementById('diagram')

let columns = []
let diagramNumbers = []
let interval

buttonSortToMin.addEventListener('click', () => sortColumns(sortMin))
buttonSortToMax.addEventListener('click', () => sortColumns(sortMax))
buttonCreateDiagram.addEventListener('click', createDiagram)

function getNumbers(){
  const inputText = document.getElementById('diagram-options-input').value
  const numbers = inputText.split(' ').filter(number => !isNaN(Number(number)) && number !== '')

  return numbers.map(number => Number(number))
}

function createDiagram(){
  const numbers = getNumbers()
  if(numbers){
    clearDiagram()
    drawDiagram(numbers)
    diagramNumbers = [...numbers]

    buttonSortToMax.disabled = false
    buttonSortToMin.disabled = false

    clearInterval(interval)
  }
}

function drawDiagram(numbers){
  clearDiagram()
  const maxNumber = Math.max(...numbers)

  numbers.forEach((number, index) => {
    const newColumnElement = createElement('div','diagram-column')

    newColumnElement.style.height = `${(MAX_COLUMN_HEIGHT*number)/maxNumber}%`
    newColumnElement.textContent = number
    newColumnElement.style.order = index

    diagramElement.appendChild(newColumnElement)
  })
  columns = Array.from(document.getElementsByClassName('diagram-column'))
}

function clearDiagram(){
  columns.forEach(column => column.remove())
}

function createElement(tagName, ...classes){
  const element = document.createElement(tagName)
  if(classes.length){
    element.classList.add(...classes)
  }

  return element
}

function sortColumns(compareFunction){
  let i = 0
  let j = 0

  clearInterval(interval)

  interval = setInterval(() => {
    if(i < diagramNumbers.length){
      if(j < diagramNumbers.length - i - 1) {
        const compareResult = compareFunction(diagramNumbers[j], diagramNumbers[j + 1])

        if (compareResult > 0) {
          swapColumns(j, j + 1)

          const tmp = diagramNumbers[j]
          diagramNumbers[j] = diagramNumbers[j + 1]
          diagramNumbers[j + 1] = tmp
        }
        j++
      }
      else {
        j = 0
        i++
      }
    }
    else {
      clearInterval(interval)
    }
  }, 1500)
}

function swapColumns(index, index1){
  const column  = columns[index]
  const column1 = columns[index1]

  const order = getComputedStyle(column).order
  const order1 = getComputedStyle(column1).order

  column1.classList.add('move-right')
  column.classList.add('move-left')

  const tmp = columns[index]
  columns[index] = columns[index1]
  columns[index1] = tmp

  setTimeout(() => {
    diagramElement.insertBefore(column1, column)

    column.style.order = order1
    column1.style.order = order

    column.classList.remove('move-left')
    column1.classList.remove('move-right')
  }, 1000)
}

function sortMax(a, b) {
  return a - b
}

function sortMin(a, b){
  return b - a
}