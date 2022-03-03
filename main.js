
var todo = [];
var selectedTab;

onPageLoad();


// Actions -------------------------------------

function getSaveTodo (){
  let todo = [];
  let todoVlue = localStorage.getItem('todo');
  if (todoVlue){
    todo = JSON.parse(todoVlue);
  }
  return todo;
}

function onPageLoad() {
  setState(getSaveTodo(), 'all');
}

function setState(newTodo, newSelectedTab = selectedTab){
  todo = newTodo;
  selectedTab = newSelectedTab;

  render(todo, getItemsByStatus(todo, selectedTab), selectedTab);
  localStorage.setItem('todo', JSON.stringify(todo));
}

function onInputChange(eventObject) {
// add item to array List
  addItemToList(todo, eventObject.target.value);
  // setItem to the localStorag
  localStorage.setItem('todo', JSON.stringify(todo));
// use existing method of rendering the full array List
  render(todo, getItemsByStatus(todo, selectedTab), selectedTab);
}

function onCheckboxChange(eventObject){
 //toggle item status in array
  for (var i = 0; i < todo.length; i++){
   if(todo[i].id === eventObject.target.dataset.id){
    toggleItemStatus(todo[i]);
    }
  }
 // render the updated array
 localStorage.setItem('todo', JSON.stringify(todo));
 render(todo, getItemsByStatus(todo, selectedTab), selectedTab);
}

function onRemoveButtonClick(eventObject){
 //remove item from array
 for (var i = 0; i < todo.length; i++){
  if(todo[i].id === eventObject.target.dataset.id){ 
    deleteItemFromList(todo, todo[i]);
  }
}
 // render the updated array
 localStorage.setItem('todo', JSON.stringify(todo));
 render(todo, getItemsByStatus(todo, selectedTab), selectedTab);
}

function onTabClick(eventObject){
  //find out which tab was clicked
  selectedTab = eventObject.target.id;

    // filter the todo array according to selectedTab
  var filteredArray = getItemsByStatus(todo, selectedTab);

  //render only the filtered todo array 
  render(todo ,filteredArray, selectedTab);
}

function onClearCompletedClick (){
  // update the all todo list to be only active
  todo = getItemsByStatus(todo, 'active');
  //render
  localStorage.setItem('todo', JSON.stringify(todo));
  render(todo, getItemsByStatus(todo, selectedTab), selectedTab);
}

function onNameDoubleClick(eventObject) {
  for (var i = 0; i < todo.length; i++) {
    if (todo[i].id === eventObject.target.dataset.id) {
      toggleEditableState(todo[i]);
    }
  }
  render(todo, getItemsByStatus(todo, selectedTab), selectedTab);
}

function onNameClick(eventObject) {
  eventObject.preventDefault();
}

function onNameChange(eventObject) {
  for (var i = 0; i < todo.length; i++) {
    if (todo[i].id === eventObject.target.dataset.id) {
      renameItem(todo[i], eventObject.target.value);
      toggleEditableState(todo[i]);
    }
  }
  localStorage.setItem('todo', JSON.stringify(todo));
  render(todo, getItemsByStatus(todo, selectedTab), selectedTab);
}
 
//view--------------------------------------

function render(allTodo ,filteredTodo, selectedTab){
  var InputContainer = document.querySelector('.InputContainer');
  var ListContainer = document.querySelector('.ListContainer');
  var FooterContainer = document.querySelector('.FooterContainer');

  var Input = document.querySelector('header');
  if (Input) {
    InputContainer.removeChild(Input);
  }
  InputContainer.appendChild(TodoInput(allTodo, filteredTodo, selectedTab));
  TodoInputAfterRender(document.querySelector('header'));  

  var List = document.querySelector('.List');
  if (List){
    ListContainer.removeChild(List);
  }
  ListContainer.appendChild(TodoList(allTodo, filteredTodo, selectedTab));
  TodoListAfterRender(document.querySelector('.List'));

  var Footer = document.querySelector('.footer');
  if (Footer){
    FooterContainer.removeChild(Footer);
  }
  FooterContainer.appendChild(TodoFooter(allTodo, filteredTodo, selectedTab));
  TodoFooterAfterRender(document.querySelector('.footer'));

}

function TodoInput(){
  // </div>  
  //<input class="new-tolist" placeholder="what needs to be done?" type="text" autofocus id="new">
  //</div>
   var header = document.createElement('header');
   var input = document.createElement('input');
   input.className = 'new-tolist';
   input.type = 'text';
   input.id = 'new';
   input.placeholder = 'What needs to be done?';
   input.addEventListener('change', onInputChange);
 
   header.appendChild(input);
   return header;
}

