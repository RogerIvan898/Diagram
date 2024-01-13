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

async function sortColumns(compareFunction){
  let i = 0
  let j = 0

  while (i < columns.length) {
    if (document.visibilityState === 'visible') {
      if (j < columns.length - i - 1) {
        await swapColumns(j, j + 1, compareFunction);
        await new Promise(resolve => requestAnimationFrame(resolve))
        j++
      }
      else {
        j = 0
        i++
      }
    }
  }
}

async function swapColumns(firstColumnIndex, secondColumnIndex, compareFunction) {
  const firstColumn = columns[firstColumnIndex]
  const secondColumn = columns[secondColumnIndex]

  firstColumn.classList.add('column-compare')
  secondColumn.classList.add('column-compare')

  const clearStylePromise = new Promise(resolve => setTimeout(() => {
    firstColumn.classList.remove('column-compare', 'move-left')
    secondColumn.classList.remove('column-compare','move-right')
    resolve()
  }, 1000))

  const compareResult = compareFunction(firstColumn.textContent, secondColumn.textContent)
  if (compareResult > 0) {
    const firstColumnOrder = firstColumn.style.order
    const secondColumnOrder = secondColumn.style.order

    firstColumn.classList.add('move-left')
    secondColumn.classList.add('move-right')

    return Promise.all([clearStylePromise, new Promise(resolve => setTimeout(() => {
    const tmp = columns[firstColumnIndex]
    columns[firstColumnIndex] = columns[secondColumnIndex]
    columns[secondColumnIndex] = tmp

    diagramElement.insertBefore(firstColumn, secondColumn)

    firstColumn.style.order = secondColumnOrder
    secondColumn.style.order = firstColumnOrder
      resolve()
    }, 1000))
    ])
  }
  return clearStylePromise
}

function sortMax(a, b) {
  return a - b
}

function sortMin(a, b){
  return b - a
}