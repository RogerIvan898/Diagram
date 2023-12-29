const buttonElement = document.getElementById('diagram-options-button')
buttonElement.addEventListener('click',drawDiagram)

function getNumbers(){
    const inputText = document.getElementById('diagram-options-input').value
    const numbers = inputText.split(' ').filter(number => !isNaN(Number(number)) && number !== '')

    return numbers
}

function drawDiagram(){
    const MAX_COLUMN_HEIGHT = 100
    const diagramElement = document.getElementById('diagram')
    const numbers = getNumbers()
    const maxNumber = Math.max(...numbers)

    clearDiagram()
    for(let number of numbers) {
        const newColumnElement = createElement('div','diagram-column')

        newColumnElement.style.height = `${(MAX_COLUMN_HEIGHT*number)/maxNumber}%`
        newColumnElement.textContent = number
        diagramElement.appendChild(newColumnElement)
    }
}

function clearDiagram(){
    const columns = Array.from(document.getElementsByClassName('diagram-column'))
    columns.forEach(column =>{
        column.remove()
    })
}

function createElement(tagName,...classes){
    const element = document.createElement(tagName)
    if(classes.length){
        element.classList.add(...classes)
    }

    return element
}

