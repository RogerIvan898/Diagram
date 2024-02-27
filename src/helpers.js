export function createHTMLElement(tagName, ...classes){
  const element = document.createElement(tagName)

  if(classes && classes.length){
    element.classList.add(...classes)
  }

  return element
}

export function toggleCssClass(className, elements, force) {
  const elementsArr = Array.isArray(elements) ? elements : [elements]

  elementsArr.forEach(element => element.classList.toggle(className, force))
}

export function delay(timeout){
  return new Promise(resolve => setTimeout(resolve, timeout))
}

export function promisifyEvent(element, eventType){
  return new Promise(resolve => {
    function eventListener() {
      element.removeEventListener(eventType, eventListener)
      resolve()
    }

    element.addEventListener(eventType, eventListener)
  })
}

export function disableButtons(isDisabled, ...buttons){
  buttons.forEach(button => button.disabled = isDisabled)
}

export function isAscendingOrder(a, b){
  return a - b > 0
}

export function isDescendingOrder(a, b){
  return b - a > 0
}