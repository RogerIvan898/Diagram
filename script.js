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

  interval = setInterval(() => {
    if(document.visibilityState === 'visible') {
      if (i < columns.length) {
        if (j < columns.length - i - 1) {
          swapColumns(j, j + 1, compareFunction)
          j++
        } else {
          j = 0
          i++
        }
      } else {
        clearInterval(interval)
      }
    }
  }, 1500)
}

async function swapColumns(firstColumnIndex, secondColumnIndex, compareFunction) {
  const firstColumn = columns[firstColumnIndex]
  const secondColumn = columns[secondColumnIndex]

  firstColumn.classList.add('column-compare')
  secondColumn.classList.add('column-compare')

  const compareResult = compareFunction(firstColumn.textContent, secondColumn.textContent)
  if (compareResult > 0) {
    const firstColumnOrder = firstColumn.style.order
    const secondColumnOrder = secondColumn.style.order

    firstColumn.classList.add('move-left')
    secondColumn.classList.add('move-right')

    const animationPromise = new Promise(resolve => {
      const handleTransitionEnd = () => {
        firstColumn.removeEventListener('animationend', handleTransitionEnd)
        resolve()
      }

      firstColumn.addEventListener('animationend', handleTransitionEnd)
    })

    await animationPromise

    const tmp = columns[firstColumnIndex]
    columns[firstColumnIndex] = columns[secondColumnIndex]
    columns[secondColumnIndex] = tmp

    if (columns[firstColumnIndex] && columns[secondColumnIndex]) {
      diagramElement.insertBefore(firstColumn, secondColumn)

      firstColumn.classList.remove('move-left', 'column-compare')
      secondColumn.classList.remove('move-right', 'column-compare')

      firstColumn.style.order = secondColumnOrder
      secondColumn.style.order = firstColumnOrder
    }
  }
  else {
     const removeComparePromise = new Promise(resolve =>  setTimeout(() => {
      firstColumn.classList.remove('column-compare')
      secondColumn.classList.remove('column-compare')
      resolve()
    }, 1000))

    await removeComparePromise
  }
}

function sortMax(a, b) {
  return a - b
}

function sortMin(a, b){
  return b - a
}