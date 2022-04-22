/*jshint esversion:9 */

let creationActualStep = 0;
let creationStepsElements = [];
const formCreationData = {};
const forwardBtn = document.querySelector('.forward-btn');
const quizzCreationTitle = quizzCreationScreen.querySelector('.form-title h3');
const quizzCreationForm = quizzCreationScreen.querySelector('form');
const quizzCreationStep1 = quizzCreationScreen.querySelector('.step1');
const quizzCreationStep2 = quizzCreationScreen.querySelector('.step2');
const quizzCreationStep3 = quizzCreationScreen.querySelector('.step3');

// Função responsável por carregar em um array todos os elementos do HTML que compõem o formulário de criação de um quiz.
function loadSteps(){
    creationStepsElements = [...quizzCreationScreen.querySelectorAll('.form-step')];
}

function hideAllSteps(){
    creationStepsElements.forEach(element => element.classList.add('hidden'));
}

function getFormData(){
    return new FormData(quizzCreationForm);
}

function validateQuizzTitle(title){
    return (title.length >= 20 && title.length <= 65);
}

function validateQuizzQuestionsQty(questionsQty){
    return (questionsQty >= 3);
}

function validateQuizzLevelsQty(levelsQty){
    return (levelsQty >= 2);
}

function validateURL(url){

    url = url.trim();
    const expression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
    const regex = new RegExp(expression);
    return regex.test(url);

}

function getIncorrectAnswers(wrapper){

    const textsArray = [...wrapper.querySelectorAll('.incorrect-answer-text')].map(input => input.value);
    const urlsArray = [...wrapper.querySelectorAll('.incorrect-answer-url')].map(input => input.value);
    
    let incorrectAnswers = [];
    
    for(let i = 0; i < textsArray.length; i++){

        incorrectAnswers.push({
            text: textsArray[i],
            url: urlsArray[i]
        });

    }

    return incorrectAnswers;

}

function getQuestionsInputs(){

    let questions = [];
    
    [...quizzCreationStep2.querySelectorAll('.question-wrapper')].forEach((wrapper, index)=>{
        
        questions.push({
            questionText: wrapper.querySelector('.question-text-input').value,
            questionColor: wrapper.querySelector('.question-color-input').value,
            correctAnswer: {
                text: wrapper.querySelector('.answer-input').value,
                url: wrapper.querySelector('.answer-url-input').value
            },
            incorrectAnswers: getIncorrectAnswers(wrapper)
        });

    });

    return questions;

}

function validateHexColor(hexColor){

    hexColor = hexColor.trim();
    const expression = /^#(?:[0-9a-fA-F]{3,4}){1,2}$/;
    const regex = new RegExp(expression);
    return regex.test(hexColor);

}

function validateIncorrectAnswers(incorrectAnswers){

    const filledAnswers = incorrectAnswers.filter(answer=>{

        if(answer.text !== '' && validateURL(answer.url)) {
            return true;
        }
        return false;

    });
    return filledAnswers;

}

function validateQuizzQuestionsInputs(){

    const questions = getQuestionsInputs();
    let isValid = true;
    formCreationData.questions = questions;

    for(let i = 0; i < questions.length; i++){

        const questionText = questions[i].questionText;
        const questionColor = questions[i].questionColor;
        const questionCorrectAnswer = questions[i].correctAnswer;
        const questionIncorrectAnswers = questions[i].incorrectAnswers;

        if(questionText.length < 20) {
            isValid = false;
            break;
        }

        if(validateHexColor(questionColor) === false){
            isValid = false;
            break;
        }

        if(questionCorrectAnswer.text === '' || validateURL(questionCorrectAnswer.url) === false){
            isValid = false;
            break;
        }

        const questionFilledAnswers = validateIncorrectAnswers(questionIncorrectAnswers);

        if(questionFilledAnswers.length === 0){
            isValid = false;
            break;
        }

        formCreationData.questions[i].incorrectAnswers = questionFilledAnswers;

    }

    return isValid;

}

function getLevelsInputs(){

    let levels = [];
    
    [...quizzCreationStep3.querySelectorAll('.level-wrapper')].forEach((wrapper, index)=>{
        
        levels.push({
            levelTitle: wrapper.querySelector('.level-title').value,
            levelPercentage: parseInt(wrapper.querySelector('.level-percentage').value),
            levelURL: wrapper.querySelector('.level-url').value,
            levelDescription: wrapper.querySelector('.level-description').value
        });

    });

    return levels;

}

function validateQuizzLevelsInputs(){
    
    const levels = getLevelsInputs();
    let isValid = true;
    let has0PercentageField = false;
    formCreationData.levels = levels;

    for(let i = 0; i < levels.length; i++){

        const levelTitle = levels[i].levelTitle;
        const levelPercentage = levels[i].levelPercentage;
        const levelURL = levels[i].levelURL;
        const levelDescription = levels[i].levelDescription;

        if(levelTitle.length < 10) {
            isValid = false;
            break;
        }

        if(levelPercentage < 0 || levelPercentage > 100){
            isValid = false;
            break;
        }

        if(levelPercentage === 0){
            has0PercentageField = true;
        }

        if(validateURL(levelURL) === false){
            isValid = false;
            break;
        }

        if(levelDescription.length < 30){
            isValid = false;
            break;
        }

    }

    if(has0PercentageField === false) {
        isValid = false;
    }

    return isValid;

}

