/*jshint esversion:9 */

const loadingScreen = document.querySelector('.loading-screen');

function showLoading(){
    loadingScreen.classList.remove('hidden');
}

function hideLoading(){
    loadingScreen.classList.add('hidden');
}