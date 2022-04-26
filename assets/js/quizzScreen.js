
let questionsAnsweredList = [];
let questionsList = [];
let levelsList = [];
let correctAnswersQty = 0;
let selectedQuizzID = '';
const quizzFinalLevelElement = quizzScreen.querySelector('.quizz-final-level');
const quizzActionsElement = quizzScreen.querySelector('.quizz-actions');

function quizzClicado(id){

    showLoading();
    selectedQuizzID = id;
    questionsAnsweredList = [];
    correctAnswersQty = 0;
    hideQuizzFinalLevel();
    let = promise = axios.get(`https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes/${id}`);
    promise.then(montaQuizz);
    changeScreen("quizz");
    quizzScreen.scrollIntoView();

}

function montaQuizz(response){
    
    const quizzData = response.data;

    const quizzBanner = quizzScreen.querySelector('.quizz-banner');
    const quizzBannerImg = quizzBanner.querySelector('img');
    const quizzBannerTitle = quizzBanner.querySelector('h1');
    
    quizzBannerImg.src = quizzData.image;
    quizzBannerTitle.innerText = quizzData.title;
    questionsList = quizzData.questions;
    levelsList = quizzData.levels;
    addQuestionsToQuizzScreen(quizzData.questions);

}

function shuffle(array){
    return array.sort((item) => Math.random() - 0.5);
}

function addQuestionsToQuizzScreen(questions){

    const quizzQuestionsElement = quizzScreen.querySelector('.quizz-questions');
    
    quizzQuestionsElement.innerHTML = '';
    
    for(let i = 0; i < questions.length; i++){

        quizzQuestionsElement.innerHTML += `
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

    const questionAnswerIndex = questionsAnsweredList.findIndex((question)=>{
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
        questionsAnsweredList.push({
            title: questionData.title,
            questionNumber
        });

        const nextQuestionElement = optionElement.parentNode.parentNode.nextElementSibling;
        
        if(nextQuestionElement !== null){
            setTimeout(()=>{
                nextQuestionElement.scrollIntoView();
            }, 2000);
        }

        if(questionsList.length === questionsAnsweredList.length){
            quizzFinish();
            showQuizzFinalLevel();
        }

    }

}

function fadeOtherOptions(selectedOption){
    [...selectedOption.parentNode.children].forEach(option => option.classList.add('not-selected-option'));
}

function restartQuizz(){
    quizzClicado(selectedQuizzID);
}

function hideQuizzFinalLevel(){
    quizzFinalLevelElement.classList.add('hidden');
    quizzActionsElement.classList.add('hidden');
}

function showQuizzFinalLevel(){
    quizzFinalLevelElement.classList.remove('hidden');
    quizzActionsElement.classList.remove('hidden');
}

function quizzFinish(){

    const hitPercentage = Math.round((correctAnswersQty / questionsList.length) * 100);
    levelsList.sort((a, b) => b.minValue - a.minValue);
    
    for(let i = 0; i < levelsList.length; i++){

        if(hitPercentage >= levelsList[i].minValue){
            insertLevelDataOnScreen(levelsList[i], hitPercentage);
            break;
        }

    }

    setTimeout(()=>{
        quizzFinalLevelElement.scrollIntoView();
    }, 2000);

}

function insertLevelDataOnScreen(level, hitPercentage){

    const levelTitle = quizzFinalLevelElement.querySelector('.final-level-header h2');
    const levelImg = quizzFinalLevelElement.querySelector('.final-level-options img');
    const levelDescription = quizzFinalLevelElement.querySelector('.final-level-options p');

    levelTitle.innerText = `${hitPercentage}% de acerto: ${level.title}`;
    levelImg.src = level.image;
    levelDescription.innerText = level.text;

}