function TodoInputAfterRender(header) {
  header.querySelector('input').focus();
}

//footer
  function TodoFooter(allTodo, filteredTodo, selectedTab){
  var footer = document.createElement('footer');
  footer.className = 'footer';

  var span = document.createElement('span');
  span.innerText = getItemsByStatus(allTodo, 'active').length + ' items left';

  var ul = document.createElement('ul');
  ul.className = 'menu-bottom';

  var tabs = ['All', 'Active', 'Completed'];
  for (var i = 0; i < tabs.length; i++){
    var tabId = tabs[i].toLowerCase();
    var li = document.createElement('li');
    var a = document.createElement('a');
    a.className = 'status';
    if (tabId === selectedTab){
      a.className += ' is-selected';
    }
    a.innerText = tabs[i];
    a.id = tabId;
    a.href = '#' + tabId;
    a.addEventListener('click', onTabClick);
    li.appendChild(a);
    ul.appendChild(li);
  }

  var clearCompletedButton = document.createElement('a');
  clearCompletedButton.className = 'clear';
  clearCompletedButton.id = 'clearCompleted';
  clearCompletedButton.href = '#ClearButton';
  clearCompletedButton.innerText = 'Clear completed';
  clearCompletedButton.addEventListener('click', onClearCompletedClick);

  footer.appendChild(span);
  footer.appendChild(ul);
  footer.appendChild(clearCompletedButton);

  return footer;
} 

function TodoFooterAfterRender() {}

function TodoList(allTodo, filteredTodo, selectedTab) {
  // <ul class="List">
  var ul = document.createElement('ul');
  ul.className = 'List';
  for (var i = 0; i < filteredTodo.length; i++) {
    ul.appendChild(TodoItem(filteredTodo[i]))
  }
  return ul;
}

function TodoListAfterRender(ul) {
  var editInput = ul.querySelector('input[type="text"]');
  if (editInput) {
    editInput.focus();
  }
}

function TodoItem(todoItem) {
  // <li class="item">
  // <input type="checkbox" name id="id-1">
  // <label for="id-1" contenteditable>cook</label>
  // </input><button class="Item-remove" aria-label="Remove">&times;</button>

  var li = document.createElement('li');
  li.className = 'item'

  var checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.dataset.id = getItemId(todoItem.name);
  checkbox.checked = todoItem.active === false;
  checkbox.addEventListener('change', onCheckboxChange);
  li.appendChild(checkbox);

  if (todoItem.isEditable){
    //input
    var input = document.createElement('input');
    input.value = todoItem.name;
    input.type = 'text';
    input.className = 'TodoInput';
    input.dataset.id = getItemId(todoItem.name);
    input.value = todoItem.name;
    //input.addEventListener('change', onNameChange);
    input.addEventListener('blur', onNameChange);
    li.appendChild(input);
    
  } else {
    var label = document.createElement('label');
    label.htmlFor = getItemId(todoItem.name);
    label.dataset.id = getItemId(todoItem.name);
    label.innerText = todoItem.name;
    label.addEventListener('click', onNameClick);
    label.addEventListener('dblclick', onNameDoubleClick);
    li.appendChild(label);
  }
  
  var removeButton = document.createElement('button');
  removeButton.className = 'Item-remove';
  removeButton.dataset.id = getItemId(todoItem.name);
  removeButton.setAttribute('aria-label', 'Remove');
  removeButton.innerHTML = '&times;';
  removeButton.addEventListener('click', onRemoveButtonClick);
  li.appendChild(removeButton);
  return li;
}

function TodoItemAfterRender() {}


//functions**** todo model-------------------------

function addItemToList (todo, name){
  var newItem = {name: name, active: true, id: getItemId(name)};
  todo.push(newItem);
}

function toggleItemStatus(item){
  item.active = !item.active;
}

function getItemId(name){
  return 'id-' + name;
}

function deleteItemFromList(todo, item){
  //getting the item's index
  var idx = todo.indexOf(item);

  //delete the item from thr array
  todo.splice(idx, 1);
}

//cunt active items
function getItemsByStatus (todo, status){
  var filteredItems = [];
  for (var i = 0; i < todo.length; i++){
    if(status === 'all' || status === 'active' && todo[i].active){
      filteredItems.push(todo[i]);
    } else if (status === 'all' || status === 'completed' && !todo[i].active){
      filteredItems.push(todo[i]);
    }
  }
  return filteredItems;
}


function renameItem(item, newName){
  item.name = newName;
  item.id = getItemId(newName);
}

function toggleEditableState(item){
  item.isEditable = !item.isEditable;
}

