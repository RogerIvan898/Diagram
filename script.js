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

  return numbers.map(Number)
}

async function createDiagram(){
  const numbers = getNumbers()
  if(numbers.length){
    clearDiagram()
    drawDiagram(numbers)
    enableButtons(buttonSortToMin, buttonSortToMax)
  }
}

function drawDiagram(numbers){
  const maxNumber = Math.max(...numbers)

  numbers.forEach((number) => {
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

async function sortColumns(compareFunction) {
  disableButtons(buttonSortToMax, buttonSortToMin, buttonCreateDiagram)

  for (let i = 0; i < columns.length; i++) {
    for (let j = 0; j < columns.length - i - 1; j++) {
      const compareResult = compareFunction(columns[j].textContent, columns[j + 1].textContent)
      await applyColumnAnimation(j, j + 1, ['column-compare', 'column-compare'])
      if (compareResult > 0) {
        await applyColumnAnimation(j, j + 1, ['move-right', 'move-left'])
        swapColumns(j, j + 1)
      }
    }
  }

  enableButtons(buttonSortToMax, buttonSortToMin, buttonCreateDiagram)
}

function swapColumns(firstColumnIndex, secondColumnIndex) {
  const firstColumn = columns[firstColumnIndex]
  const secondColumn = columns[secondColumnIndex]

  diagramElement.insertBefore(firstColumn, secondColumn)
  diagramElement.insertBefore(secondColumn, firstColumn)

  const tmp = columns[firstColumnIndex]
  columns[firstColumnIndex] = columns[secondColumnIndex]
  columns[secondColumnIndex] = tmp
}

async function applyColumnAnimation(firstColumnIndex, secondColumnIndex, styles){
  const firstColumn = columns[firstColumnIndex]
  const secondColumn = columns[secondColumnIndex]

  firstColumn.classList.add(styles[0])
  secondColumn.classList.add(styles[1])

  await delay(800)
  firstColumn.classList.remove(styles[0])
  secondColumn.classList.remove(styles[1])
}

function delay(timeout){
   return new Promise(resolve => setTimeout(resolve, timeout))
}

function disableButtons(...buttons){
  buttons.forEach(button => button.disabled = true)
}

function enableButtons(...buttons){
  buttons.forEach(button => button.disabled = false)
}

function sortMax(a, b) {
  return a - b
}

function sortMin(a, b){
  return b - a
}