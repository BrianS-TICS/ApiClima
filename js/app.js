const divContenedor = document.querySelector(".container");
const divResultado = document.querySelector("#resultado");
const formulario = document.querySelector("#formulario");

let ciudad;

window.addEventListener("load", () => {
    formulario.addEventListener("submit", buscarClima);
});

function buscarClima(e) {
    e.preventDefault();

    // Validar formulario
    const slcPais = document.querySelector("#pais").value;
    const inpCiudad = document.querySelector("#ciudad").value;

    if (inpCiudad === "" || slcPais === "") {
        imprimirAlerta("Todos los campos son obligatorios", "error");
        return;
    }
    // imprimirAlerta('Realizada correctamente');

    ciudad = inpCiudad;
    // ConsultarAPI
    consultarAPI(slcPais, inpCiudad);
}

function imprimirAlerta(mensaje, tipo) {
    if (!document.querySelector(".alerta")) {
        const aviso = document.createElement("div");
        aviso.textContent = mensaje;
        aviso.classList.add(
            "mt-4",
            "px-4",
            "py-3",
            "text-center",
            "uppercase",
            "text-white",
            "font-bold",
            "rounded-md",
            "alerta",
            "border-4",
            "border-white",
            "max-w-md",
            "mx-auto"
        );

        if (tipo === "error") {
            aviso.classList.add("bg-red-500");
        } else {
            aviso.classList.add("bg-green-500");
        }

        formulario.appendChild(aviso);

        setTimeout(() => {
            aviso.remove();
        }, 2000);
    }
}

function consultarAPI(ciudad, pais) {
    const appId = "82e4a015de5e1af87bc3db3ae558cb72";

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appId}`;


    // Mostrar spinner
    Spinner();

    fetch(url)
        .then((respuesta) => respuesta.json())
        .then((datos) => {

            limpiarHtml();
            
            if (datos.cod === "404") {
                imprimirAlerta("Ciudad no encontrada", "error");
                return;
            }
            // Imprime respuesta en html
            mostrarClima(datos);
        })
}

const kelvinToCentigrados = grados => parseInt(grados - 273.15);

function mostrarClima(datos) {
    const { main: { temp, temp_max, temp_min } } = datos;

    const centigrados = kelvinToCentigrados(temp);
    const centigradosMax = kelvinToCentigrados(temp_max);
    const centigradosMin = kelvinToCentigrados(temp_min);

    const nombreCiudad = document.createElement('p');
    nombreCiudad.textContent = `Clima en ${ciudad}`;
    nombreCiudad.classList.add('font-bold','text-2xl');

    const actual = document.createElement("p");
    actual.innerHTML = `${centigrados} &#8451;`;
    actual.classList.add("font-bold", "text-6xl");

    const max = document.createElement("p");
    max.innerHTML = `Maxima de ${centigradosMax} &#8451;`;
    max.classList.add("font-bold", "text-6");

    const min = document.createElement("p");
    min.innerHTML = `Minia de ${centigradosMin} &#8451;`;
    min.classList.add("font-bold", "text-6");

    const resultadoDiv = document.createElement("div");
    resultadoDiv.classList.add("text-center", "text-white");

    resultadoDiv.appendChild(nombreCiudad);
    resultadoDiv.appendChild(actual);
    resultadoDiv.appendChild(max);
    resultadoDiv.appendChild(min);

    divResultado.appendChild(resultadoDiv);
}

function limpiarHtml() {
    while (divResultado.firstChild) {
        divResultado.removeChild(divResultado.firstChild);
    }
}

function Spinner(){
    
    limpiarHtml();
    const divSpinner = document.createElement('div');
    divSpinner.classList.add('spinner');

    divSpinner.innerHTML = `
        <div class="double-bounce1"></div>
        <div class="double-bounce2"></div>
    `;

    divResultado.appendChild(divSpinner);
}