const body = {
    // id:
    // title:
    // image:
    // questions:
    // levels:
}

function exibirQuizz(element){
    let promise = axios.get(`https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes/${element}`);
    promise.then(todosQuizzes);
}