const LOCAL_STORE_LISTS = 'state_data'
const UL_ELEMENT = document.querySelector('#todoList')
const TITLE_INPUT = document.querySelector('#headerTitle')
const NEW_TASK_INPUT = document.querySelector('#txtNewTask')
const BTN_IMPORT_LIST = document.querySelector('#btnImportList')
const BTN_EXPORT_LIST = document.querySelector('#btnExportList')

const task = {
    id: '',
    description: '',
    status: 'open'
}


let list = {
    listTitle: '',
    tasksList: []
}

init()

function init(){
    loadList()
    renderListHeader()
    renderTodoList()
    
    document.querySelector('#addTaskForm').addEventListener('submit', handleSubmit)
    document.querySelector('#addTaskForm i').addEventListener('click', handleSubmit)

    TITLE_INPUT.addEventListener('change', handleChangeTitle)
    BTN_EXPORT_LIST.addEventListener('click', handleExportList)
    BTN_IMPORT_LIST.addEventListener('change', handleImportList)
}

async function loadLists(){
    const items = Object.keys(localStorage)

    setup.lists = items.filter(item => item.includes(LOCAL_STORE_LISTS))
}

async function loadList(){
    const list_data = localStorage.getItem(LOCAL_STORE_LISTS)

    if (list_data) list = JSON.parse(list_data)
    
}

async function importList(file, cb){
    const reader = new FileReader()
    
    reader.onload = () => {        
        list = JSON.parse(reader.result)
        cb()
    }

    await reader.readAsText(file)
}

async function saveList(){
    await localStorage.setItem(LOCAL_STORE_LISTS, JSON.stringify(list))
}

async function exportList(){
    const data = new Blob([JSON.stringify(list)], {type: 'text/plain'})
    let fileUrl = await window.URL.createObjectURL(data)

    var a = document.createElement("a")

    a.href = fileUrl
    a.download = 'todo_bkp_' + new Date().toLocaleString().replace(' ', '_')
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)

    window.URL.revokeObjectURL(fileUrl)
}



function renderTodoList(){

    UL_ELEMENT.innerHTML = ''

    if (!list.tasksList) return

    list.tasksList.forEach(task => {
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
    TITLE_INPUT.value = list.listTitle || ''
}


async function handleImportList(event){
    event.preventDefault()

    if(!event.target.files[0]) return

    if (!confirm('Essa operação irá apagar a sua atual lista de tarefas. \n \nVocê deseja continuar?')) return

    const file = event.target.files[0]
    
    const callBack = () => {        
        saveList()
        renderListHeader()
        renderTodoList()
    }
    
    importList(file, callBack)
}

async function handleExportList(event){
    event.preventDefault()

    exportList()
}


async function handleChangeTitle(event){
    event.preventDefault()

    list.listTitle = TITLE_INPUT.value
    saveList()

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
    
    if (!list.tasksList) list.tasksList = []
    
    list.tasksList.push(newTask)
    saveList()
    
}

async function handleChangeTaskStatus(event){
    event.preventDefault()

    const taskId = event.target.parentElement.id
    await reverseTaskStatus(taskId)

    renderTodoList()
}

function reverseTaskStatus(taskId){
    const taskIndex = list.tasksList.findIndex(task => task.id == taskId)
    console.log(taskIndex)
    if (taskIndex >= 0) {
        const newStatus = list.tasksList[taskIndex].status == 'open' ? 'closed' : 'open'
        list.tasksList[taskIndex].status = newStatus

        saveList()
    }
}



async function handleDeleteTask(event){
    event.preventDefault()

    const taskId = event.target.parentElement.id
    await destroyTask(taskId)

    renderTodoList()
}

function destroyTask(taskId){
    const taskIndex = list.tasksList.findIndex(task => task.id == taskId)

    if (taskIndex >= 0) {
        list.tasksList.splice(taskIndex, 1)
        saveList()
    }
}