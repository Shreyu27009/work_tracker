setInterval(() => {
    let cookie = document.cookie
    if (cookie === "") {
        window.location.href = "http://localhost:8080/users/login/page"
    }
}, 1000)

let button = document.getElementById("add")
console.log(button)
button.addEventListener("click", addProject)
//for addition of the project
async function addProject() {
    let table = document.getElementById("populate_table")
    table.style.display = "none"

    let form_cell = document.getElementById("form_cell")
    if (!form_cell) {
        let form_cell = document.createElement("form")
        form_cell.setAttribute("id", "form_cell")
        let lable1 = document.createElement("label")
        lable1.for = 'productDate'
        lable1.textContent = "Project Date"
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
        lable2.for = 'projectName'
        lable2.textContent = "Project Name"
        lable2.style.marginRight = "20px"
        form_cell.appendChild(lable2)

        let input2 = document.createElement("input")
        input2.type = "text"
        input2.style.width = "300px"
        input2.id = "projectName"
        input2.style.marginTop = "20px"
        input2.style.marginRight = "20px"
        form_cell.appendChild(input2)

        let lable3 = document.createElement("label")
        lable3.for = 'projectDescription'
        lable3.textContent = "Project description"
        lable3.style.marginRight = "20px"
        form_cell.appendChild(lable3)

        let input3 = document.createElement("input")
        input3.type = "text"
        input3.style.width = "300px"
        input3.style.marginTop = "20px"
        input3.style.marginRight = "30px"
        input3.id = "projectDescription"
        form_cell.appendChild(input3)

        let submitbtn = document.createElement("button")
        submitbtn.textContent = "submit"
        submitbtn.style.flexBasis = "70%"
        submitbtn.id = "submitBtn"
        submitbtn.addEventListener("click", async function saveProject(e) {
            let value1 = document.getElementById("dates").value;
            let value2 = document.getElementById("projectName").value.toLowerCase().trim();
            let value3 = document.getElementById("projectDescription").value.trim();
            const postData = {
                "date": value1,
                "project": value2,
                "description": value3
            }
            let response = await fetch("http://localhost:8080/projects/save", {
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
            if (response.status === 400) {
                e.preventDefault()
                alert(`${data.message}`)
            }
        }

        )
        form_cell.appendChild(submitbtn)
        document.getElementById("result").appendChild(form_cell)

    }
}
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
    if (response.status === 200) {
        let populate_table = document.getElementById("populate_table")
        let tbody = populate_table.querySelector('tbody')
        tbody.innerHTML = ""
        data.forEach(rowData => {
            row1 = document.createElement('tr');

            const newCel = createCell(rowData.date)
            row1.appendChild(newCel);

            const newCell = createCell(rowData.project)
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

fetchProjects()

//for deleting the project
document.body.addEventListener("click", function (e) {
    if (e.target.matches(".updateBtn")) {
        console.log("button is clicked")
        const rowtoScore = e.target.closest('tr')
        let project_id = rowtoScore.querySelectorAll("td")[1].textContent
        console.log(project_id)
        async function fetchProject() {
            let response = await fetch(`http://localhost:8080/projects/shows?name=${project_id}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                },
            }
            )
            let data = await response.json()
            console.log(data)
            let formatData = data
            console.log(formatData)
            let table = document.getElementById("populate_table")
            table.style.display = "none"
            let result_form = document.getElementById("result")
            formatData.forEach((element) => {

                let form_cell = document.getElementById("form_cell")
                if (!form_cell) {
                    let form_cell = document.createElement("form")
                    form_cell.setAttribute("id", "form_cell")
                    let lable1 = document.createElement("label")
                    lable1.for = 'projectName'
                    lable1.textContent = "ProjectName"
                    lable1.style.marginRight = "20px"
                    form_cell.appendChild(lable1)

                    let input1 = document.createElement("input")
                    input1.type = "text"
                    input1.id = "projectName"
                    input1.readOnly=true
                    input1.style.width = "300px"
                    input1.value = `${data[0].project}`
                    input1.style.marginRight = "40px"
                    form_cell.appendChild(input1)

                    let lable = document.createElement("label")
                    lable.for = 'projectName2'
                    lable.textContent = "newName"
                    lable.style.marginRight = "20px"
                    form_cell.appendChild(lable)

                    let input = document.createElement("input")
                    input.type = "text"
                    input.id = "projectName2"
                    input.style.width = "300px"
                    input.value = `${data[0].project}`
                    input.style.marginRight = "40px"
                    form_cell.appendChild(input)

                    let lable2 = document.createElement("label")
                    lable2.for = 'date'
                    lable2.textContent = "Project date"
                    lable2.style.marginRight = "20px"
                    form_cell.appendChild(lable2)

                    let input2 = document.createElement("input")
                    input2.type = "date"
                    input2.style.width = "300px"
                    input2.id = "date"
                    input2.value = `${data[0].date}`
                    input2.style.marginRight = "20px"
                    form_cell.appendChild(input2)

                    let lable3 = document.createElement("label")
                    lable3.for = 'description'
                    lable3.textContent = "description"
                    lable3.style.marginRight = "20px"
                    form_cell.appendChild(lable3)

                    let input3 = document.createElement("input")
                    input3.type = "text"
                    input3.style.width = "300px"
                    input3.style.marginTop = "20px"
                    input3.value = `${data[0].description}`
                    input3.id = "description"
                    form_cell.appendChild(input3)

                    let submitbtn = document.createElement("button")
                    submitbtn.textContent = "submit"
                    submitbtn.style.flexBasis = "70%"
                    submitbtn.id = "submitBtn"
                    form_cell.appendChild(submitbtn)
                    submitbtn.addEventListener("click", async function updateProject(e) {
                        let values = document.getElementById("projectName").value
                        let value1 = document.getElementById("projectName2").value.toLowerCase().trim()
                        let value2 = document.getElementById("date").value
                        let value3 = document.getElementById("description").value
                        console.log(values)
                        if (value1 == '' || value2 == '' || value3 == '') {
                            return alert("All fields are necessary")
                        }
                        const postData = {
                            oname: values,
                            _id: value1,
                            project: value1,
                            date: value2,
                            description: value3
                        };
                        const url = `http://localhost:8080/projects/update`
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
                         if (response.status == 400) {
                            e.preventDefault();
                            alert(`${data.message}`)
                        }
                    })
                    result_form.appendChild(form_cell)
                }
            }

            )
        }
        fetchProject()

    }



    if (e.target.matches(".deleteBtn")) {
        const rowtoScore = e.target.closest('tr')
        let project_id = rowtoScore.querySelectorAll("td")[1].textContent
        console.log(project_id)
        async function deleteProject() {
            const postData = {
                project: project_id
            };
            const url = `http://localhost:8080/projects/delete`
            console.log(postData)
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData),
            })
            const data = await response.json();
            if (response.status == 200) {
                alert(`${data.message}`)
            }
            if (response.status == 400) {
                alert(`${data.message}`)
            }
            fetchProjects()
            console.log(data)
        }
        deleteProject()
    }
}
)

