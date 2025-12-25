let form_cell = document.getElementById("form_cell")
form_cell.style.display = "none"

let backBtn = document.getElementById("projects")
backBtn.addEventListener("click", function (e) {
    let table = document.getElementById("populate_table")
    table.style.display = ""
    let form = document.getElementById("form_cell")
    console.log(form)
    form.style.display = "none"
})
let button = document.getElementById("add")
console.log(button)
button.addEventListener("click", addProject)
//for addition of the project
async function addProject() {
    let table = document.getElementById("populate_table")
    table.style.display = "none"
    let form = document.getElementById("form_cell")
    console.log(form)
    form.style.display = "block"
    let submitbtn = document.getElementById("submitBtn")
    submitbtn.addEventListener("click", async function saveProject(e) {
        let value2 = document.getElementById("projectName").value.toLowerCase().trim();
        let value3 = document.getElementById("projectDescription").value.trim();
        if (!value2 || !value3) {
            e.preventDefault();
        }
        const postData = {
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

            const newCel = createCell(rowData._id)
            newCel.style.display = "none"
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
        let project_id = rowtoScore.querySelectorAll("td")[0].textContent
        console.log(project_id)
        let table = document.getElementById("populate_table")
        table.style.display = "none"
        let form_cell = document.getElementById("form_cell")
        console.log(form_cell)
        form_cell.style.display = "block"
        async function fetchProject() {
            let response = await fetch(`http://localhost:8080/projects/shows?id=${project_id}`, {
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

            formatData.forEach((element) => {

                let project_id = document.getElementById("project_id")
                project_id.value = `${element._id}`
                console.log(project_id)

                let project_name = document.getElementById("projectName")
                project_name.value = `${element.project}`
                console.log(project_name)

                let project_description = document.getElementById("projectDescription")
                project_description.value = `${element.description}`
                console.log(project_description)
            })
        }
        fetchProject()
        document.getElementById("submitBtn").addEventListener("click", async function updateData(e) {
            let value1 = document.getElementById("project_id").value;
            let value2 = document.getElementById("projectName").value.toLowerCase().trim();
            let value3 = document.getElementById("projectDescription").value
            console.log(value2, value3)
            if (!value2 || !value3) {
                alert("all values are required")
                e.preventDefault()
            }
            const postData = {
                _id: value1,
                project: value2,
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
                alert(`${data.message}`)
            }
        })
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

})

let inputElement = document.getElementById("projectName")

inputElement.addEventListener('change', async function (e) {
    let value = e.target.value;
    let response = await fetch(`http://localhost:8080/projects/get?name=${value}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
        },
    }
    )
    let data = await response.json()
    if(data.length>0){
        alert("project already exists")
    }
});

