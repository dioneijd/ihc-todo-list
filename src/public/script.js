const LOCAL_STORE_STATE = 'state_data'
const UL_ELEMENT = document.querySelector('#todoList')
const TITLE_INPUT = document.querySelector('#headerTitle')
const NEW_TASK_INPUT = document.querySelector('#txtNewTask')

const task = {
    id: '',
    description: '',
    status: 'open'
}


let state = {
    listTitle: '',
    tasksList: []
}

init()

function init(){
    loadState()
    renderListHeader()
    renderTodoList()
    
    document.querySelector('#addTaskForm').addEventListener('submit', handleSubmit)
    document.querySelector('#addTaskForm i').addEventListener('click', handleSubmit)

    TITLE_INPUT.addEventListener('change', handleChangeTitle)
}



function loadState(){
    const state_data = localStorage.getItem(LOCAL_STORE_STATE)

    if (state_data) state = JSON.parse(state_data)
    
}

function saveState(){
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
    TITLE_INPUT.value = state.listTitle || ''
}



async function handleChangeTitle(event){
    event.preventDefault()

    state.listTitle = TITLE_INPUT.value
    saveState()

    renderListHeader()

}

async function handleSubmit(event){
    event.preventDefault()

    if (NEW_TASK_INPUT.value == '') return '> ERRO: No task description entered'

    await addNewTask()

    renderTodoList()
    NEW_TASK_INPUT.value = ''
}


function addNewTask(){
    const newId = Math.random().toString(36).substr(2, 9)
    
    const newTask = {
        id: newId,
        description: NEW_TASK_INPUT.value,
        status: 'open'
    }
    
    if (!state.tasksList) state.tasksList = []
    
    state.tasksList.push(newTask)
    saveState()
    
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

        saveState()
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
        saveState()
    }
}