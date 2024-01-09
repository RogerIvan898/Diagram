const MAX_COLUMN_HEIGHT = 100

const buttonCreateDiagram =   document.getElementById('diagram-options-button')
const buttonSortToMax =  document.getElementById('sort-max')
const buttonSortToMin =  document.getElementById('sort-min')
const diagramElement =   document.getElementById('diagram')

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
    }
}

function drawDiagram(numbers){
    clearDiagram()
    const maxNumber = Math.max(...numbers)

    for(let number of numbers) {
        const newColumnElement = createElement('div','diagram-column')
        newColumnElement.style.height = `${(MAX_COLUMN_HEIGHT*number)/maxNumber}%`
        newColumnElement.textContent = number
        diagramElement.appendChild(newColumnElement)
    }
}

function clearDiagram(){
    const columns = Array.from(document.getElementsByClassName('diagram-column'))
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
        if(i < diagramNumbers.length){
            const columns = Array.from(document.getElementsByClassName('diagram-column'))
            if(j < diagramNumbers.length - i - 1) {
                const compareResult = compareFunction(diagramNumbers[j], diagramNumbers[j + 1])
                columns[j].style.background = 'red'
                columns[j + 1].style.background = 'red'

                 if (compareResult > 0) {
                    const tmp = diagramNumbers[j]
                    diagramNumbers[j] = diagramNumbers[j + 1]
                    diagramNumbers[j + 1] = tmp
                }
                await setTimeout(() => drawDiagram(diagramNumbers),300)
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
    }, 1000)
}

function sortMax(a, b) {
    return a - b
}

function sortMin(a, b){
    return b - a
}