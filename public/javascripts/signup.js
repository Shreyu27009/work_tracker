
let button = document.getElementById("signbtn")
console.log(button)
document.getElementById("signbtn").addEventListener("click", saveUser)
async function saveUser() {
    let value1 = document.getElementById("email").value;
    let value2 = document.getElementById("password").value;
    const postData = {
        "email": value1,
        "password": value2
    }
    let response = await fetch("http://localhost:8080/users/signup/save", {
        "method": "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
    })
    let data = await response.json()
    if (response.status === 200) {
        alert(`${data.message}`)
        window.location.href = "http://localhost:8080/users/login/page"
    }
    if (response.status == 500) {
        alert("user already exists")
        window.location.href = "http://localhost:8080/users/login/page"
    }
    if (response.status == 400) {
        alert("all values are required")
    }
}

document.getElementById("email").addEventListener("input", verifyInput)
function verifyInput() {
    const value = document.getElementById("email").value;
    const container = document.getElementById("emailfield");
    let errorElement = document.getElementById("error");

    if (!errorElement) {
        errorElement = document.createElement("h3");
        errorElement.setAttribute("id", "error");
        container.appendChild(errorElement);
    }

    if (!(value.endsWith("@gmail.com"))) {
        errorElement.textContent = "Please enter a valid email address.";
        errorElement.style.display = "block";
    } else {
        errorElement.textContent = "";
        errorElement.style.display = "none";
    }
}

document.getElementById("email").addEventListener("input", verifyInput)
function verifyInput() {
    const value = document.getElementById("email").value;
    const container = document.getElementById("emailfield");
    let errorElement = document.getElementById("error");

    if (!errorElement) {
        errorElement = document.createElement("h3");
        errorElement.setAttribute("id", "error");
        container.appendChild(errorElement);
    }

    if (!(value.endsWith("@gmail.com"))) {
        errorElement.textContent = "Please enter a valid email address.";
        errorElement.style.display = "block";
    } else {
        errorElement.textContent = "";
        errorElement.style.display = "none";
    }
}

document.getElementById("password").addEventListener("input", verifyPassword)
function verifyPassword() {
    const value = document.getElementById("password").value;
    const container = document.getElementById("passfield");
    let errorElement = document.getElementById("error");

    if (!errorElement) {
        errorElement = document.createElement("h3");
        errorElement.setAttribute("id", "error");
        container.appendChild(errorElement);
    }

    if (value.length>10) {
        errorElement.textContent = "password must be 0 to 10 characters";
        errorElement.style.display = "block";
    } else {
        errorElement.textContent = "";
        errorElement.style.display = "none";
    }
}