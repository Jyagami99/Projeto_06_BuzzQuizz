
const questionsAnswered = [];
let correctAnswersQty = 0;

function quizzClicado(id){

    showLoading();
    let = promise = axios.get(`https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes/${id}`);
    promise.then(montaQuizz);
    changeScreen("quizz");

}

function montaQuizz(response){
    
    const quizzData = response.data;
    console.log('quizzData', quizzData);

    const quizzBanner = quizzScreen.querySelector('.quizz-banner');
    const quizzBannerImg = quizzBanner.querySelector('img');
    const quizzBannerTitle = quizzBanner.querySelector('h1');
    
    quizzBannerImg.src = quizzData.image;
    quizzBannerTitle.innerText = quizzData.title;
    addQuestionsToQuizzScreen(quizzData.questions);

}

function shuffle(array){
    return array.sort((item) => Math.random() - 0.5);
}

function addQuestionsToQuizzScreen(questions){

    const quizzQuestions = quizzScreen.querySelector('.quizz-questions');
    
    quizzQuestions.innerHTML = '';
    
    for(let i = 0; i < questions.length; i++){

        quizzQuestions.innerHTML += `
            <div class="quizz-question d-flex">
                <div class="header d-flex" style="background-color: ${questions[i].color}">
                    <h2>${questions[i].title}</h2>
                </div>
                <div class="options d-flex">
                    ${getQuestionOptionsHTML(shuffle(questions[i].answers), questions[i])}
                </div>
            </div>
        `;

    }

    hideLoading();

}

function getQuestionOptionsHTML(options, question){

    let html = '';
    
    for(let i = 0; i < options.length; i++){

        html += `
            <div class="option" onclick="answerQuestion(this)" data-option='${JSON.stringify(options[i])}' data-question='${JSON.stringify(question)}'>
                <img src="${options[i].image}" alt="">
                <p>${options[i].text}</p>
            </div>
        `;

    }

    return html;

}

function questionAlreadyAnswered(questionTitle){

    const questionAnswerIndex = questionsAnswered.indexOf(questionTitle);
    return (questionAnswerIndex > -1);

}

function answerQuestion(optionElement){

    const optionData = JSON.parse(optionElement.dataset.option);
    const questionData = JSON.parse(optionElement.dataset.question);

    if(questionAlreadyAnswered(questionData.title) === false){

        fadeOtherOptions(optionElement);

        let optionClass = '';

        if(optionData.isCorrectAnswer === true){

            optionClass = 'correct-option';
            correctAnswersQty++;

        } else {

            optionClass = 'incorrect-option';

        }
        
        optionElement.classList.add(optionClass);
        questionsAnswered.push(questionData.title);
        console.log('questionsAnswered', questionsAnswered, correctAnswersQty);

        const nextQuestionElement = optionElement.parentNode.parentNode.nextElementSibling;
        
        if(nextQuestionElement){
            
            setTimeout(()=>{
                nextQuestionElement.scrollIntoView();
            }, 2000);
            
        }

    }

}

function fadeOtherOptions(selectedOption){
    [...selectedOption.parentNode.children].forEach(option => option.classList.add('not-selected-option'));
}