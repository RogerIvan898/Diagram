const MAX_COLUMN_HEIGHT = 100

const buttonCreateDiagram = document.getElementById('diagram-options-button')
const buttonSortToMax = document.getElementById('sort-max')
const buttonSortToMin = document.getElementById('sort-min')
const diagramElement = document.getElementById('diagram')

let columns = []

buttonSortToMin.addEventListener('click', () => sortColumns(sortMin))
buttonSortToMax.addEventListener('click', () => sortColumns(sortMax))
buttonCreateDiagram.addEventListener('click', createDiagram)

function getNumbers(){
  const inputText = document.getElementById('diagram-options-input').value
  const numbers = inputText.split(' ').filter(number => !isNaN(Number(number)) && number !== '')

  return numbers.map(number => Number(number))
}

async function createDiagram(){
  const numbers = getNumbers()
  if(numbers.length){
    clearDiagram()
    drawDiagram(numbers)
    buttonSortToMax.disabled = false
    buttonSortToMin.disabled = false
  }
}

function drawDiagram(numbers){
  const maxNumber = Math.max(...numbers)
  columns = []

  numbers.forEach((number, index) => {
    const newColumnElement = createElement('div','diagram-column')

    newColumnElement.style.height = `${(MAX_COLUMN_HEIGHT*number)/maxNumber}%`
    newColumnElement.textContent = number
    newColumnElement.style.order = index

    diagramElement.appendChild(newColumnElement)
    columns.push(newColumnElement)
  })
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

async function sortColumns(compareFunction){
  buttonSortToMin.disabled = true
  buttonSortToMax.disabled = true
  buttonCreateDiagram.disabled = true

  for (let i = 0; i < columns.length; i++) {
    for (let j = 0; j < columns.length - i - 1; j++) {
      const compareResult = compareFunction(columns[j].textContent, columns[j + 1].textContent)
      await animateComparison(j, j + 1)
      if (compareResult > 0) {
        await animateSwap(j, j + 1)
        swapColumns(j, j + 1)
      }
    }
  }

  buttonSortToMin.disabled = false

  buttonSortToMax.disabled = false

  buttonSortToMax.disabled = false
  buttonCreateDiagram.disabled = false
}

function swapColumns(firstColumnIndex, secondColumnIndex) {
  const firstColumn = columns[firstColumnIndex]
  const secondColumn = columns[secondColumnIndex]

  const tmpOrder = firstColumn.style.order
  firstColumn.style.order = secondColumn.style.order
  secondColumn.style.order = tmpOrder

  diagramElement.insertBefore(firstColumn, secondColumn)
  diagramElement.insertBefore(secondColumn, firstColumn)

  const tmp = columns[firstColumnIndex]
  columns[firstColumnIndex] = columns[secondColumnIndex]
  columns[secondColumnIndex] = tmp
}

async function animateComparison(firstColumnIndex, secondColumnIndex){
  const firstColumn = columns[firstColumnIndex]
  const secondColumn = columns[secondColumnIndex]

  firstColumn.classList.add('column-compare')
  secondColumn.classList.add('column-compare')

  await delay(800)
  firstColumn.classList.remove('column-compare')
  secondColumn.classList.remove('column-compare')
}

async function animateSwap(firstColumnIndex, secondColumnIndex){
  const firstColumn = columns[firstColumnIndex]
  const secondColumn = columns[secondColumnIndex]

  firstColumn.classList.add('move-right')
  secondColumn.classList.add('move-left')

  await delay(800)
  firstColumn.classList.remove('move-right')
  secondColumn.classList.remove('move-left')
}

function delay(timeout){
   return new Promise(resolve => setTimeout(resolve, timeout))
}

function sortMax(a, b) {
  return a - b
}

function sortMin(a, b){
  return b - a
}