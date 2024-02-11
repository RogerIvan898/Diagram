import {Diagram} from './src/classes/Diagram.js'
import {Button} from './src/classes/Button.js'
import './styles.css'

const inputElement = document.getElementById('diagram-options-input')
inputElement.addEventListener('keydown',
  (event) => event.key === 'Enter' && createDiagram()
)
let diagram = null

const buttonCreateDiagramProps = {
  clickEvent: () => createDiagram(),
  element: document.getElementById('diagram-option-create'),
}

const buttonCreateDiagram = new Button(buttonCreateDiagramProps)

function createDiagram(){
  const inputText = inputElement.value
  const numbers = inputText.split(' ').filter(number => !isNaN(Number(number)) && number !== '').map(Number)

  if(!numbers.length){
    return
  }

  if(!diagram){
    diagram = new Diagram(numbers, buttonCreateDiagram)
    return
  }

  diagram.redrawColumnContainer(numbers)
}