const api = "https://pokeapi.co/api/v2/";
const loaderContainer = document.getElementById("loading");
const resultContainer = document.getElementById("result");

const inputContainer = document.getElementById("inputContainer");
const userInput = document.getElementById("userInput");
userInput.addEventListener("keydown", (e) => {
    if (e.key == "Enter") {
        e.preventDefault();
        handleEntry();
    }
})

const validInputButton = document.getElementById("validInput");
validInputButton.addEventListener("click", handleEntry);
const skipButton = document.getElementById("skipButton");
skipButton.addEventListener("click", init);

const spritesImg = document.getElementById("spritesImg");
const frontFace = document.getElementById("frontFace");
const backFace = document.getElementById("backFace");
const turn = document.getElementById("turn");
turn.addEventListener("click", () => {
    spritesImg.classList.toggle("turn");
})
const crieButton = document.getElementById("crie");
crieButton.addEventListener("click", () => {
    currentPokemon.crie.play();
})

class Pokemon {
    constructor(pokemon, species) {
        this.name = species.names[4].name;
        this.spritFront = pokemon.sprites.front_default;
        this.spritBack = pokemon.sprites.back_default;
        this.crie = new Audio(pokemon.cries.legacy);
        this.updateDom();
    }

    updateDom() {
        frontFace.src = this.spritFront;
        backFace.src = this.spritBack;
    }
}
let currentPokemon = null;

function init() {
    resultContainer.classList.add("hidden");
    loaderContainer.classList.remove("hidden");
    fetchPokemon();
}

function handleEntry() {
    if (currentPokemon && userInput.value != "") {
        const name = userInput.value.toLowerCase();
        const curNAme = currentPokemon.name.toLowerCase();
        userInput.value = "";
        console.log(curNAme);
        let find = false;
        if (name == curNAme) {
            inputContainer.classList.add("green");
            find = true;
        } else {
            find = false;
            inputContainer.classList.add("red");
        }
        setTimeout(() => {
            inputContainer.classList.remove("green");
            inputContainer.classList.remove("red");
            if (find) init();

        }, 1000);
    }
}

async function fetchPokemon() {
    try {
        const id = random(1, 251);
        const speciesResp = await fetch(api + "pokemon-species/" + id);
        if (!speciesResp.ok) throw new Error("Espèce du pokemon non trouvé dans l'api");

        const pokemonResp = await fetch(api + "pokemon/" + id);
        if (!pokemonResp.ok) throw new Error("Données du pokemon non trouvé dans l'api");

        const pokemon = await pokemonResp.json();
        const species = await speciesResp.json();

        currentPokemon = new Pokemon(pokemon, species);

        resultContainer.classList.remove("hidden")
    } finally {
        loaderContainer.classList.add("hidden");
    }
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

init();