/*jshint esversion:9 */

// variáveis de controle de criação de um quiz
let creationActualStep = 0;
// ----------------------
const quizzListsScreen = document.querySelector('.quizz-lists-screen');
const quizzScreen = document.querySelector('.quizz-screen');
const quizzCreationScreen = document.querySelector('.quizz-creation-screen');

function changeScreen(screenClass){
    
    switch (screenClass) {
        
        case 'lists':
            quizzListsScreen.classList.remove('hidden');
            quizzScreen.classList.add('hidden');
            quizzCreationScreen.classList.add('hidden');
            break;

        case 'quizz':
            quizzListsScreen.classList.add('hidden');
            quizzScreen.classList.remove('hidden');
            quizzCreationScreen.classList.add('hidden');
            break;

        case 'creation':
            quizzListsScreen.classList.add('hidden');
            quizzScreen.classList.add('hidden');
            quizzCreationScreen.classList.remove('hidden');
            resetQuizzCreation();
            break;
    
    }

}

function resetQuizzCreation(){

    const form = quizzCreationScreen.querySelector('form');
    const step1 = quizzCreationScreen.querySelector('.step1');
    const step2 = quizzCreationScreen.querySelector('.step2');
    const step3 = quizzCreationScreen.querySelector('.step3');
    const finalScreen = quizzCreationScreen.querySelector('.final-screen');
    const forwardBtn = quizzCreationScreen.querySelector('.forward-btn');
    const backHomeBtn = quizzCreationScreen.querySelector('.back-home-btn');
    
    form.reset();
    step1.classList.remove('hidden');
    step2.classList.add('hidden');
    step2.innerHTML = '';
    step3.classList.add('hidden');
    step3.innerHTML = '';
    finalScreen.classList.add('hidden');
    forwardBtn.innerText = 'Prosseguir para criar perguntas';
    backHomeBtn.classList.add('hidden');

    creationActualStep = 0;

}