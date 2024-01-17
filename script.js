const MAX_COLUMN_HEIGHT = 100

const buttonCreateDiagram = document.getElementById('diagram-options-button')
const buttonSortToMax = document.getElementById('sort-max')
const buttonSortToMin = document.getElementById('sort-min')
const diagramElement = document.getElementById('diagram')

let debounceTimer = null
let columns = []
let diagramNumbers = []
let isSorting = false

buttonSortToMin.addEventListener('click', () => startSorting(sortMin))
buttonSortToMax.addEventListener('click', () => startSorting(sortMax))
buttonCreateDiagram.addEventListener('click', createDiagram)

function getNumbers(){
  const inputText = document.getElementById('diagram-options-input').value
  const numbers = inputText.split(' ').filter(number => !isNaN(Number(number)) && number !== '')

  return numbers.map(number => Number(number))
}

function createDiagram(){
  const numbers = getNumbers()
  if(numbers.length){
    clearDiagram()
    drawDiagram(numbers)

    clearTimeout(debounceTimer)
    isSorting = false

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

function startSorting(compareFunction) {
  clearTimeout(debounceTimer)

  debounceTimer = setTimeout(async () => {
    if (isSorting) {
      isSorting = false
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    isSorting = true
    await sortColumns(compareFunction)
    isSorting = false
  }, 1000)
}

async function sortColumns(compareFunction){
  for(let i = 0; i < columns.length; i++){
    for(let j = 0; j < columns.length - i - 1; j++){
      if(!isSorting) {
        return
      }
      if (j < columns.length - i - 1) {
        await swapColumns(j, j + 1, compareFunction)
        await new Promise(resolve => setTimeout(resolve, 100))
      }
    }
  }
}

function swapColumns(firstColumnIndex, secondColumnIndex, compareFunction) {
  return new Promise(async (resolve) => {
    const firstColumn = columns[firstColumnIndex]
    const secondColumn = columns[secondColumnIndex]

    firstColumn.classList.add('column-compare')
    secondColumn.classList.add('column-compare')

    const compareResult = compareFunction(firstColumn.textContent, secondColumn.textContent)
    if(compareResult > 0 && isSorting) {
      const firstColumnOrder = firstColumn.style.order
      const secondColumnOrder = secondColumn.style.order

      firstColumn.classList.add('move-left')
      secondColumn.classList.add('move-right')
      await new Promise(resolve => setTimeout(resolve, 1000))

      const tmp = columns[firstColumnIndex]
      columns[firstColumnIndex] = columns[secondColumnIndex]
      columns[secondColumnIndex] = tmp

      diagramElement.insertBefore(columns[firstColumnIndex], columns[secondColumnIndex])

      firstColumn.style.order = secondColumnOrder
      secondColumn.style.order = firstColumnOrder
    }
    else {
      await new Promise(resolve => setTimeout(resolve, 300))
    }

    firstColumn.classList.remove('column-compare', 'move-left')
    secondColumn.classList.remove('column-compare', 'move-right')
    resolve()
  })
}

function sortMax(a, b) {
  return a - b
}

function sortMin(a, b){
  return b - a
}