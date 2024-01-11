const MAX_COLUMN_HEIGHT = 100

const buttonCreateDiagram = document.getElementById('diagram-options-button')
const buttonSortToMax = document.getElementById('sort-max')
const buttonSortToMin = document.getElementById('sort-min')
const diagramElement = document.getElementById('diagram')

let columns = []
let diagramNumbers = []
let interval = null

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
    clearInterval(interval)
    clearDiagram()
    drawDiagram(numbers)

    diagramNumbers = [...numbers]

    buttonSortToMax.disabled = false
    buttonSortToMin.disabled = false
  }
}

function drawDiagram(numbers){
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

  interval = setInterval(async () => {
    if(i < columns.length){
      if(j < columns.length - i - 1) {
        const compareResult = compareFunction(columns[j].textContent, columns[j + 1].textContent)
        const firstColumn = columns[j]
        const secondColumn = columns[j + 1]

        firstColumn.classList.add('column-compare')
        secondColumn.classList.add('column-compare')

        if (compareResult > 0) {
          await swapColumns(j, j + 1)
        }
        await setTimeout(() => {
          firstColumn.classList.remove('column-compare')
          secondColumn.classList.remove('column-compare')
        }, 1000)

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

async function swapColumns(firstColumnIndex, secondColumnIndex){
  const firstColumn  = columns[firstColumnIndex]
  const secondColumn = columns[secondColumnIndex]

  const firstColumnOrder = firstColumn.style.order
  const secondColumnOrder = secondColumn.style.order

  secondColumn.classList.add('move-right')
  firstColumn.classList.add('move-left')

  const tmp = columns[firstColumnIndex]
  columns[firstColumnIndex] = columns[secondColumnIndex]
  columns[secondColumnIndex] = tmp

  await setTimeout(() => {
    if(columns[firstColumnIndex] && columns[secondColumnIndex]) {
      diagramElement.insertBefore(columns[secondColumnIndex], columns[firstColumnIndex])

      firstColumn.style.order = secondColumnOrder
      secondColumn.style.order = firstColumnOrder

      firstColumn.classList.remove('move-left')
      secondColumn.classList.remove('move-right')
    }
  }, 1000)
}

function sortMax(a, b) {
  return a - b
}

function sortMin(a, b){
  return b - a
}