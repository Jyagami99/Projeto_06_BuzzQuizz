function recebeQuizz(){
    let promise = axios.get('https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes');
    promise.then(exibeQuizz);
}

function exibeQuizz(resposta) {
    console.log(resposta);
  
    const listaElement = document.querySelector(".lista-quizz");
    let quizz = resposta.data;
  
    // quizz.forEach(x => {
    //     listaElement.innerHTML += `
    //     <div class = "quizz-div">
    //          <span>Conteudo</span>
    //      </div>`});
  
    for (let i of quizz) {
      let tagDiv = document.createElement("div");
      tagDiv.classList.add("card-quizz");
      tagDiv.classList.add("quizz-div");
  
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
  
    console.log(quizz);
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