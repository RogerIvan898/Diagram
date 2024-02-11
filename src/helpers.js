export function createHTMLElement(tagName, ...classes){
  const element = document.createElement(tagName)
  if(classes.length){
    element.classList.add(...classes)
  }

  return element
}

export function toggleCssClass(className, elements, isApply) {
  let elementsArr = []
  elements instanceof Array ? elementsArr = elements : elementsArr.push(elements)

  if (isApply) {
    elementsArr.forEach(element => element.classList.add(className))
    return
  }
  elementsArr.forEach(element => element.classList.remove(className))
}

export function delay(timeout){
  return new Promise(resolve => setTimeout(resolve, timeout))
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