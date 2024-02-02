const MAX_COLUMN_HEIGHT = 100
const ANIMATION_DURATION = 800

const buttonCreateDiagram = document.getElementById('diagram-options-button')
const buttonSortToMax = document.getElementById('sort-max')
const buttonSortToMin = document.getElementById('sort-min')
const diagramElement = document.getElementById('diagram')

let columns = []
let currentColumn = null
let currentIteration = null

buttonSortToMin.addEventListener('click', () => processIteration('forward'))
buttonSortToMax.addEventListener('click', () => processIteration('back'))
buttonCreateDiagram.addEventListener('click', createDiagram)

function getNumbers(){
  const inputText = document.getElementById('diagram-options-input').value
  const numbers = inputText.split(' ').filter(number => !isNaN(Number(number)) && number !== '')

  return numbers.map(Number)
}

async function createDiagram(){
  const numbers = getNumbers()
  if(numbers.length){
    clearDiagram()
    drawDiagram(numbers)
    currentColumn = columns[0]
    setButtonsDisable(false, buttonSortToMin, buttonSortToMax)
  }
}

function drawDiagram(numbers){
  const maxNumber = Math.max(...numbers)
  numbers.forEach(number => {
    const newColumnElement = createElement('div', 'diagram-column')

    newColumnElement.style.height = `${(MAX_COLUMN_HEIGHT * number) / maxNumber}%`
    newColumnElement.textContent = number

    diagramElement.appendChild(newColumnElement)
    columns.push(newColumnElement)
  })
}

function clearDiagram(){
  columns.forEach(column => column.remove())
  columns = []
}

function createElement(tagName, ...classes){
  const element = document.createElement(tagName)
  if(classes.length){
    element.classList.add(...classes)
  }

  return element
}

async function processIteration(direction = 'forward'){
  if(currentIteration){
    return
  }
  const currentColumnIndex = columns.indexOf(currentColumn)

  let firstColumn = null
  let secondColumn = null
  let compareFunction = sortMax

  if(currentColumnIndex === columns.length - 1){
    firstColumn = columns[currentColumnIndex - 1]
    secondColumn = columns[currentColumnIndex]
  }
  else {
    firstColumn = columns[currentColumnIndex]
    secondColumn = columns[currentColumnIndex + 1]
  }

  if(direction === 'back'){
    compareFunction = sortMin
    if(currentColumnIndex !== 0) {
      firstColumn = columns[currentColumnIndex - 1]
      secondColumn = columns[currentColumnIndex]
    }
  }

  await animateIteration(firstColumn, secondColumn, compareFunction)
}

async function animateIteration(firstColumn, secondColumn, compareFunction){
  currentIteration = animateColumnsHighlite
  await currentIteration(firstColumn, secondColumn)
  currentIteration = null

  const compareResult = compareFunction(+firstColumn.textContent, +secondColumn.textContent)
  if(compareResult > 0){
    currentIteration = animateColumnsSwap
    await animateColumnsSwap(firstColumn, secondColumn)
    currentIteration = null

    swapColumns(firstColumn, secondColumn)
  }
  else {
    currentColumn = secondColumn
  }

  removeStyle('column-compare', firstColumn, secondColumn)
}

async function animateColumnsHighlite(firstColumn, secondColumn) {
  addStyle('column-compare', firstColumn, secondColumn)
  await delay(ANIMATION_DURATION)
}

async function animateColumnsSwap(firstColumn, secondColumn){
  addStyle('move-right', firstColumn)
  addStyle('move-left', secondColumn)

  await delay(ANIMATION_DURATION)

  removeStyle('move-right', firstColumn)
  removeStyle('move-left', secondColumn)
}

function addStyle(style, ...elements){
  elements.forEach(element => element.classList.add(style))
}

function removeStyle(style, ...elements){
  elements.forEach(element => element.classList.remove(style))
}

async function swapColumns(firstColumn, secondColumn) {
  const firstColumnIndex = columns.indexOf(firstColumn)
  const secondColumnIndex = columns.indexOf(secondColumn)

  secondColumn.after(firstColumn)
  firstColumn.before(secondColumn)

  const tmp = columns[firstColumnIndex]
  columns[firstColumnIndex] = columns[secondColumnIndex]
  columns[secondColumnIndex] = tmp
}

function delay(timeout){
  return new Promise(resolve => setTimeout(resolve, timeout))
}

function setButtonsDisable(isDisabled, ...buttons){
  buttons.forEach(button => button.disabled = isDisabled)
}

function sortMax(a, b) {
  return a - b
}

function sortMin(a, b){
  return b - a
}