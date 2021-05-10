const formulario = document.getElementById("Formulario");
formulario.addEventListener("submit", async (e) => {
    e.preventDefault();

    let camposPreenchidos = new FormData(e.target);
    let data = {};
    camposPreenchidos.forEach((value, key) => {
        data[key] = value
    });

    try {
        const sendData = await fetch("/", {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data) // body data type must match "Content-Type" header
        });

        console.log("Informação enviada com sucesso !!!")
    } catch (error) {
        console.log(error)
    }

})