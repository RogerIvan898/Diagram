const MAX_COLUMN_HEIGHT = 100

const buttonElement = document.getElementById('diagram-options-button')
const diagramElement = document.getElementById('diagram')
const buttonSortFromMinToMax = document.getElementById('sort-max')
const buttonSortFromMaxToMin = document.getElementById('sort-min')

let diagramNumbers = []

buttonElement.addEventListener('click',createDiagram)
buttonSortFromMaxToMin.addEventListener('click',()=>sortColumns('min'))
buttonSortFromMinToMax.addEventListener('click',()=> sortColumns('max'))

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

        buttonSortFromMinToMax.disabled = false
        buttonSortFromMaxToMin.disabled = false
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

function sortArray(array,direction){
    const sortedArray = [...array]

    if(direction === 'max' || direction === 'min') {
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
    }

    return sortedArray
}

function sortColumns(direction){
    if(direction === 'min'){
        diagramNumbers = sortArray(diagramNumbers,'min')
    }
    if(direction === 'max'){
        diagramNumbers = sortArray(diagramNumbers,'max')
    }

    drawDiagram(diagramNumbers)
}
