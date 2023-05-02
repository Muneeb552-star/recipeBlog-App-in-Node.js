
// Function to Increase Ingredients List
addIngredient = () => {
  let ingredientList = document.querySelector('.ingredientList')
  let ingredientDiv = document.querySelectorAll('.ingredientDiv')[0]
  let newIngredients = ingredientDiv.cloneNode(true)
  let input = newIngredients.getElementsByTagName('input')[0]
  input.value = ''
  ingredientList.appendChild(newIngredients)
}

// Function to update Ingredients
updateIngredients = () => {
  let ingredientListUpdate = document.querySelector('.ingredientListUpdate')
  let ingredientDivUpdate = document.querySelectorAll('.ingredientDivUpdate')[0]
  let input = ingredientDivUpdate.cloneNode(true)
  let newInput = input.getElementsByTagName('input')[0]
  newInput.value = ''
  ingredientListUpdate.append(input)
}

