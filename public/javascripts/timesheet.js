setInterval(() => {
    let cookie = document.cookie
    if (cookie === "") {
        window.location.href = "http://localhost:8080/users/login/page"
    }
}, 1000)


document.getElementById("projects").addEventListener("click", getProjects)
async function getProjects() {
    window.location.href = "http://localhost:8080/projects/page"
}

document.getElementById("tasks").addEventListener("click", getProjects2)
async function getProjects2() {
    window.location.href = "http://localhost:8080/tasks/page"
}

document.getElementById("add").addEventListener("click", async function addData(params) {
    let table = document.getElementById("populate_table")
    table.style.display = "none"

    let form_cell = document.getElementById("form_cell")
    if (!form_cell) {
        let newDiv = document.getElementById("result")
        let form_cell = document.createElement("form")
        form_cell.setAttribute("id", "form_cell")
        newDiv.appendChild(form_cell)
        let lable1 = document.createElement("label")
        lable1.for = 'dates'
        lable1.textContent = "Enter date"
        lable1.style.marginRight = "20px"
        form_cell.appendChild(lable1)

        let input1 = document.createElement("input")
        input1.type = "date"
        let today = new Date()
        console.log(today)
        let day = today.getDate()
        let month = (today.getMonth() + 1)
        let year = (today.getFullYear())
        let formattedDate = `${year}-${month}-${day}`
        console.log(formattedDate)
        input1.min = `2025-01-01`
        input1.max = `${formattedDate}`
        input1.id = "taskDate"
        input1.style.width = "300px"
        input1.style.marginRight = "40px"
        form_cell.appendChild(input1)
        form_cell.appendChild(input1)


        let lable2 = document.createElement("label")
        lable2.for = 'select_project'
        lable2.textContent = "Enter project"
        lable2.style.marginRight = "20px"
        form_cell.appendChild(lable2)

        let select = document.createElement("select");
        select.id = "select_project";
        select.style.width = "300px";
        select.style.marginTop = "20px";
        select.style.marginRight = "20px";

        //for getting the project
        async function fetchProjects() {
            let response = await fetch("http://localhost:8080/projects/show", {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                },
            }
            )
            let data = await response.json()
            console.log(data)
            data.forEach(Element => {
                let option = document.createElement("option");
                option.value = Element.project;
                option.textContent = Element.project;
                select.appendChild(option);
            });
        }
        fetchProjects()
        form_cell.appendChild(select)
        //for the task
        let lable3 = document.createElement("label")
        lable3.for = 'taskDescription'
        lable3.textContent = "Enter task"
        lable3.style.marginRight = "20px"
        form_cell.appendChild(lable3)

        let select2 = document.createElement("select");
        select2.id = "select_task";
        select2.style.width = "300px";
        select2.style.marginTop = "20px";
        select2.style.marginRight = "20px";

        //for getting the task
        async function fetchProjects2() {
            let response = await fetch("http://localhost:8080/tasks/shows", {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                },
            }
            )
            let data = await response.json()
            console.log(data)
            data.forEach(Element => {
                let option = document.createElement("option");
                option.value = Element.task;
                option.textContent = Element.task;
                select2.appendChild(option);
            });
        }
        fetchProjects2()
        form_cell.appendChild(select2)


        //for the description
        let lable4 = document.createElement("label")
        lable4.for = 'description'
        lable4.textContent = "Description"
        lable4.style.marginRight = "20px"
        form_cell.appendChild(lable4)

        let input2 = document.createElement("textarea")
        input2.type = "text"
        input2.style.width = "300px"
        input2.id = "description"
        input2.maxLength = 200
        input2.style.marginTop = "20px"
        input2.style.marginRight = "20px"
        form_cell.appendChild(input2)

        //for the hrs to work
        let lable5 = document.createElement("label")
        lable5.for = 'work_hrs'
        lable5.textContent = "hrs to work"
        lable5.style.marginRight = "20px"
        form_cell.appendChild(lable5)

        let input3 = document.createElement("input")
        input3.type = "number"
        input3.style.width = "300px"
        input3.id = "work_hrs"
        input3.min = 0
        input3.max = 24
        input3.style.marginTop = "20px"
        input3.style.marginRight = "20px"
        form_cell.appendChild(input3)

        //for the remark
        let lable6 = document.createElement("label")
        lable6.for = 'remark'
        lable6.textContent = "remark"
        lable6.style.marginRight = "20px"
        form_cell.appendChild(lable6)

        let input4 = document.createElement("input")
        input4.type = "text"
        input4.style.width = "300px"
        input4.id = "remark"
        input3.style.marginTop = "20px"
        input3.style.marginRight = "20px"
        form_cell.appendChild(input4)

        let submitbtn = document.createElement("button")
        submitbtn.textContent = "submit"
        submitbtn.style.flexBasis = "70%"
        submitbtn.id = "submitBtn"
        submitbtn.style.marginLeft = "20px"
        form_cell.appendChild(submitbtn)

        submitbtn.addEventListener("click", async function saveData(e) {
            // e.preventDefault()
            let value1 = document.getElementById("taskDate").value;
            let value2 = document.getElementById("select_project").value.trim();
            let value3 = document.getElementById("select_task").value.trim();
            let value4 = document.getElementById("description").value.toLowerCase().trim();
            let value5 = document.getElementById("work_hrs").value.trim();
            let value6 = document.getElementById("remark").value;
            const postData = {
                date: value1,
                project: value2,
                task: value3,
                description: value4,
                work_hrs: value5,
                remark: value6
            }
            let response = await fetch("http://localhost:8080/home/save", {
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
                e.preventDefault()
                alert(`${data.message}`)
            }
        })

    }
})

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

