const MAX_COLUMN_HEIGHT = 100

const buttonElement = document.getElementById('diagram-options-button')
const diagramElement = document.getElementById('diagram')
const buttonSortFromMinToMax = document.getElementById('sort-from-min-to-max')
const buttonSortFromMaxToMin = document.getElementById('sort-from-max-to-min')

let diagramNumbers = []

buttonElement.addEventListener('click',createDiagram)
buttonSortFromMaxToMin.addEventListener('click',()=> sortColumns(()=>bubbleSortFromMaxToMin(diagramNumbers)))
buttonSortFromMinToMax.addEventListener('click',()=> sortColumns(()=>bubbleSortFromMinToMax(diagramNumbers)))

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

        buttonSortFromMinToMax.removeAttribute('disabled')
        buttonSortFromMaxToMin.removeAttribute('disabled')
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

function bubbleSortFromMinToMax(array){
    const sortedArray = [...array]
    for(let i=0; i < sortedArray.length; i++) {
        for (let j = 0; j < sortedArray.length - i; j++) {
            if (sortedArray[j] > sortedArray[j + 1]) {
                const tmp = sortedArray[j]
                sortedArray[j] = sortedArray[j + 1]
                sortedArray[j + 1] = tmp
            }
        }
    }

    return sortedArray
}

function bubbleSortFromMaxToMin(array){
    return bubbleSortFromMinToMax(array).reverse()
}

function sortColumns(sortFunction){
    diagramNumbers = sortFunction(diagramNumbers)
    drawDiagram(diagramNumbers)
}
