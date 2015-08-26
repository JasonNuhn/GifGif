// Actions act as a sort of proxy to call methods on our store This helps by removing some 
//level of complexity and helping us avoid rewriting repetitious code in our various methods.
//I believe this is what is referred to in the Flux pattern as the 'action dispatcher'
/*****************************************************
			    INITIALIZATION BOILERPLATE
*****************************************************/
var Reflux = require('reflux');



/*****************************************************
	     DEFINING ACTIONS OBJECT TO BE EXPORTED
*****************************************************/
// The createActions method will take an array of string names and created named methods
//out of them that we can call in other parts of our program
module.exports = Reflux.createActions([
	'getGifs',
	'getGif'
]);