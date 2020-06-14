const LOCAL_STORE_STATE = 'state_data'
const UL_ELEMENT = document.querySelector('#todoList')
const H1_ELEMENT = document.querySelector('#listHeader h1')
const INPUT_ELEMENT = document.querySelector('#txtNewTask')

const task = {
    id: '',
    description: '',
    status: 'open'
}


let state = {
    listHeader: 'IHC',
    tasksList: []
}

init()

function init(){
    loadSavedTasks()
    renderListHeader()
    renderTodoList()

    document.querySelector('#addTaskForm').addEventListener('submit', handleSubmit)
    document.querySelector('#addTaskForm i').addEventListener('click', handleSubmit)
}



function loadSavedTasks(){
    const state_data = localStorage.getItem(LOCAL_STORE_STATE)

    if (state_data) state = JSON.parse(state_data)
    
}

function saveTasks(){
    localStorage.setItem(LOCAL_STORE_STATE, JSON.stringify(state))
}




function renderTodoList(){

    UL_ELEMENT.innerHTML = ''

    if (!state.tasksList) return

    state.tasksList.forEach(task => {
        const newToDoRow = `
            <li class="todoRow" id="${task.id}">
                <input type="checkbox" name="todo_${task.id}" id="todo_${task.id}" ${task.status == 'open' ? '' : 'checked'} >
                <label for="todo_${task.id}">${task.description}</label>
                <i class="far fa-trash-alt delete"></i>
            </li>
        `
        UL_ELEMENT.innerHTML += newToDoRow
    })


    const allTodoRowElements = document.querySelectorAll('li.todoRow i.delete')
    allTodoRowElements.forEach(el => el.addEventListener('click', handleDeleteTask))

    const allCheckboxElements = document.querySelectorAll('li.todoRow input[type="checkbox"]')
    allCheckboxElements.forEach(el => el.addEventListener('change', handleChangeTaskStatus))
}

function renderListHeader(){
    H1_ELEMENT.innerText = state.listHeader || ''
}



async function handleSubmit(event){
    event.preventDefault()

    if (INPUT_ELEMENT.value == '') return '> ERRO: No task description entered'

    await addNewTask()

    renderTodoList()
    INPUT_ELEMENT.value = ''
}


function addNewTask(){
    const newId = Math.random().toString(36).substr(2, 9)
    
    const newTask = {
        id: newId,
        description: INPUT_ELEMENT.value,
        status: 'open'
    }
    
    if (!state.tasksList) state.tasksList = []
    
    state.tasksList.push(newTask)
    saveTasks()
    
}

async function handleChangeTaskStatus(event){
    event.preventDefault()

    const taskId = event.target.parentElement.id
    await reverseTaskStatus(taskId)

    renderTodoList()
}

function reverseTaskStatus(taskId){
    const taskIndex = state.tasksList.findIndex(task => task.id == taskId)
    console.log(taskIndex)
    if (taskIndex >= 0) {
        const newStatus = state.tasksList[taskIndex].status == 'open' ? 'closed' : 'open'
        state.tasksList[taskIndex].status = newStatus

        saveTasks()
    }

}



async function handleDeleteTask(event){
    event.preventDefault()

    const taskId = event.target.parentElement.id
    await destroyTask(taskId)

    renderTodoList()
}

function destroyTask(taskId){
    const taskIndex = state.tasksList.findIndex(task => task.id == taskId)

    if (taskIndex >= 0) {
        state.tasksList.splice(taskIndex, 1)
        saveTasks()
    }
}