let bodyElement;
let listaElement;

function recebeQuizz(){
    showLoading();
    changeScreen('lists');
    let promise = axios.get('https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes');
    promise.then(todosQuizzes);
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
        <span class="meus-quizzes">
        
        </span>
    </div>
    <div class="lista-quizz">
        <span>Todos os Quizzes</span>
    </div>`
    
    let listaID = JSON.parse(localStorage.getItem("quizzes"));
    
    const lista = document.querySelector(".meus-quizzes");
    for (let i of listaID) {
        let tagDiv = document.createElement("div");
        tagDiv.classList.add("card-quizz");
        tagDiv.classList.add("quizz-div");
        tagDiv.addEventListener("click", () => quizzClicado(i.id));

        let tagH3 = document.createElement("h3");
        tagH3.textContent = i.title;
  
        tagDiv.style.backgroundImage =
        "linear-gradient(to bottom, transparent 30%, #000c 100%), url(" +
        i.image +
        ")";
  
        tagDiv.style.backgroundSize = "cover";
  
        tagDiv.style.backgroundRepeat = "no-repeat";
  
        tagDiv.appendChild(tagH3);

        let tagSpan = document.createElement("span");
        tagSpan.hidden = true;
        tagSpan.textContent = i.id;
        tagDiv.appendChild(tagSpan);
  
        lista.appendChild(tagDiv);
    }

}

function ehMeuQuizz(meusQuizzes, quizzID){
    return (meusQuizzes.findIndex(quizz => quizz.id === quizzID) > -1);
}

function todosQuizzes(resposta) {
    bodyElement = document.querySelector(".quizz-lists-screen");
    let quizzesArmazenados = JSON.parse(localStorage.getItem("quizzes"));
    let quizz = resposta.data;
  
    if (quizzesArmazenados == null || quizzesArmazenados.length == 0){
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

        if(ehMeuQuizz(quizzesArmazenados, i.id) === true){
            continue;
        }

        let tagDiv = document.createElement("div");
        tagDiv.classList.add("card-quizz");
        tagDiv.classList.add("quizz-div");
        tagDiv.addEventListener("click", () => quizzClicado(i.id));

        let tagSpan = document.createElement("span");
        tagSpan.hidden = true;
        tagSpan.textContent = i.id;
        tagDiv.appendChild(tagSpan);
        

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

    hideLoading();

}

recebeQuizz();