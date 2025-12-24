setInterval(() => {
    let cookie = document.cookie
    if (cookie === "") {
        window.location.href = "http://localhost:8080/users/login/page"
    }
}, 1000)
let button = document.getElementById("add")
button.addEventListener("click", async function addData(e) {
    let table = document.getElementById("populate_table")
    table.style.display = "none"
    getForm()
    let submitbtn = document.getElementById("submitBtn")
    submitbtn.addEventListener("click", async function saveProject(e) {
        let value1 = document.getElementById("dates").value;
        let value2 = document.getElementById("taskName").value.toLowerCase().trim();
        let value3 = document.getElementById("taskDescription").value;
        console.log(value1, value2, value3)
        const postData = {
            "date": value1,
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

            const newCel = createCell(rowData.date)
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
        let task_name = rowtoScore.querySelectorAll("td")[1].textContent
        async function getTask(params) {
            let response = await fetch(`http://localhost:8080/tasks/show?name=${task_name}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                },
            }
            )
            let data = await response.json()
            let table = document.getElementById("populate_table")
            table.style.display = "none"
            data.forEach(rowData => {
                let form_cell = document.getElementById("form_cell")
                if (!form_cell) {
                    let form_cell = document.createElement("form")
                    form_cell.setAttribute("id", "form_cell")
                    let lable1 = document.createElement("label")
                    lable1.for = 'taskdate'
                    lable1.textContent = "Task Date"
                    lable1.style.marginRight = "20px"
                    form_cell.appendChild(lable1)

                    let input1 = document.createElement("input")
                    input1.type = "date"
                    input1.min = "2024-01-01"
                    input1.max = "2025-12-31"
                    input1.id = "dates"
                    input1.value = `${rowData.date}`
                    input1.style.width = "300px"
                    input1.style.marginRight = "40px"
                    form_cell.appendChild(input1)

                    let lable = document.createElement("label")
                    lable.for = 'task_name'
                    lable.textContent = "Task Name"
                    lable.style.marginRight = "20px"
                    form_cell.appendChild(lable)

                    let input = document.createElement("input")
                    input.type = "text"
                    input.style.width = "300px"
                    input.id = "task_name"
                    input.readOnly = true
                    input.value = `${rowData.task}`
                    input.style.marginTop = "20px"
                    input.style.marginRight = "20px"
                    form_cell.appendChild(input)

                    let lable2 = document.createElement("label")
                    lable2.for = 'taskName'
                    lable2.textContent = "New Name"
                    lable2.style.marginRight = "20px"
                    form_cell.appendChild(lable2)

                    let input2 = document.createElement("input")
                    input2.type = "text"
                    input2.style.width = "300px"
                    input2.id = "taskName"
                    input2.value = `${rowData.task}`
                    input2.style.marginTop = "20px"
                    input2.style.marginRight = "20px"
                    form_cell.appendChild(input2)

                    let lable3 = document.createElement("label")
                    lable3.for = 'taskDescription'
                    lable3.textContent = "Task Description"
                    lable3.style.marginRight = "20px"
                    form_cell.appendChild(lable3)

                    let input3 = document.createElement("input")
                    input3.type = "text"
                    input3.value = `${rowData.description}`
                    input3.style.width = "300px"
                    input3.style.marginTop = "20px"
                    input3.style.marginRight = "30px"
                    input3.id = "taskDescription"
                    form_cell.appendChild(input3)

                    let submitbtn = document.createElement("button")
                    submitbtn.textContent = "submit"
                    submitbtn.style.flexBasis = "70%"
                    submitbtn.id = "submitBtn"
                    form_cell.appendChild(submitbtn)
                    document.getElementById("result").appendChild(form_cell)
                    submitbtn.addEventListener("click", async function (e) {
                        let o_value = document.getElementById("task_name").value.toLowerCase().trim();
                        let value1 = document.getElementById("dates").value;
                        let value2 = document.getElementById("taskName").value.toLowerCase().trim();
                        let value3 = document.getElementById("taskDescription").value;
                        let postData = {
                            oname: o_value,
                            date: value1,
                            task: value2,
                            description: value3
                        }
                        console.log(postData)
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
                        }
                        if (response.status === 400 || response.status === 500) {
                            alert(`${data.message}`)
                        }
                    })
                }
            });

        }
        getTask()

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

async function getForm() {
    let form_cell = document.getElementById("form_cell")
    if (!form_cell) {
        let form_cell = document.createElement("form")
        form_cell.setAttribute("id", "form_cell")
        let lable1 = document.createElement("label")
        lable1.for = 'taskdate'
        lable1.textContent = "Task Date"
        lable1.style.marginRight = "20px"
        form_cell.appendChild(lable1)

        let input1 = document.createElement("input")
        input1.type = "date"
        input1.min = "2024-01-01"
        input1.max = "2025-12-31"
        input1.id = "dates"
        input1.style.width = "300px"
        input1.style.marginRight = "40px"
        form_cell.appendChild(input1)

        let lable2 = document.createElement("label")
        lable2.for = 'taskName'
        lable2.textContent = "Task Name"
        lable2.style.marginRight = "20px"
        form_cell.appendChild(lable2)

        let input2 = document.createElement("input")
        input2.type = "text"
        input2.style.width = "300px"
        input2.id = "taskName"
        input2.style.marginTop = "20px"
        input2.style.marginRight = "20px"
        form_cell.appendChild(input2)

        let lable3 = document.createElement("label")
        lable3.for = 'taskDescription'
        lable3.textContent = "Task Description"
        lable3.style.marginRight = "20px"
        form_cell.appendChild(lable3)

        let input3 = document.createElement("input")
        input3.type = "text"
        input3.style.width = "300px"
        input3.style.marginTop = "20px"
        input3.style.marginRight = "30px"
        input3.id = "taskDescription"
        form_cell.appendChild(input3)

        let submitbtn = document.createElement("button")
        submitbtn.textContent = "submit"
        submitbtn.style.flexBasis = "70%"
        submitbtn.id = "submitBtn"
        form_cell.appendChild(submitbtn)
        document.getElementById("result").appendChild(form_cell)
    }
}
