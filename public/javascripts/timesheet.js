
let backBtn = document.getElementById("backbtn")
backBtn.addEventListener("click", function (e) {
    let table = document.getElementById("populate_table")
    table.style.display = ""
    let form = document.getElementById("form_cell")
    console.log(form)
    form.style.display = "none"
})

document.getElementById("add").addEventListener("click", async function addData(params) {
    let table = document.getElementById("populate_table")
    table.style.display = "none"

    let form_cell = document.getElementById("form_cell")
    form_cell.style.display = "block"

    let input1 = document.getElementById("taskDate")
    let today = new Date()
    console.log(today)
    let day = today.getDate()
    let month = (today.getMonth() + 1)
    let year = (today.getFullYear())
    let formattedDate = `${year}-${month}-${day}`
    console.log(formattedDate)
    input1.min = `2025-01-01`
    input1.max = `${formattedDate}`

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
        let select = document.getElementById("select_project")
        select.innerHTML = ""
        let emptyOption = document.createElement('option');
        emptyOption.value = '';
        emptyOption.textContent = '';
        select.prepend(emptyOption);
        data.forEach(Element => {
            let select = document.getElementById("select_project")
            let option = document.createElement("option");
            option.value = Element.project;
            option.textContent = Element.project;
            select.appendChild(option);
        });
    }
    fetchProjects()
    //for the task
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
        let select = document.getElementById("select_task")
        select.innerHTML = ""
        let emptyOption = document.createElement('option');
        emptyOption.value = '';
        emptyOption.textContent = '';
        select.prepend(emptyOption);
        data.forEach(Element => {
            let select2 = document.getElementById("select_task")
            let option = document.createElement("option");
            option.value = Element.task;
            option.textContent = Element.task;
            select2.appendChild(option);
        });
    }
    fetchProjects2()



    let submitbtn = document.getElementById("submitBtn")
    submitbtn.addEventListener("click", async function saveData(e) {
        // e.preventDefault()
        let value1 = document.getElementById("taskDate").value;
        let value2 = document.getElementById("select_project").value.trim();
        let value3 = document.getElementById("select_task").value.trim();
        let value4 = document.getElementById("description").value.toLowerCase().trim();
        let value5 = document.getElementById("work_hrs").value.trim();
        let value6 = document.getElementById("remark").value;
        if (value5 > 24 || value5 < 0) {
            e.preventDefault();
        }
        if (!value1 || !value2 || !value3 || !value4 || !value5) {
            e.preventDefault()
        }
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
            let table = document.getElementById("populate_table")
            table.style.display = ""

            let form_cell = document.getElementById("form_cell")
            form_cell.style.display = "none"
            populateTable()


        }
        if (response.status === 400 || response.status === 500) {
            e.preventDefault()
            alert(`${data.message}`)
        }
    })

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
        return data;
    }

}
async function populateTable() {
    let data = await getData()
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
        table.appendChild(tbody);

    })
}

populateTable()

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
            let form_cell = document.getElementById("form_cell")
            form_cell.style.display = "block"
            data.forEach((rowData) => {

                let date = document.getElementById("taskDate")
                date.value = `${rowData.date}`


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
                    let select = document.getElementById("select_project")
                    select.innerHTML = ""
                    data.forEach(Element => {
                        let option = document.createElement("option");
                        option.value = Element.project;
                        option.textContent = Element.project;
                        select.appendChild(option);
                    });
                    select.value = `${rowData.project}`
                }

                fetchProjects()

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
                    let select2 = document.getElementById("select_task")
                    select2.innerHTML = ""
                    data.forEach(Element => {
                        let option = document.createElement("option");
                        option.value = Element.task;
                        option.textContent = Element.task;
                        select2.appendChild(option);
                    });
                    select2.value = `${rowData.task}`
                }
                fetchProjects2()


                //for the description
                let description = document.getElementById("description")
                description.value = `${rowData.description}`

                //for the hrs to work
                let work_hrs = document.getElementById("work_hrs")
                work_hrs.value = `${rowData.work_hrs}`

                let remark = document.getElementById("remark")
                remark.value = `${rowData.remark}`

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

                let submitbtn = document.getElementById("submitBtn")
                console.log(submitbtn)
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
                        let table = document.getElementById("populate_table")
                        table.style.display = ""

                        let form_cell = document.getElementById("form_cell")
                        form_cell.style.display = "none"
                        populateTable()
                    }
                    if (response.status === 400 || response.status === 500) {
                        alert(`${data.message}`)
                    }
                })
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
                populateTable()
            }
            if (response.status === 400 || response.status === 500) {
                alert(`${data.message}`)
            }
        }
        deleteRecord()

    }
})


//search across the timesheet
/*async function searchData() {
    let data = await getData()
    console.log(data)
    let search_input = document.getElementById("search_sheet")
    search_input.addEventListener("input", async function searchSheet(e) {
        const value = e.target.value.trim().toLowerCase();
        console.log(value)
        let filteredSheet = data.filter((element) => {
            let projects = element.project.includes(value)
            let task = element.task.includes(value)
            let description = element.description.includes(value)
            return projects || task || description;
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
            table.appendChild(tbody);

        })

    })
}
searchData()*/


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



document.getElementById("logLink").addEventListener("click", async function logbtn(params) {
    let result = confirm("do you really want to log out?")
    if (result === true) {
        window.location.href = "http://localhost:8080/users/login/page?"
        document.cookie = "_id=; Max-Age=0; path=/";

    }
})
