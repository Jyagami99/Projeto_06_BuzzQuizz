/*jshint esversion:9 */

let creationActualStep = 0;
let creationStepsElements = [];
const forwardBtn = document.querySelector('.forward-btn');
const quizzCreationTitle = quizzCreationScreen.querySelector('.form-title h3');
const quizzCreationForm = quizzCreationScreen.querySelector('form');

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

function validateQuizzQuestions(questionsQty){
    return (parseInt(questionsQty) >= 3);
}

function validateQuizzLevels(levelsQty){
    return (parseInt(levelsQty) >= 2);
}

function validateURL(url){

    url = url.trim();
    let expression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
    let regex = new RegExp(expression);
    return regex.test(url);

}

function validateStep(){

    const formData = getFormData();

    switch (creationActualStep) {

        case 0:
            
            const title = formData.get('title');
            const imgURL = formData.get('imgURL');
            const questionsQty = formData.get('questionsQty');
            const levelsQty = formData.get('levelsQty');
            
            return (validateQuizzTitle(title) && validateQuizzQuestions(questionsQty) && validateQuizzLevels(levelsQty) && validateURL(imgURL));

        case 1:
            
            break;

        case 2:
            
            break;

    }

}

function nextStep(){

    console.log('validou ', validateStep());
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
                    break;

                case 2:
                    quizzCreationTitle.innerText = 'Agora, decida os níveis';
                    forwardBtn.innerText = 'Finalizar Quizz';
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