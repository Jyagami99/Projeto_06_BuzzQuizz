/*jshint esversion:9 */

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
            break;
    
    }

}