function validateStep(){

    const formData = getFormData();

    if(creationActualStep === 0){

        formCreationData.title = formData.get('title');
        formCreationData.imgURL = formData.get('imgURL');
        formCreationData.questionsQty = parseInt(formData.get('questionsQty'));
        formCreationData.levelsQty = parseInt(formData.get('levelsQty'));
        
        if(validateQuizzTitle(formCreationData.title) && validateQuizzQuestionsQty(formCreationData.questionsQty) && validateQuizzLevelsQty(formCreationData.levelsQty) && validateURL(formCreationData.imgURL)){
            return true;
        } else {
            return false;
        }

    } else if(creationActualStep === 1){

        return validateQuizzQuestionsInputs();

    } else if(creationActualStep === 2){

        return validateQuizzLevelsInputs();

    }

}

function nextStep(){

    if(validateStep() === true){

        hideAllSteps();
        creationActualStep++;

        if(creationActualStep >= creationStepsElements.length){
            finishQuizzCreation();
        } else {
            
            switch (creationActualStep) {

                case 1:
                    quizzCreationTitle.innerText = 'Crie suas perguntas';
                    forwardBtn.innerText = 'Prosseguir para criar níveis';
                    appendQuestionsToForm();
                    break;

                case 2:
                    quizzCreationTitle.innerText = 'Agora, decida os níveis';
                    forwardBtn.innerText = 'Finalizar Quizz';
                    console.log('formCreationData', formCreationData);
                    appendLevelsToForm();
                    break;

            }

            displayActualScreen();

        }

    } else {

        alert('Preencha os campos corretamente...');

    }

}

function displayActualScreen(){
    creationStepsElements[creationActualStep].classList.remove('hidden');
}

function controlButtons(){

    forwardBtn.addEventListener('click', () => nextStep());
    const backHomeBtn = document.querySelector('.back-home-btn');
    backHomeBtn.addEventListener('click', () => changeScreen('lists'));

}

function appendQuestionsToForm(){

    quizzCreationStep1.classList.add('hidden');
    quizzCreationStep2.classList.remove('hidden');

    for(let i = 0; i < formCreationData.questionsQty; i++){

        quizzCreationStep2.innerHTML += `
            <div class="form-group collapsed">

                <div class="form-group-header d-flex">
                    <h5>Pergunta ${i + 1}</h5>
                    <ion-icon name="create-outline"></ion-icon>
                </div>

                <div class="question-wrapper">
                
                    <div class="input-group form-section">
                        <label for="">Pergunta ${i + 1}</label>
                        <input type="text" placeholder="Texto da pergunta" class="question-text-input">
                        <input type="text" placeholder="Cor de fundo da pergunta" class="question-color-input">
                    </div>

                    <div class="input-group form-section">
                        <label for="">Resposta correta</label>
                        <input type="text" placeholder="Resposta correta" class="answer-input">
                        <input type="url" placeholder="URL da imagem" class="answer-url-input">
                    </div>

                    <div class="input-group form-section">
                        <label for="">Respostas incorretas</label>
                        <input type="text" placeholder="Resposta incorreta 1" class="incorrect-answer-text">
                        <input type="url" placeholder="URL da imagem 1" class="incorrect-answer-url">
                    </div>

                    <div class="input-group form-section">
                        <input type="text" placeholder="Resposta incorreta 2" class="incorrect-answer-text">
                        <input type="url" placeholder="URL da imagem 2" class="incorrect-answer-url">
                    </div>

                    <div class="input-group form-section">
                        <input type="text" placeholder="Resposta incorreta 3" class="incorrect-answer-text">
                        <input type="url" placeholder="URL da imagem 3" class="incorrect-answer-url">
                    </div>

                </div>

            </div>
        `;

    }

    controlClickOnFormGroups(quizzCreationStep2);
    quizzCreationStep2.querySelector('.form-group:first-child').click();

}

function appendLevelsToForm(){

    quizzCreationStep2.classList.add('hidden');
    quizzCreationStep3.classList.remove('hidden');

    for(let i = 0; i < formCreationData.levelsQty; i++){

        quizzCreationStep3.innerHTML += `
            <div class="form-group expanded">

                <div class="form-group-header d-flex">
                    <h5>Nível ${i + 1}</h5>
                    <ion-icon name="create-outline"></ion-icon>
                </div>

                <div class="level-wrapper">
                    <div class="input-group">
                        <label for="">Nível ${i + 1}</label>
                        <input type="text" placeholder="Título do nível" class="level-title">
                        <input type="number" placeholder="% de acerto mínima" class="level-percentage">
                        <input type="url" placeholder="URL da imagem do nível" class="level-url">
                        <input type="text" placeholder="Descrição do nível" class="level-description">
                    </div>
                </div>

            </div>
        `;

    }

    controlClickOnFormGroups(quizzCreationStep3);
    quizzCreationStep3.querySelector('.form-group:first-child').click();

}

function controlClickOnFormGroups(stepWrapper){

    [...stepWrapper.querySelectorAll('.form-group .form-group-header')].forEach(element=>{

        element.addEventListener('click', ()=>{
            
            if(element.parentNode.classList.contains('collapsed')){

                element.parentNode.classList.remove('collapsed');
                element.parentNode.classList.add('expanded');

            } else {
                element.parentNode.classList.add('collapsed');
                element.parentNode.classList.remove('expanded');
            }

        });

    });

}

function finishQuizzCreation(){

    console.log('finalizando criação do quizz...');
    quizzCreationTitle.innerText = 'Seu quizz está pronto!';
    forwardBtn.innerText = 'Acessar Quizz';

}

function creationController(){

    loadSteps();
    controlButtons();

}

window.onload = creationController();