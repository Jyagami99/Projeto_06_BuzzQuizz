let body = document.querySelector(".quizz-screen");

function quizzClicado(id){
    console.log(id);
    promise = axios.get(`https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes/${id}`);
    promise.then(montaQuizz);

    changeScreen("quizz");
}

function montaQuizz(response){
    console.log(promise);
    
    body.innerHTML = `
    <div class="img-topo">
        <img src="${response.data.image}"></img>
    </div>
    `
}