let backBtn = document.getElementById("projects")
backBtn.addEventListener("click", function (e) {
    let table = document.getElementById("populate_table")
    table.style.display = ""
    let form = document.getElementById("form_cell")
    console.log(form)
    form.style.display = "none"
})
let button = document.getElementById("add")
button.addEventListener("click", async function addData(e) {
    let table = document.getElementById("populate_table")
    table.style.display = "none"
    let form = document.getElementById("form_cell")
    console.log(form)
    form.style.display = "block"
    let submitbtn = document.getElementById("submitBtn")
    submitbtn.addEventListener("click", async function saveProject(e) {
        let value2 = document.getElementById("task_name").value.trim();
        let value3 = document.getElementById("task_description").value;
        if (!value2 || !value3) {
            e.preventDefault()
        }
        console.log(value2, value3)
        const postData = {
            "task": value2,
            "description": value3
        }
        let response = await fetch("http://localhost:8080/tasks/save", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData),
        }
        )
        let data = await response.json()
        console.log(data)
        if (response.status === 201) {
            alert(`${data.message}`)
        }
        if (response.status === 400 || response.status === 500) {
            alert(`${data.message}`)
            e.preventDefault();
        }
    }

    )
}

)

function createCell(title) {
    const cell = document.createElement('td');
    cell.style.width = "150px";
    cell.style.height = "70px";
    cell.style.textAlign = "center";
    cell.style.fontSize = "20px";
    cell.style.border = "1px solid black";
    cell.textContent = `${title}`;
    return cell;
}
function buttoncell() {
    const cell = document.createElement('td');
    cell.style.width = "150px";
    cell.style.height = "70px";
    cell.style.wordWrap = "break-word";
    cell.style.textAlign = "center";
    cell.style.fontSize = "20px";
    cell.style.border = "1px solid black";
    let updateBtn = document.createElement('button')
    updateBtn.setAttribute("class", "updateBtn")
    updateBtn.textContent = 'update'
    updateBtn.style.marginRight = "20px"
    let deleteBtn = document.createElement('button')
    deleteBtn.setAttribute("class", "deleteBtn")
    deleteBtn.textContent = 'delete'
    cell.appendChild(updateBtn)
    cell.appendChild(deleteBtn)
    return cell;
}
//for getting the project
async function fetchTasks(params) {
    let response = await fetch("http://localhost:8080/tasks/shows")
    let data = await response.json()
    if (response.status === 200) {
        let populate_table = document.getElementById("populate_table")
        let tbody = populate_table.querySelector('tbody')
        tbody.innerHTML = ""
        data.forEach(rowData => {
            row1 = document.createElement('tr');

            const newCel = createCell(rowData._id)
            newCel.style.display = "none"
            row1.appendChild(newCel);

            const newCell = createCell(rowData.task)
            row1.appendChild(newCell);


            const newCell3 = createCell(rowData.description)
            row1.appendChild(newCell3);


            const newCell5 = buttoncell();
            row1.appendChild(newCell5)

            tbody.appendChild(row1);
            populate_table.appendChild(tbody);
        });
    }


}
fetchTasks()

//for updating the tasks
document.body.addEventListener("click", (e) => {
    if (e.target.matches(".updateBtn")) {
        const rowtoScore = e.target.closest('tr')
        let task_id = rowtoScore.querySelectorAll("td")[0].textContent
        console.log(task_id)
        async function getTask(params) {
            let response = await fetch(`http://localhost:8080/tasks/show?id=${task_id}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                },
            }
            )
            let data = await response.json()
            let table = document.getElementById("populate_table")
            table.style.display = "none"
            let form_cell = document.getElementById("form_cell")
            console.log(form_cell)
            form_cell.style.display = "block"
            data.forEach(rowData => {
                let task_id = document.getElementById("task_id")
                task_id.value = `${rowData._id}`
                console.log(task_id)

                let task_name = document.getElementById("task_name")
                task_name.value = `${rowData.task}`
                console.log(task_name)

                let task_description = document.getElementById("task_description")
                task_description.value = `${rowData.description}`
                console.log(task_description)


            })
        };
        getTask()
        let button = document.getElementById("add")
        button.style.display = "none"
        document.getElementById("submitBtn").addEventListener("click", async function updateData(e) {
            let value1 = document.getElementById("task_id").value;
            let value2 = document.getElementById("task_name").value.trim();
            let value3 = document.getElementById("task_description").value
            console.log(value2, value3)
            if (!value2 || !value3) {
                alert("all values are required")
                e.preventDefault()
            }
            const postData = {
                _id: value1,
                task: value2,
                description: value3
            };
            const url = `http://localhost:8080/tasks/update`
            console.log(postData)
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData),
            })
            const data = await response.json();
            console.log(data)
            if (response.status == 200) {
                alert(`${data.message}`)
                let button = document.getElementById("add")
                button.style.display = ""
            }
            if (response.status == 400) {
                e.preventDefault();
                alert(`${data.message}`)
            }
        })
    }

    if (e.target.matches(".deleteBtn")) {
        const rowtoScore = e.target.closest('tr')
        let task_name = rowtoScore.querySelectorAll("td")[1].textContent
        async function deleteTask(params) {
            let postData = {
                task: task_name
            }
            console.log(postData)
            const url = `http://localhost:8080/tasks/delete`
            console.log(postData)
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData),
            })
            const data = await response.json();
            console.log(data)
            if (response.status == 200) {
                alert(`${data.message}`)
                fetchTasks()
            }
            if (response.status === 400 || response.status === 500) {
                alert(`${data.message}`)
            }

        }
        deleteTask()

    }
})

let inputElement = document.getElementById("task_name")

inputElement.addEventListener('change', async function (e) {
    let value = e.target.value.toLowerCase().trim();
    let response = await fetch(`http://localhost:8080/tasks/get?name=${value}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
        },
    }
    )
    let data = await response.json()
    if (data.length > 0) {
        alert("task already exists")
    }
});


