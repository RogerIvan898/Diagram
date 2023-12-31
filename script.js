const MAX_COLUMN_HEIGHT = 100

const buttonCreateDiagram =   document.getElementById('diagram-options-button')
const buttonSortToMax =  document.getElementById('sort-max')
const buttonSortToMin =  document.getElementById('sort-min')
const diagramElement =   document.getElementById('diagram')

let diagramNumbers = []

buttonSortToMin.addEventListener('click', () => sortColumns('min'))
buttonSortToMax.addEventListener('click', () => sortColumns('max'))
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

function sortArray(direction = 'max'){
    const sortedArray = [...diagramNumbers]

    for (let i = 0; i < sortedArray.length; i++) {
        for (let j = 0; j < sortedArray.length - i; j++) {
            if (sortedArray[j] > sortedArray[j + 1]) {
                const tmp = sortedArray[j]
                sortedArray[j] = sortedArray[j + 1]
                sortedArray[j + 1] = tmp
            }
        }
    }

    if(direction === 'min'){
        sortedArray.reverse()
    }

    return sortedArray
}

function sortColumns(direction){
    diagramNumbers = sortArray(direction)
    drawDiagram(diagramNumbers)
}
