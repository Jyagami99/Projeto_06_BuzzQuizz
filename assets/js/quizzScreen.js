
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
                    ${getQuestionOptionsHTML(shuffle(questions[i].answers), questions[i], i)}
                </div>
            </div>
        `;

    }

    hideLoading();

}

function getQuestionOptionsHTML(options, question, questionNumber){

    let html = '';
    
    for(let i = 0; i < options.length; i++){

        html += `
            <div class="option" onclick="answerQuestion(this)" data-option='${JSON.stringify(options[i])}' data-question='${JSON.stringify(question)}' data-question-number='${questionNumber}'>
                <img src="${options[i].image}" alt="">
                <p>${options[i].text}</p>
            </div>
        `;

    }

    return html;

}

function questionAlreadyAnswered(questionTitle, questionNumber){

    const questionAnswerIndex = questionsAnswered.findIndex((question)=>{
        return (question.title === questionTitle && question.questionNumber === questionNumber);
    });
    return (questionAnswerIndex > -1);

}

function answerQuestion(optionElement){

    const optionData = JSON.parse(optionElement.dataset.option);
    const questionData = JSON.parse(optionElement.dataset.question);
    const questionNumber = parseInt(optionElement.dataset.questionNumber);

    if(questionAlreadyAnswered(questionData.title, questionNumber) === false){

        fadeOtherOptions(optionElement);

        let optionClass = '';

        if(optionData.isCorrectAnswer === true){

            optionClass = 'correct-option';
            correctAnswersQty++;

        } else {

            optionClass = 'incorrect-option';

        }
        
        optionElement.classList.add(optionClass);
        questionsAnswered.push({
            title: questionData.title,
            questionNumber
        });

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