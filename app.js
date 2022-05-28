/* =================== КОНСТАНТЫ =================== */
const form = document.querySelector('#todo__form')
const input = document.querySelector('.todo__input')
const addBtn = document.querySelector('.add__btn')
const toDoList = document.querySelector('.todo__list')
const wrapper = document.querySelector('.wrapper')
const clearAllBtn = document.querySelector('.clearAllBtn')
const select = document.querySelector('.select')

/* =================== EVENTS =================== */
document.addEventListener('DOMContentLoaded', getTasks)
addBtn.addEventListener('click', addTask)
toDoList.addEventListener('click', checkTask)
clearAllBtn.addEventListener('click', clearBtn)
select.addEventListener('change', filter)

/* =================== ФУНКЦИИ =================== */

// Фукнция добавления (создания) задачи
function addTask(event){
    event.preventDefault()

    if(input.value){
        //Создаем задачу
        let task = document.createElement('li')
        task.classList.add('list__item')
        task.innerText = input.value
        toDoList.append(task)

        //Сохраняем в LocalStorage
        saveLocalStorage(input)

        //Создаем кнопку подтверждения
        let confirm = document.createElement('button')
        confirm.classList.add('confirmBtn')
        confirm.innerHTML = '<i class = "fas fa-check"></i>'


         //Создаем кнопку удаления
         let trash = document.createElement('button')
         trash.classList.add('trashBtn')
         trash.innerHTML = '<i class="fas fa-trash"></i>'

         //Создаём кнопку редактирования
         let edit = document.createElement('button')
         edit.classList.add('editBtn')
         edit.innerHTML = '<i class="fas fa-edit"></i>'


         let buttonsDiv = document.createElement('div')
         buttonsDiv.classList.add('buttonsDiv')
         task.append(buttonsDiv)

        buttonsDiv.append(confirm)
        buttonsDiv.append(edit)
        buttonsDiv.append(trash)
            
        //Обнуялем input
        input.value = ''
    }

}

// Фукнция отметки выполненной задачи
function checkTask(event){
    const item  = event.target

    //ВЫПОЛНЕННАЯ ЗАДАЧА
    if(item.classList[0] === 'confirmBtn'){
        //Обертка кнопок подтверждения и удаления
        let todo = item.parentNode

        //Зачёркиваем выполнения задания относительно блока с кнопками - confirmParent
        todo.parentNode.classList.toggle('performTask')

        if(todo.parentNode.classList.contains('performTask')){
            // Блокируем основные кнопки
            let editBtn = todo.querySelector('.editBtn')
            let trashBtn = todo.querySelector('.trashBtn')

            editBtn.disabled = true
            trashBtn.disabled = true
        }else{
            // Разблокируем основные кнопки
            let editBtn = todo.querySelector('.editBtn')
            let trashBtn = todo.querySelector('.trashBtn')


            editBtn.disabled = false
            trashBtn.disabled = false
        }
        


        let todoNode = todo.parentNode
        let todoParentLastCount = todo.parentNode.innerText
        editLocalStorage(todoParentLastCount, todoNode)

    }

    //РЕДАКТИРОВАНИЕ ЗАДАЧИ
    if(item.classList[0] === 'editBtn'){
        //Обертка кнопок подтверждения и удаления
        let todo = item.parentNode
        let todoParent = todo.parentNode
        if(!document.querySelector('.editInput')){
            let editInput = document.createElement('input')
            editInput.setAttribute('maxLength', '64')
            editInput.value = todo.parentNode.innerText
            todoParent.childNodes[0].remove()
            editInput.classList.add('editInput')
            todo.parentNode.append(editInput)

            // Создаём кнопку для подтверждения редактирования
            let confirmEditBtn = document.createElement('button')
            confirmEditBtn.classList.add('confirmEditBtn')
            confirmEditBtn.innerHTML = '<i class = "fas fa-check"></i>'
            todo.append(confirmEditBtn)


            // Удаляем основные кнопки интерфейса
            let confirmBtn = todo.querySelector('.confirmBtn')
            let trashBtn = todo.querySelector('.trashBtn')
            let editBtn = todo.querySelector('.editBtn')


            confirmBtn.remove()
            trashBtn.remove()
            editBtn.remove()
        }else{
            return
        }
        
        //ФУНКЦИЯ РЕДАКТИРОВАНИЯ
        editTasks(todoParent)
        
    }
    
    //УДАЛЕНИЕ ЗАДАЧИ
    if(item.classList[0] === 'trashBtn'){
        //Обертка кнопок подтверждения и удаления
        let todo = item.parentElement
        
        todo.parentNode.classList.add('fall')
        todo.parentNode.addEventListener('transitionend', function(event){
            todo.parentNode.remove()  
        })
        
        deleteTasks(todo.parentNode.innerText)
    }
}

// Функция кнопки очистки задач (Clear All)
function clearBtn(){
        while(toDoList.lastChild){
                toDoList.lastChild.remove()
        }
        localStorage.clear()
}

function filter(event){
    let tasks = Array.from(toDoList.children)
    
    tasks.forEach(function(task){
        if(event.target.value == 'all'){
            task.style.display = 'flex'
        }

        if(event.target.value == 'progress'){
            if(!task.classList.contains('performTask')){
                task.style.display = 'flex'
            }else{
                task.style.display = 'none'
            }
        }
        
        if(event.target.value == 'perfomed'){
            if(task.classList.contains('performTask')){
                task.style.display = 'flex'
            }else{
                task.style.display = 'none'
            }
        }
    })

}


