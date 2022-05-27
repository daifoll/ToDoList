// КОНСТАНТЫ
const form = document.querySelector('#todo__form')
const input = document.querySelector('.todo__input')
const addBtn = document.querySelector('.add__btn')
const toDoList = document.querySelector('.todo__list')
const wrapper = document.querySelector('.wrapper')
const clearAllBtn = document.querySelector('.clearAllBtn')
const select = document.querySelector('.select')

// EVENTS
document.addEventListener('DOMContentLoaded', getTasks)
addBtn.addEventListener('click', addTask)
toDoList.addEventListener('click', checkTask)
clearAllBtn.addEventListener('click', clearBtn)
select.addEventListener('change', filter)

// ФУНКЦИИ
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

function checkTask(event){
    const item  = event.target

    //ВЫПОЛНЕННАЯ ЗАДАЧА
    if(item.classList[0] === 'confirmBtn'){
        //Обертка кнопок подтверждения и удаления
        let todo = item.parentNode

        //Зачёркиваем выполнения задания относительно блока с кнопками - confirmParent
        todo.parentNode.classList.toggle('performTask')

        let todoNode = todo.parentNode

        checkConfirm(todoNode)


    }

    //РЕДАКТИРОВАНИЕ ЗАДАЧИ
    if(item.classList[0] === 'editBtn'){
        //Обертка кнопок подтверждения и удаления
        let todo = item.parentNode
        let todoParent = todo.parentNode
        
        if(!document.querySelector('.editInput')){
            // Создаем поле для редактирования
            let editInput = document.createElement('input')
            editInput.value = todo.parentNode.innerText
            todoParent.childNodes[0].remove()
            editInput.classList.add('editInput')
            editInput.setAttribute('maxlength', '84')
            todo.parentNode.append(editInput)
            
            // Создаём кнопку подтверждения редактирования
            let confirmEditBtn = document.createElement('button')
            confirmEditBtn.classList.add('confirmEditBtn')
            confirmEditBtn.innerHTML = '<i class = "fas fa-check"></i>'
            todo.parentNode.append(confirmEditBtn)
            
            // Удаляем основные кнопки интерфейса
            let confirmBtn = document.querySelector('.confirmBtn')
            let trashBtn = document.querySelector('.trashBtn')
            let editBtn = document.querySelector('.editBtn')

            confirmBtn.remove();
            trashBtn.remove()
            editBtn.remove();
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

//Генерируем сохраенные задачи на странице из local.storage
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


function deleteTasks(task){
    let tasks;

    if(localStorage.getItem('tasks') === null){
        tasks = []
    
    }else{
        tasks = JSON.parse(localStorage.getItem('tasks'))
    }

    tasks.splice(tasks.indexOf(task), 1)
    console.log(tasks)
    localStorage.setItem('tasks', JSON.stringify(tasks))
}

function editTasks(todoParent){
    let edit = document.querySelector('.editInput')
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
            checkConfirm(todoParent)
    })
    // Изменяем задачу по кнопке
    edit.addEventListener('keyup', function(event){
        if(event.key == 'Enter'){
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
            checkConfirm(todoParent)
        }
            
    })

}

function checkConfirm(task){
    let tasks;
    let mapTasks;
    if(localStorage.getItem('tasks') === null){
        tasks = []
    
    }else{
        tasks = JSON.parse(localStorage.getItem('tasks'))
    }

    // tasks.splice(tasks.indexOf(task), 1)
    mapTasks = tasks.map(function(item, index){
        if(task.innerText == tasks[index][0]){
            return tasks[index] = [[task.innerText],[task.classList[1]]]
        }else{
            return tasks[index] = [[task.innerText],[null]]
        }
    })
    localStorage.setItem('tasks', JSON.stringify(mapTasks))
    console.log(task.innerText)
}
