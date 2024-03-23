// const BACKEND_ROOT_URL = 'http://localhost:3001'
const BACKEND_ROOT_URL = 'https://todo-server-h6k5.onrender.com'
import { Todos } from "./class/Todo.js"

const todos = new Todos(BACKEND_ROOT_URL)

const list = document.querySelector('ul')
const input = document.querySelector('input')

input.disabled = true 

// input.addEventListener('keypress',(event) => {
// if (event.key === 'Enter') { 
//     event.preventDefault()
//     const task = input.value.trim()
//     if (task !== '') {
//         const li = document.createElement('li')
//         li.setAttribute('class','list-group-item')
//         li.innerHTML= task
//         list.append(li)
//         input.value =''
//     }
// }
// })

const renderTask = (task) => {
    const li = document.createElement('li')
    li.setAttribute('class','list-group-item')
    li.setAttribute('data-key',task.getId().toString())
    renderSpan(li,task.getText())
    renderLink(li,task.getId())
    list.append(li) // if we type prepend instead of append then the latest task come up at first
    list.scrollTop = list.scrollHeight; 
}

const renderSpan = (li,text) => {
    const span = li.appendChild(document.createElement('span'))
    span.innerHTML = text
}

const renderLink = (li, id) => {
    const a = li.appendChild(document.createElement('a'))
    a.innerHTML = '<i class="bi bi-trash"></i>'
    a.setAttribute('style','float: right')
    a.addEventListener('click',(event) => { 
        var confirmation = confirm("Are you sure you want to delete this task?");
        
        // Check if user confirmed
        if (confirmation) {
            // Code to execute if confirmed
            todos.removeTask(id).then((removed_id) => { 
                const li_to_remove = document.querySelector(`[data-key='${removed_id}']`)
                if (li_to_remove) {
                    list.removeChild(li_to_remove)
                    alert("Task Deleted!")
                    
                }
            }).catch((error) => {
                alert(error)
            })
            
        } else {
            // Code to execute if canceled
            alert("Delete failed.");
        }
        
    })
}
        




input.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault()
        const task = input.value.trim()
        if (task !== '') { 
            todos.addTask(task).then((task) => {
                renderTask(task)
                input.value = ''
                input.focus ()
            })
        }
    }
})



// const getTasks = async () => {
//     try {
//         const response = await fetch (BACKEND_ROOT_URL)
//         const json = await response.json()
//         json.forEach(task => {
//             renderTask(task.description)
//         })
//         input.disabled = false
//     } catch (error) {
//         alert("Error retrieving tasks" + error.message)
//     }
// }

const getTasks = () => {
    todos.getTasks().then((tasks) => {
        tasks.forEach(task => {
            renderTask(task)
        })
        input.disabled = false
    }).catch((error) => {
        alert(error)
    })
}

const saveTask = async (task) => {
    try {
        const json = JSON.stringify({description: task})
        const response = await fetch(BACKEND_ROOT_URL + '/new', {
            method: 'post',
            headers: {
                'Content-Type':'application/json'
            },
            body: json
        })
        return response.json()
    } catch (error) {
        alert("Error saving task" + error.message)
    }
}

getTasks()








