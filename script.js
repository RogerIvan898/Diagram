const MAX_COLUMN_HEIGHT = 100

const buttonCreateDiagram = document.getElementById('diagram-options-button')
const buttonSortToMax = document.getElementById('sort-max')
const buttonSortToMin = document.getElementById('sort-min')
const diagramElement = document.getElementById('diagram')

let columns = []
let isSorting = false
let cancelSorting = () => {}

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
    isSorting = false
    
    cancelSorting()
    clearDiagram()

    drawDiagram(numbers)

    enableButtons(buttonSortToMin, buttonSortToMax)
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
  cancelSorting()

  let cancelPromise = new Promise(cancel => cancelSorting = () => {
    isSorting = false
    cancel()
  })

  let firstColumn = columns[0]
  let secondColumn = columns[1]

  addCompareStyle(firstColumn, secondColumn)
  await delay(400)

  isSorting = true

  for(let i = 0; i < columns.length; i++) {
    for (let j = 0; j < columns.length - i - 1; j++) {
      firstColumn = columns[j]
      secondColumn = columns[j + 1]

      const result = await Promise.race([
        cancelPromise,
        new Promise(async (resolve) => {
          addCompareStyle(firstColumn, secondColumn)
          await delay(800)

          resolve(async () => {
            const compareResult = compareFunction(firstColumn.textContent, secondColumn.textContent)
            if (compareResult > 0 && isSorting) {
              firstColumn.style.transform = 'translateX(calc(100% + 10px))'
              secondColumn.style.transform = 'translateX(calc(-100% - 10px))'

              await delay(800)
              if(isSorting) {
                swapColumns(j, j + 1)
              }
                firstColumn.style.transform = 'translateX(0)'
                secondColumn.style.transform = 'translateX(0)'
            }
          })
        })
      ])

      result && await result()

      removeCompareStyle(firstColumn, secondColumn)

      if(!result){
        return
      }
    }
  }
}

function addCompareStyle(...columns){
  columns.forEach(column => column.classList.add('column-compare'))
}

function removeCompareStyle(...columns){
  columns.forEach(column => column.classList.remove('column-compare'))
}

async function swapColumns(firstColumnIndex, secondColumnIndex) {
  const firstColumn = columns[firstColumnIndex]
  const secondColumn = columns[secondColumnIndex]

  diagramElement.insertBefore(firstColumn, secondColumn)
  diagramElement.insertBefore(secondColumn, firstColumn)

  const tmp = columns[firstColumnIndex]
  columns[firstColumnIndex] = columns[secondColumnIndex]
  columns[secondColumnIndex] = tmp
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