// Busco elementos del HTML 
const btnFetchJoke = document.getElementById("fetchJoke");
const jokeList = document.getElementById("jokeList");
const btnClearAll = document.getElementById("clearAll");

// Declaro el nombre de la cajita del localStorage donde guardare los chistes
const JOKES_KEY = "chuckJokes";
//La constante la escribo asi porque es una variable que no va a cambiar nunca como buena practica.

//Creo un array vacio donde guardare los chistes
let jokes = [];

// FUNCIONES

//Funcion para cargar los chistes del localStorage al array "jokes", dos casos si no hay nada lista vacia, si hay algo lo parseo a array pq localStorage solo guarda texto.
function loadJokesFromStorage() {
  const jokesText = localStorage.getItem(JOKES_KEY);
  if (jokesText === null) {
    jokes = [];
  } else {
    jokes = JSON.parse(jokesText);
  }
}

//Funcion para guardar el array "jokes" en localStorage, lo convierto a texto con JSON.stringify pq localStorage solo guarda texto.
function saveJokesToStorage() {
  localStorage.setItem(JOKES_KEY, JSON.stringify(jokes));
}

//Funcion para que aparezcan los chistes del array "jokes" en el <ul>  
function renderJokes() {
  //Primero limpio la lista y luego recorro el array pintando cada chiste.
  jokeList.innerHTML = "";

  jokes.forEach((joke, index) => {
    const li = document.createElement("li");

    const span = document.createElement("span");
    span.textContent = joke;

    //Creo el boton eliminar 
    const btnDelete = document.createElement("button");
    btnDelete.textContent = "Eliminar";

    btnDelete.addEventListener("click", () => {
      jokes.splice(index, 1);
      saveJokesToStorage();
      renderJokes();
    });

    li.appendChild(span);
    li.appendChild(btnDelete);
    jokeList.appendChild(li);
  });
}

//Funcion obtener un chiste nuevo de la API
function fetchJoke() {

  //Hago la peticion a la API
  fetch("https://api.chucknorris.io/jokes/random")

    //La respuesta la convierto a JSON y luego cojo el chiste del campo value
    .then((response) => response.json())
    .then((data) => {
      const newJoke = data.value;

      //Añado el chiste nuevo al array "jokes", lo guardo en localStorage y pinto la lista de chistes
      jokes.push(newJoke);
      saveJokesToStorage();
      renderJokes();
    })
    // Si hay algun error en la peticion, aviso al usuario
    .catch(() => {
      alert("No encontre el chiste. Intentalo de nuevo.");
    });
}

//Creo los eventos con addEventListener

//Cuando hago click en el boton, pido un chiste nuevo
btnFetchJoke.addEventListener("click", fetchJoke);

//Cuando carga la pagina, cargo los chistes del localStorage y los pinto
document.addEventListener("DOMContentLoaded", () => {
  loadJokesFromStorage();
  renderJokes();
});

//Funcion para borrar todos los chistes

function clearAllJokes() {
  jokes = [];
  localStorage.removeItem(JOKES_KEY); 
  renderJokes();
}

btnClearAll.addEventListener("click", clearAllJokes);