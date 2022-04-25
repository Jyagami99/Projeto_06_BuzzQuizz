let bodyElement;
let listaElement;

function recebeQuizz(){
    let promise = axios.get('https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes');
    promise.then(exibeQuizz);
}

function criarQuizz(){
    bodyElement.innerHTML = `
        <div class="criar-quizz">
            <span>Você não criou nenhum quizz ainda :(</span>
            <button onclick="changeScreen('creation')">Criar Quizz</button>
        </div>
        <div class="lista-quizz">
            <span>Todos os Quizzes</span>
        </div>`
}

function meuQuizz(){
    bodyElement.innerHTML = `
    <div class="meu-quizz">
        <span>
            <h2>Seus Quizzes</h2>
            <ion-icon onclick="changeScreen('creation')" name="add-circle"></ion-icon>
        </span>
    </div>
    <div class="lista-quizz">
        <span>Todos os Quizzes</span>
    </div>`
    
    let listaID = JSON.parse(localStorage.getItem("quizzes"));
    console.log(listaID);
    
    for (let i = 0 ; i < listaID.length ; i++) {
        const quizzesDoUsuario = axios.get(`https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes/${listaID[i]}`);
        quizzesDoUsuario.then(response => {
            const image = response.data.image;
            const title = response.data.title;
            const lista = document.querySelector(".meu-quizz");
            lista.innerHTML += `
            <div class="card-quizz quizz-div">
                
            </div>
            `
        });
    }

}

function exibeQuizz(resposta) {
    bodyElement = document.querySelector(".quizz-lists-screen");
    let idArmazenado = JSON.parse(localStorage.getItem("quizzes"));
    let quizz = resposta.data;
  
    if (idArmazenado == null || idArmazenado.length == 0){
        criarQuizz();
    }else{
        meuQuizz();
    }

    listaElement = document.querySelector(".lista-quizz");  

    // quizz.forEach(x => {
    //     listaElement.innerHTML += `
    //     <div class = "quizz-div">
    //          <span>Conteudo</span>
    //      </div>`});
  
    for (let i of quizz) {
        let tagDiv = document.createElement("div");
        tagDiv.classList.add("card-quizz");
        tagDiv.classList.add("quizz-div");
        tagDiv.addEventListener("click", () => changeScreen("quizz"));

        let tagH3 = document.createElement("h3");
        tagH3.textContent = i.title;
  
        tagDiv.style.backgroundImage =
        "linear-gradient(to bottom, transparent 30%, #000c 100%), url(" +
        i.image +
        ")";
  
        tagDiv.style.backgroundSize = "cover";
  
        tagDiv.style.backgroundRepeat = "no-repeat";
  
        tagDiv.appendChild(tagH3);
  
        listaElement.appendChild(tagDiv);
    }
}

recebeQuizz();