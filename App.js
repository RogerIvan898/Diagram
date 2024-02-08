import {Diagram} from './src/classes/Diagram.js'
import {Button} from './src/classes/Button.js'
import './styles.css'

const inputElement = document.getElementById('diagram-options-input')
const buttonCreateDiagram = new Button('Построить', () => createDiagram())

inputElement.after(buttonCreateDiagram.element)

let diagram = null

function createDiagram(){
  const inputText = inputElement.value
  const numbers = inputText.split(' ').filter(number => !isNaN(Number(number)) && number !== '').map(Number)

  if(!diagram){
    diagram = new Diagram(numbers, buttonCreateDiagram)
    return
  }

  diagram.redrawColumnContainer(numbers)
}