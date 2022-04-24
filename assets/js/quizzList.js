function recebeQuizz(){
    let promise = axios.get('https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes');
    promise.then(exibeQuizz);
}

function exibeQuizz(resposta){

    console.log(resposta)
    
    const listaElement = document.querySelector('.lista-quizz');
    let quizz = resposta.data;

    // quizz.forEach(x => {
    //     listaElement.innerHTML += `
    //     <div class = "quizz-div">
    //          <span>Conteudo</span>
    //      </div>`});

    for(let i of quizz){
        let tagDiv = document.createElement("div");
        let tagImg = document.createElement("img");
        let tagH3 = document.createElement("h3")
        tagDiv.classList.add("card-quizz");
        tagDiv.classList.add("quizz-div");
        // tagDiv.style.backgroundImage = "-moz-linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 0.5) 64.58%, #000000 100%),url(" + i.image + ")";
        tagH3.textContent = i.title;
        tagImg.src = i.image;
        tagDiv.appendChild(tagH3);
        tagDiv.appendChild(tagImg);
        listaElement.appendChild(tagDiv);
        
        // lista.innerHTML += `
        // <div class = "">
        //     <div class = "card-quizz"></div>
        // </div>`
    }

    console.log(quizz)
}

function montaQuizz(){
    let card = {

    }
}

// function erro(){
//     console.log("Status code: " + erro.response.status);
// 	console.log("Mensagem de erro: " + erro.response.data);
// }

recebeQuizz();