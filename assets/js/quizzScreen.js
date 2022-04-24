const body = {
    // id:
    // title:
    // image:
    // questions:
    // levels:
}

function recebeQuizz(){
    let promise = axios.get(`https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/${id}`);
    promise.then(exibeQuizz);
}