// Функция сохранения (добавления) задач в localStorage
function saveLocalStorage(task){
    let tasks;

    if(localStorage.getItem('tasks') === null){
        tasks = []
    
    }else{
        tasks = JSON.parse(localStorage.getItem('tasks'))
    }
    tasks.push([[task.value],[task.classList[1]]])
    localStorage.setItem('tasks', JSON.stringify(tasks))

}

//Функция генерирации сохраенных задач на странице из local.storage
function getTasks(){
    let tasks;

    if(localStorage.getItem('tasks') === null){
        tasks = []
    
    }else{
        tasks = JSON.parse(localStorage.getItem('tasks'))
    }
    
    localStorage.setItem('tasks', JSON.stringify(tasks))

    tasks.forEach(function(todo){
        let task = document.createElement('li')

        if(todo[1] == 'performTask'){
            task.classList.add('list__item')
            task.classList.add('performTask')
        }else{
            task.classList.add('list__item')
        }

        task.innerText = todo[0]
        toDoList.append(task)


        //Создаем кнопку подтверждения
        let confirm = document.createElement('button')
        confirm.classList.add('confirmBtn')
        confirm.innerHTML = '<i class = "fas fa-check"></i>'


         //Создаем кнопку удаления
         let trash = document.createElement('button')
         trash.classList.add('trashBtn')
         trash.innerHTML = '<i class="fas fa-trash"></i>'
        
        
         //Создаем кнопку редактирования
         let edit = document.createElement('button')
         edit.classList.add('editBtn')
         edit.innerHTML = '<i class="fas fa-edit"></i>'


         let buttonsDiv = document.createElement('div')
         buttonsDiv.classList.add('buttonsDiv')
         task.append(buttonsDiv)

        buttonsDiv.append(confirm)
        buttonsDiv.append(edit)
        buttonsDiv.append(trash)
    })
}

// Фукнция удаления задач по кнопке (delete)
function deleteTasks(task){
    let tasks;

    if(localStorage.getItem('tasks') === null){
        tasks = []
    
    }else{
        tasks = JSON.parse(localStorage.getItem('tasks'))
    }

    tasks.splice(tasks.indexOf(task), 1)

    localStorage.setItem('tasks', JSON.stringify(tasks))
}


// Функция реадктирования задач
function editTasks(todoParent){
    let edit = todoParent.querySelector('.editInput')
    let todoParentLastCount = todoParent.innerText;
    let confirmEditBtn = document.querySelector('.confirmEditBtn')

    // Изменяем задачу по клику
    confirmEditBtn.addEventListener('click', function(event){
        if(edit.value == '') return
            // Изменяем значение текста задачи на нужное
            todoParent.innerText = edit.value
            
            //После добавления текста, заново генирируем кнопки
            
            //Создаём кнопку подтверждения выполнения задачи
            let confirm = document.createElement('button')
            confirm.classList.add('confirmBtn')
            confirm.innerHTML = '<i class = "fas fa-check"></i>'


            //Создаем кнопку удаления
            let trash = document.createElement('button')
            trash.classList.add('trashBtn')
            trash.innerHTML = '<i class="fas fa-trash"></i>'

            //Создаём кнопку редактирования
            let editBtn = document.createElement('button')
            editBtn.classList.add('editBtn')
            editBtn.innerHTML = '<i class="fas fa-edit"></i>'


            let buttonsDiv = document.createElement('div')
            buttonsDiv.classList.add('buttonsDiv')
            todoParent.append(buttonsDiv)

            buttonsDiv.append(confirm)
            buttonsDiv.append(editBtn)
            buttonsDiv.append(trash)

            edit.remove()

            //Сохраняем изменения в local.storage
            editLocalStorage(todoParentLastCount, todoParent)
    })
    
    // Изменяем задачу по кнопке
    edit.addEventListener('keyup', function(event){
        if(event.key == 'Enter'){
            //Изменяем значение текста задачи на нужное
            todoParent.innerText = edit.value
            
            //После добавления текста, заново генирируем кнопки
            
            //Создаём кнопку подтверждения выполнения задачи
            let confirm = document.createElement('button')
            confirm.classList.add('confirmBtn')
            confirm.innerHTML = '<i class = "fas fa-check"></i>'


            //Создаем кнопку удаления
            let trash = document.createElement('button')
            trash.classList.add('trashBtn')
            trash.innerHTML = '<i class="fas fa-trash"></i>'

            //Создаём кнопку редактирования
            let editBtn = document.createElement('button')
            editBtn.classList.add('editBtn')
            editBtn.innerHTML = '<i class="fas fa-edit"></i>'


            let buttonsDiv = document.createElement('div')
            buttonsDiv.classList.add('buttonsDiv')
            todoParent.append(buttonsDiv)

            buttonsDiv.append(confirm)
            buttonsDiv.append(editBtn)
            buttonsDiv.append(trash)

            edit.remove()

            
            //Сохраняем изменения в local.storage
            editLocalStorage(todoParentLastCount, todoParent)
        }
            
    })

}


// Фукнция редактирования localStorage при изменении задачи
function editLocalStorage(todoParentLastCount, task){
    let tasks;
    let mapTasks;
    if(localStorage.getItem('tasks') === null){
        tasks = []
    
    }else{
        tasks = JSON.parse(localStorage.getItem('tasks'))

        mapTasks = tasks.map((item, index) =>{
            if(todoParentLastCount == tasks[index][0][0]){
                return tasks[index] = [[task.innerText],[task.classList[1]]]
            }else{
                return tasks[index]
            }
        })

        localStorage.setItem('tasks', JSON.stringify(mapTasks))
    }
}