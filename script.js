const MAX_COLUMN_HEIGHT = 100
const ANIMATION_DURATION = 800

const buttonCreateDiagram = document.getElementById('diagram-options-button')
const buttonSortToMax = document.getElementById('sort-max')
const buttonSortToMin = document.getElementById('sort-min')
const diagramElement = document.getElementById('diagram')

let columns = []
const sortingData = {
  isSorting: false,
  isSwap: false,
  cancel: () => {},
}

buttonSortToMin.addEventListener('click', () => sortColumns(sortMin))
buttonSortToMax.addEventListener('click', () => sortColumns(sortMax))
buttonCreateDiagram.addEventListener('click', createDiagram)

function getNumbers(){
  const inputText = document.getElementById('diagram-options-input').value
  const numbers = inputText.split(' ').filter(number => !isNaN(Number(number)) && number !== '')

  return numbers.map(Number)
}

async function createDiagram(){
  const numbers = getNumbers()
  if(numbers.length){
    sortingData.cancel()
    clearDiagram()

    drawDiagram(numbers)

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

async function sortColumns(compareFunction){
  if(sortingData.isSwap){
    await delay(ANIMATION_DURATION)
  }
  sortingData.cancel()
  sortingData.isSorting = true

  for(let i = 0; i < columns.length; i++) {
    for (let j = 0; j < columns.length - i - 1; j++) {
      const firstColumn = columns[j]
      const secondColumn = columns[j + 1]
      
      const iterationResult = await processSortIteration(firstColumn, secondColumn)

      if (iterationResult){
        await animateColumnsSwap(firstColumn, secondColumn, compareFunction)
      }

      removeStyle('column-compare', firstColumn, secondColumn)

      if (!iterationResult || !sortingData.isSorting) {
        return
      }
    }
  }
}

const animateColumnsHighlite = async (firstColumn, secondColumn) => {
  addStyle('column-compare', firstColumn, secondColumn)
  await delay(ANIMATION_DURATION)
  return true
}

const cancelPromise = () => new Promise(resolve => sortingData.cancel = () => {
  sortingData.isSorting = false
  resolve(false)
})

function processSortIteration(firstColumn, secondColumn){
  return Promise.race([
    animateColumnsHighlite(firstColumn, secondColumn),
    cancelPromise()
  ])
}

async function animateColumnsSwap(firstColumn, secondColumn, compareFunction){
    const compareResult = compareFunction(+firstColumn.textContent, +secondColumn.textContent)

    if (sortingData.isSorting && compareResult > 0) {
      sortingData.isSwap = true

      addStyle('move-right', firstColumn)
      addStyle('move-left', secondColumn)

      await delay(ANIMATION_DURATION)

      removeStyle('move-right', firstColumn)
      removeStyle('move-left', secondColumn)

      if (sortingData.isSorting) {
        swapColumns(firstColumn, secondColumn)
      }

      sortingData.isSwap = false
    }
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