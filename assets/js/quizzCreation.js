/*jshint esversion:9 */

let creationActualStep = 0;
let creationStepsElements = [];
const formCreationData = {};
const forwardBtn = document.querySelector('.forward-btn');
const backHomeBtn = document.querySelector('.back-home-btn');
const quizzCreationTitle = quizzCreationScreen.querySelector('.form-title h3');
const quizzCreationForm = quizzCreationScreen.querySelector('form');
const quizzCreationStep1 = quizzCreationScreen.querySelector('.step1');
const quizzCreationStep2 = quizzCreationScreen.querySelector('.step2');
const quizzCreationStep3 = quizzCreationScreen.querySelector('.step3');
const finalScreen = quizzCreationScreen.querySelector('.final-screen');

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
            image: urlsArray[i]
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
                image: wrapper.querySelector('.answer-url-input').value
            },
            incorrectAnswers: getIncorrectAnswers(wrapper)
        });

    });

    return questions;

}

function validateHexColor(hexColor){

    if(hexColor.length !== 7) {
        return false;
    }

    hexColor = hexColor.trim();
    const expression = /^#(?:[0-9a-fA-F]{3,4}){1,2}$/;
    const regex = new RegExp(expression);
    return regex.test(hexColor);

}

function validateIncorrectAnswers(incorrectAnswers){

    const filledAnswers = incorrectAnswers.filter(answer=>{

        if(answer.text !== '' && validateURL(answer.image)) {
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

        if(questionCorrectAnswer.text === '' || validateURL(questionCorrectAnswer.image) === false){
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
            title: wrapper.querySelector('.level-title').value,
            minValue: parseInt(wrapper.querySelector('.level-percentage').value),
            image: wrapper.querySelector('.level-url').value,
            text: wrapper.querySelector('.level-description').value
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

        const title = levels[i].title;
        const minValue = levels[i].minValue;
        const image = levels[i].image;
        const text = levels[i].text;

        if(title.length < 10) {
            isValid = false;
            break;
        }

        if(minValue < 0 || minValue > 100){
            isValid = false;
            break;
        }

        if(minValue === 0){
            has0PercentageField = true;
        }

        if(validateURL(image) === false){
            isValid = false;
            break;
        }

        if(text.length < 30){
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

    } else if(creationActualStep === 3){

        // aqui devemos carregar a página do quiz
        // necessário ter uma função para exibir um quiz

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
    backHomeBtn.addEventListener('click', () => changeScreen('lists'));
    // ao voltar para a home, devemos recarregar a lista de quizzes, então devemos ter uma função para isso também

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

function parseQuestion(question){

    const questionAnswers = question.incorrectAnswers.map(incorrectAnswer=>{
        incorrectAnswer.isCorrectAnswer = false;
        return incorrectAnswer;
    });
    question.correctAnswer.isCorrectAnswer = true;
    questionAnswers.push(question.correctAnswer);

    const obj = {
        title: question.questionText,
        color: question.questionColor,
        answers: questionAnswers
    };

    return obj;

}

function parseQuizzData(){

    const obj = {
        title: formCreationData.title,
        image: formCreationData.imgURL,
        questions: formCreationData.questions.map(question => parseQuestion(question)),
        levels: formCreationData.levels
    };

    return obj;

}

function finishQuizzCreation(){

    const quizzData = parseQuizzData();

    axios.post('https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes', quizzData).then(response=>{

        finalScreen.classList.remove('hidden');
        const quizzImgEl = finalScreen.querySelector('img');
        const quizzTitleEl = finalScreen.querySelector('.quizz-gradient h3');

        quizzImgEl.src = quizzData.image;
        quizzTitleEl.innerText = quizzData.title;
        quizzCreationTitle.innerText = 'Seu quizz está pronto!';
        forwardBtn.innerText = 'Acessar Quizz';
        backHomeBtn.classList.remove('hidden');
        saveUserQuizz(response.data);

    }).catch(err=>{
        console.log('err', err, err.response);
        alert('Ocorreu um erro desconhecido ao salvar o quizz. Tente novamente.');
    });

}

function saveUserQuizz(quizzData){

    let userQuizzes = localStorage.getItem('quizzes');
    
    if(userQuizzes !== null){
        userQuizzes = JSON.parse(userQuizzes);
    } else {
        userQuizzes = [];
    }

    userQuizzes.push(quizzData);
    localStorage.setItem('quizzes', JSON.stringify(userQuizzes));

}

function creationController(){

    loadSteps();
    controlButtons();

}

window.onload = creationController();