async function getData() {
    let response = await fetch("http://localhost:8080/home/shows", {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
        },
    }
    )
    let data = await response.json()
    if (response.status === 200) {
        let table = document.getElementById("populate_table")
        console.log(table)
        let tbody = table.querySelector("tbody")
        tbody.innerHTML = ""
        data.forEach((rowData) => {
            row1 = document.createElement('tr');

            const newId = createCell(rowData._id)
            newId.style.display = "none"
            row1.appendChild(newId);

            const newCel = createCell(rowData.date)
            row1.appendChild(newCel);

            const newCell = createCell(rowData.project)
            row1.appendChild(newCell);


            const newCell3 = createCell(rowData.task)
            row1.appendChild(newCell3);

            const newCell4 = createCell(rowData.description)
            row1.appendChild(newCell4);

            const newCell6 = createCell(rowData.work_hrs)
            row1.appendChild(newCell6);

            const newCell7 = createCell(rowData.remark)
            row1.appendChild(newCell7);

            const newCell5 = buttoncell();
            row1.appendChild(newCell5)

            tbody.appendChild(row1);
            populate_table.appendChild(tbody);

        })
    }



}
getData()

document.body.addEventListener("click", (e) => {
    if (e.target.matches(".updateBtn")) {
        console.log("button clicked")
        const rowtoScore = e.target.closest('tr')
        let timesheet_id = rowtoScore.querySelectorAll("td")[0].textContent
        console.log(timesheet_id)
        async function getSheet() {
            let response = await fetch(`http://localhost:8080/home/show/?id=${timesheet_id}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                },
            }
            )
            let data = await response.json()
            console.log(data)
            let table = document.getElementById("populate_table")
            table.style.display = "none"
            data.forEach((rowData) => {
                let form_cell = document.getElementById("form_cell")
                if (!form_cell) {
                    let newDiv = document.getElementById("result")
                    let form_cell = document.createElement("form")
                    form_cell.setAttribute("id", "form_cell")
                    newDiv.appendChild(form_cell)
                    let lable1 = document.createElement("label")
                    lable1.for = 'dates'
                    lable1.textContent = "Enter date"
                    lable1.style.marginRight = "20px"
                    form_cell.appendChild(lable1)

                    let input1 = document.createElement("input")
                    input1.type = "date"
                    let today = new Date()
                    console.log(today)
                    let day = today.getDate()
                    let month = (today.getMonth() + 1)
                    let year = (today.getFullYear())
                    let formattedDate = `${year}-${month}-${day}`
                    console.log(formattedDate)
                    input1.min = `2025-01-01`
                    input1.max = `${formattedDate}`
                    input1.id = "taskDate"
                    input1.style.width = "300px"
                    input1.style.marginRight = "40px"
                    input1.value = `${rowData.date}`
                    form_cell.appendChild(input1)
                    form_cell.appendChild(input1)


                    let lable2 = document.createElement("label")
                    lable2.for = 'select_project'
                    lable2.textContent = "Enter project"
                    lable2.style.marginRight = "20px"
                    form_cell.appendChild(lable2)

                    let select = document.createElement("select");
                    select.id = "select_project";
                    select.style.width = "300px";
                    select.style.marginTop = "20px";
                    select.style.marginRight = "20px";

                    //for getting the project
                    async function fetchProjects() {
                        let response = await fetch("http://localhost:8080/projects/show", {
                            method: "GET",
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        }
                        )
                        let data = await response.json()
                        console.log(data)
                        data.forEach(Element => {
                            let option = document.createElement("option");
                            option.value = Element.project;
                            option.textContent = Element.project;
                            select.appendChild(option);
                        });
                        select.value = `${rowData.project}`
                    }

                    fetchProjects()
                    form_cell.appendChild(select)
                    //for the task
                    let lable3 = document.createElement("label")
                    lable3.for = 'taskDescription'
                    lable3.textContent = "Enter task"
                    lable3.style.marginRight = "20px"
                    form_cell.appendChild(lable3)

                    let select2 = document.createElement("select");
                    select2.id = "select_task";
                    select2.style.width = "300px";
                    select2.style.marginTop = "20px";
                    select2.style.marginRight = "20px";

                    //for getting the task
                    async function fetchProjects2() {
                        let response = await fetch("http://localhost:8080/tasks/shows", {
                            method: "GET",
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        }
                        )
                        let data = await response.json()
                        console.log(data)
                        data.forEach(Element => {
                            let option = document.createElement("option");
                            option.value = Element.task;
                            option.textContent = Element.task;
                            select2.appendChild(option);
                        });
                        select2.value = `${rowData.task}`
                    }
                    fetchProjects2()
                    form_cell.appendChild(select2)


                    //for the description
                    let lable4 = document.createElement("label")
                    lable4.for = 'description'
                    lable4.textContent = "Description"
                    lable4.style.marginRight = "20px"
                    form_cell.appendChild(lable4)

                    let input2 = document.createElement("textarea")
                    input2.type = "text"
                    input2.style.width = "300px"
                    input2.id = "description"
                    input2.maxLength = 200
                    input2.style.marginTop = "20px"
                    input2.style.marginRight = "20px"
                    input2.value = `${rowData.description}`
                    form_cell.appendChild(input2)

                    //for the hrs to work
                    let lable5 = document.createElement("label")
                    lable5.for = 'work_hrs'
                    lable5.textContent = "hrs to work"
                    lable5.style.marginRight = "20px"
                    form_cell.appendChild(lable5)

                    let input3 = document.createElement("input")
                    input3.type = "number"
                    input3.style.width = "300px"
                    input3.id = "work_hrs"
                    input3.min = 0
                    input3.max = 24
                    input3.style.marginTop = "20px"
                    input3.style.marginRight = "20px"
                    input3.value = `${rowData.work_hrs}`
                    form_cell.appendChild(input3)

                    //for the remark
                    let lable6 = document.createElement("label")
                    lable6.for = 'remark'
                    lable6.textContent = "remark"
                    lable6.style.marginRight = "20px"
                    form_cell.appendChild(lable6)

                    let input4 = document.createElement("input")
                    input4.type = "text"
                    input4.style.width = "300px"
                    input4.id = "remark"
                    input4.style.marginTop = "20px"
                    input4.style.marginRight = "20px"
                    input4.value = `${rowData.remark}`
                    form_cell.appendChild(input4)

                    //for getting the id of the timesheet
                    console.log(rowData._id)
                    let input5 = document.createElement("input")
                    input5.type = "text"
                    input5.style.display = "none"
                    input5.style.width = "300px"
                    input5.id = "timesheet_id"
                    input5.style.marginTop = "20px"
                    input5.style.marginRight = "20px"
                    input5.value = `${rowData._id}`
                    form_cell.appendChild(input5)
                    console.log(input5)

                    let submitbtn = document.createElement("button")
                    submitbtn.textContent = "submit"
                    submitbtn.style.flexBasis = "70%"
                    submitbtn.id = "submitBtn"
                    submitbtn.style.marginLeft = "20px"
                    form_cell.appendChild(submitbtn)

                    submitbtn.addEventListener("click", async function updateData(e) {
                        let value = document.getElementById("timesheet_id").value
                        let value1 = document.getElementById("taskDate").value;
                        let value2 = document.getElementById("select_project").value;
                        let value3 = document.getElementById("select_task").value;
                        let value4 = document.getElementById("description").value;
                        let value5 = document.getElementById("work_hrs").value;
                        let value6 = document.getElementById("remark").value;
                        console.log(value, value1, value2, value3, value4, value5, value6)
                        const postData = {
                            _id: value,
                            date: value1,
                            project: value2,
                            task: value3,
                            description: value4,
                            work_hrs: value5,
                            remark: value6
                        }
                        let response = await fetch("http://localhost:8080/home/update", {
                            method: "PUT",
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(postData),
                        }
                        )
                        let data = await response.json()
                        if (response.status === 200) {
                            alert(`${data.message}`)
                        }
                        if (response.status === 400 || response.status === 500) {
                            e.preventDefault();
                            alert(`${data.message}`)
                        }
                    })


                }
            })
        }
        getSheet()
    }
    if (e.target.matches(".deleteBtn")) {
        const rowtoScore = e.target.closest('tr')
        let timesheet_id = rowtoScore.querySelectorAll("td")[0].textContent
        console.log(timesheet_id)

        //for deleting the timesheet
        async function deleteRecord(params) {
            const postData = {
                "_id": timesheet_id
            }
            console.log(postData)
            let response = await fetch("http://localhost:8080/home/delete", {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData),
            }
            )
            let data = await response.json()
            console.log(data)
            if (response.status === 200) {
                alert(`${data.message}`)
            }
            if (response.status === 400 || response.status === 500) {
                alert(`${data.message}`)
            }
            getData()
        }
        deleteRecord()

    }
}
)

//search across the timesheet
let search_input = document.getElementById("search_sheet")
search_input.addEventListener("input", async function searchSheet(e) {
    let response = await fetch("http://localhost:8080/home/shows", {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
        },
    }
    )
    let data = await response.json()
    console.log(data)
    const value = e.target.value.trim().toLowerCase();
    console.log(value)
    let filteredSheet = data.filter((element) => {
        let projects = element.project.includes(value)
        let task = element.task.includes(value)
        return projects || task;
    })
    console.log(filteredSheet)
    let table = document.getElementById("populate_table")
    console.log(table)
    let tbody = table.querySelector("tbody")
    tbody.innerHTML = ""
    filteredSheet.forEach((rowData) => {
        row1 = document.createElement('tr');

        const newId = createCell(rowData._id)
        newId.style.display = "none"
        row1.appendChild(newId);

        const newCel = createCell(rowData.date)
        row1.appendChild(newCel);

        const newCell = createCell(rowData.project)
        row1.appendChild(newCell);


        const newCell3 = createCell(rowData.task)
        row1.appendChild(newCell3);

        const newCell4 = createCell(rowData.description)
        row1.appendChild(newCell4);

        const newCell6 = createCell(rowData.work_hrs)
        row1.appendChild(newCell6);

        const newCell7 = createCell(rowData.remark)
        row1.appendChild(newCell7);

        const newCell5 = buttoncell();
        row1.appendChild(newCell5)

        tbody.appendChild(row1);
        populate_table.appendChild(tbody);

    })

})

//for search by dates
let start_date = document.getElementById("start")
start_date.addEventListener("change", async function checkDate(e) {
    let value = e.target.value
    console.log(value)
    let endDate = document.getElementById("end")
    endDate.min = value
    searchDate()
})

let endDate = document.getElementById("end")
endDate.addEventListener("change", async function checkDate(e) {
    let value = e.target.value
    console.log(value)
    let start_date = document.getElementById("start")
    start_date.max = value
    searchDate()
})

/*let search_button = document.getElementById("search_date")
search_button.addEventListener("click", searchDate)*/

async function searchDate() {
    let value1 = document.getElementById("start").value
    let value2 = document.getElementById("end").value
    console.log(value1, value2)
    let url = `http://localhost:8080/home/getBydate?start=${value1}&end=${value2}`
    console.log(url)
    let response = await fetch(url)
    let data = await response.json();
    if (response.status === 400 || response.status === 500) {
        alert(`${data.message}`)
    }
    let table = document.getElementById("populate_table")
    console.log(table)
    let tbody = table.querySelector("tbody")
    tbody.innerHTML = ""
    if (response.status === 200) {
        data.forEach((rowData) => {
            row1 = document.createElement('tr');

            const newId = createCell(rowData._id)
            newId.style.display = "none"
            row1.appendChild(newId);

            const newCel = createCell(rowData.date)
            row1.appendChild(newCel);

            const newCell = createCell(rowData.project)
            row1.appendChild(newCell);


            const newCell3 = createCell(rowData.task)
            row1.appendChild(newCell3);

            const newCell4 = createCell(rowData.description)
            row1.appendChild(newCell4);

            const newCell6 = createCell(rowData.work_hrs)
            row1.appendChild(newCell6);

            const newCell7 = createCell(rowData.remark)
            row1.appendChild(newCell7);

            const newCell5 = buttoncell();
            row1.appendChild(newCell5)

            tbody.appendChild(row1);
            populate_table.appendChild(tbody);

        })
    }
}

//for checking the existance of the project/task
async function editTimesheet(params) {
    const rows = document.querySelectorAll("#populate_table tbody tr")
    for (let i = 0; i < rows.length; i++) {
        let column1 = rows[i].querySelectorAll("td")[2]
        let column2 = rows[i].querySelectorAll("td")[3]
        let project_name = column1.textContent
        let task_name = column2.textContent
        console.log(project_name)
        console.log(task_name)
        let response = await fetch(`http://localhost:8080/projects/shows?name=${project_name}`)
        if (response.status === 400) {
            alert(`${project_name} project does not exist please update`)
        }
        let response2 = await fetch(`http://localhost:8080/tasks/show?name=${task_name}`)
        if (response2.status === 400) {
            alert(`${task_name}  does not exist please update`)
        }

    }
    console.log(rows)
}


document.getElementById("logLink").addEventListener("click", async function logbtn(params) {
    let result = confirm("do you really want to log out?")
    if (result === true) {
        window.location.href = "http://localhost:8080/users/login/page?"
        document.cookie = "_id=; Max-Age=0; path=/";

    }
})

document.body.addEventListener("click", async function checkdata(params) {
    let response = await fetch("http://localhost:8080/home/check")
    let data = await response.json();
    console.log(data)
    if (response.status === 200) {
        let error = document.getElementById("error")
        error.textContent = `${data.message}`
    }
    if (response.status === 400) {
        let error = document.getElementById("error")
        error.textContent = `${data.message}`
    }
})


