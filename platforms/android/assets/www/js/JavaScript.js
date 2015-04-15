
   $(function(){  



		//On Load
		//show main menu and hide the no teams selected page and variable rules
		DisplayMainMenuScreen();
		

		//add to teams as default
		$(document).ready(function(){
		generateTeam();
		generateTeam();
		});




		//GAME MANAGMENT

		//All buttons

		//back to menu button!
		$(".back-to-menu-btn").click(function(){
            DisplayMainMenuScreen();
            //myCounter.stop();

        });

        //click to play
        $(".play-btn").click(function(){
        	DisplayMainGameScreen();                      
        });

      	//next turn
      	$(".next-turn-btn").click(function(){      		
        	DisplayMainGameScreen();                      
        });

         //click to go to toggle Screen
        $(".cat-selector-btn").click(function(){
        	DisplayToggleScreen();

        });

        //click to go to team menu
        $(".team-menu-btn").click(function(){
        	DisplayTeamMenuScreen();
        });

        $(".restart-game").click(function(){
        	RestartGame();
        });



        function HideEverything(){
        	$("#menu").hide();
        	$("#main-game").hide(); 
        	$("#toggle-page").hide();
        	$("#create-team-page").hide();
        	$("#turn-complete").hide();
        	$("#round-summary").hide();
        	$("#game-over-summary").hide();
        	$("#none-selected").hide();
			$("#variable-rule").hide();
			$("#game-over").hide();
        	//stop timer if ever go back page
        	stopSound("tick-tock");
        }




        //MAIN MENU SCREEN

        function DisplayMainMenuScreen(){
        	HideEverything();
        	$("#menu").show();
        	$(".team-menu-btn").show();
        }


        //clears teams of stats to start over
        function RestartGame(){     	

        	for(var i = 0; i < teamArray.length; i++){
        		teamArray[i].resetScore();
        		teamArray[i].currentTeam = false;   
        	} 
        	
        }




        //TOGGLE SCREEN

        function DisplayToggleScreen(){

        	HideEverything();


        	//fill array with categories if empty
        	if($("#category-list li").length === 0){
	        	for(var i = 0; i < Category.objects.length; i++)
	        	{
	        		var ul = document.getElementById("category-list");        		
					var li = document.createElement("li");				
					var name = Category.objects[i].getName();
					li.setAttribute("id", name);
					li.className = li.className + "category-toggle";
					li.appendChild(document.createTextNode(name));			
					ul.appendChild(li);		
	        	}
	        }

        	$("#toggle-page").show();        	

        }

        //enable all list items
        $(".enable-all-btn").click(function(){

        	$(".category-toggle").removeClass("disabled");

        	for(var i = 0; i < Category.objects.length; i++)
        	{
        		Category.objects[i].enabled = true;					
				
	       	}
        });

        //disable all list items
        $(".disable-all-btn").click(function(){

        	$(".category-toggle").addClass("disabled");

        	for(var i = 0; i < Category.objects.length; i++)
        	{
        		Category.objects[i].enabled = false;					
				
	       	}
        });

        //toggle the list items and change category to disabled/enabled
        $(document).on('click', "li.category-toggle", function () {
        	//change css effect
		    $(this).toggleClass("disabled");
		    //diable category
		    for(var i = 0; i < Category.objects.length; i++)
        	{
        				
				var name = Category.objects[i].getName();
				 
				if(name == this.id)	
				{
					Category.objects[i].enabled = !Category.objects[i].enabled;					
				}
        	}
		});

        //Flag up if no cat selected
        $(".play-btn").click(function(){

        	var anyEnabled = false;

	        for(var i = 0; i < Category.objects.length; i++)
        	{
				 
				if(Category.objects[i].enabled)	
				{
					 anyEnabled = true;					
				}
        	}

        	if(anyEnabled === false)
        	{
        		
        		HideEverything();
        		$("#none-selected").show();
        		setTimeout(function(){
        			$("#none-selected").hide();
        			DisplayToggleScreen(); }, 2000);
        	}

		});




		//TEAM SCREEN

		//Display the team menu screen
		function DisplayTeamMenuScreen(){
			
			HideEverything();				

			$("#create-team-page").show();

		}	


			



        
		


        //MAIN GAME SCREEN 

        var currentRound = 1
        var currentWord;

        function DisplayMainGameScreen(){
        	HideEverything();
            $("#main-game").show();
            $(".back-to-menu-btn").show();            
            $("#correct").hide();
            $("#incorrect").hide();
            $("#the-word").hide();



            //fill teams score list with teams scores
            //clear first so no repeats
            $("#team-score-list").empty();

            //then add items
            for(var i =0; i < teamArray.length; i++){
				var ul = document.getElementById("team-score-list");        		
				var li = document.createElement("li");	
				var name = teamArray[i].getName();			
				var score = teamArray[i].getScore();	
				li.appendChild(document.createTextNode(name + ": " + score));			
				ul.appendChild(li);								
			}

           	//choose team
           	ChooseCurrentTeam();
           		           		
           	//get current team and display their information           
           	var currentTeam = GetCurrentTeam();

           	

           	//display is there are no teams
            if(teamArray.length === 0){
            	$('h1').css({'border' : 'none'})
				$("#playerName").text("Need teams, fool");
				$("#begin-btn").hide();
				$(".team-menu-btn").show();

            }
            //display when there are enough teams
            else{
            	$('h1').css({'border' : '2px solid #34361a'})
            	$("#current-round").text("Round " + currentRound);
            	$("#playerName").text(currentTeam.getName());
            	$("#playerScore").text("Score: " + currentTeam.getTurnScore());
            	$("#timer").text("Time: 60");
            	$("#begin-btn").show();
            	$(".team-menu-btn").hide();
            }          
 
        }



        //game counter
        var myCounter = new Countdown({  
		    seconds:13,  // number of seconds to count down
		    onUpdateStatus: function(sec){$("#timer").text("Time: " + sec);}, // callback for each second
		    onCounterEnd: function(){ TurnOver(); } // final action    
		});



        //When turn is over
        function TurnOver(){
        	playSound("done-bell");

        	HideEverything();


        	var currentTeam = GetCurrentTeam();

        	$("#turn-complete").show();
        	$(".back-to-menu-btn").show();

        	$("#turn-score").text("This Turn Score: " + currentTeam.getTurnScore());
        	$("#total-score").text("Your Total Score: " + currentTeam.getScore());

        	currentTeam.turnComplete = true;

        	currentTeam.resetCurrentTurnScore();

        }



        //countdown function for timer
        function Countdown(options) {
			  var timer,
			  instance = this,
			  seconds = options.seconds || 60,
			  updateStatus = options.onUpdateStatus || function () {},
			  counterEnd = options.onCounterEnd || function () {};

			  function decrementCounter() {
			    updateStatus(seconds);
			    if (seconds === 0) {
			      counterEnd();
			      instance.stop();
			      stopSound("tick-tock");
			    }
			    
			    //check for 10 seconds up to stART TIMER noise
				if(seconds === 10){
				    	playSound("tick-tock");
				   };

			    seconds--;
			  }


			  this.start = function () {
			    clearInterval(timer);
			    timer = 0;
			    seconds = options.seconds;
			    timer = setInterval(decrementCounter, 1000);
			  };

			  this.stop = function () {
			    clearInterval(timer);			    
			  };
		}



        //choose Category
		function chooseCategory(){
			//create array of enabled categories
			var enabledArray = [];
			for(var i =0; i < Category.objects.length; i++){
				if(Category.objects[i].enabled === true)
				{
					enabledArray.push(Category.objects[i]);
				}
			}

			//choose random number
			var randomNumber = Math.floor(Math.random()* enabledArray.length);

			return(enabledArray[randomNumber]);

		}


		//display new unused word to screen
		function displayNewWord(){
			var chosenCategory = chooseCategory();			
			currentWord = chosenCategory.getWord();
			$("#the-word").text(currentWord);
			//save array int array int so no repeats
			chosenCategory.saveArrayInt();
		}

		//display used word for variable rule set
		function displayOldWord(){						
			oldWord = RandomArrayI(usedWordsArray);
			$("#the-word").text(oldWord);
		}


		//click span to begin round
		$("#begin-btn").click(function(){

			if(teamArray.length > 0){
				$("#begin-btn").hide();
				$(".back-to-menu-btn").hide();
				$("#the-word").show();
				$("#correct").show();
            	$("#incorrect").show();        
				displayNewWord();
				myCounter.start();
				playSound("begin-jingle");
				
			}
		});


		//button to get next word
		$("#correct").click(function(){			
			
			
			//show old word or new word
			if(VariableRuleCheck()){		
				displayOldWord();
			}
			else{
				//add current word to used words Array
				currentRoundUsedWords.push(currentWord);
				displayNewWord();
			}

			//play  sound
			playSound("correctSound");

			//increase score
			var currentTeam = GetCurrentTeam();
			currentTeam.changeScore(10);


		});

		$("#incorrect").click(function(){			
			
			//show old word or new word
			if(VariableRuleCheck()){		
				displayOldWord();
			}
			else{				
				displayNewWord();
			}

			//play  sound
			playSound("incorrectSound");

			//increase score
			var currentTeam = GetCurrentTeam();
			currentTeam.changeScore(-10);

		});











		//Variable Rules


   		//Array for already used words in previous rounds   		
   		usedWordsArray = [];

   		//words used this round
   		currentRoundUsedWords = [];

   		function VariableRuleCheck(){
   			var rule;

   			switch(currentRound){
   				case 1:   					
   					break;
   				case 2:
   					if(GenerateChance(2)){
   						rule = RandomArrayI(round2VRArray);   						
   						displayVariableRule(rule);
   						return true;  						
   					}
   					else{
   						hideVariableRule();
   						return false;
   					}
   					break;
   				case 3:
   					if(GenerateChance(3)){
   						rule = RandomArrayI(round3VRArray);
   						displayVariableRule(rule);
   						return true;  						
   					}
   					else{
   						hideVariableRule();
   						return false;
   					}
   					break;
   				case 4:
   					if(GenerateChance(5)){
   						rule = RandomArrayI(round4VRArray);
   						displayVariableRule(rule); 
   						return true;  						
   					}
   					else{
   						hideVariableRule();
   						return false; 
   					}
   					break;
   				case 5:
   					if(GenerateChance(7)){
   						rule = RandomArrayI(round5VRArray);
   						displayVariableRule(rule);
   						return true;   						
   					}
   					else{
   						hideVariableRule();
   						return false; 
   					}
   					break;
   			}
   		}


   		//checks if it will add a varivle rule, gets chance
   		function GenerateChance(number1){
   			var randomNumber = Math.floor(Math.random() * 10);

   			if(randomNumber < number1){
   				return true;
   			}
   			else{
   				return false;
   			}
   		}

   		

   		//displays and hide variable rule
   		function displayVariableRule(rule){
   			$("#team-score-list").hide();
   			$("#variable-rule").text(rule);
   			$("#variable-rule").show();
   		}
   		function hideVariableRule(){
			$("#team-score-list").show();
   			$("#variable-rule").hide();
   		}



   		//Variable rule arrays
   		round2VRArray = [
   		"One word + Actions"   		
   		];

   		round3VRArray = [
   		"One word + Actions",
   		"Alliteration"		
   		];

   		round4VRArray = [
   		"One word + Actions",
   		"Alliteration",
   		"Actions"		
   		];

   		round5VRArray = [   		
   		"Alliteration",
   		"Actions",
   		"Only move your head"
   		];



   		//get random entry in array
   		function RandomArrayI(array){
   			var randomNumber = Math.floor(Math.random()* array.length);

   			return array[randomNumber];
   		}









		//Round Summary Page

		function DisplayRoundSummaryPage(){
			HideEverything();

			//add current round words to used words array
			for(i = 0; i < currentRoundUsedWords.length; i++){
				usedWordsArray.push(currentRoundUsedWords[i]);
			}

			$("#score-list").empty();

			//create sorted array
			var sortedArray = teamArray.slice(0);
			sortedArray.sort(SortByScore);

            //then add items
            for(var i =0; i < sortedArray.length; i++){
				var ul = document.getElementById("score-list");        		
				var li = document.createElement("li");	
				var name = sortedArray[i].getName();			
				var score = sortedArray[i].getScore();	
				if(i === 0){
					li.appendChild(document.createTextNode("Top Dogs " + name + " with " + score));
					ul.appendChild(li);
				}
				else if(i === sortedArray.length -1 ){
					li.appendChild(document.createTextNode("Poor " + name + " with " + score));
					ul.appendChild(li);
				}
				else{	
					li.appendChild(document.createTextNode(name + "'s score is " + score));			
					ul.appendChild(li);
				}


			}

			$("#round-title").text("Round " + currentRound + " Over");

					
			$("#round-summary").show();

			if(currentRound == 5){				
				$("#continue").hide();
				$("#game-over").show();
				currentRound = 0;
				
			}
			

		}

		//sort the array into descending order
		function SortByScore(a, b){
          var aValue = a.getScore();
          var bValue = b.getScore(); 
          return ((aValue > bValue) ? -1 : ((aValue < bValue) ? 1 : 0));
        }
        







		//TEAMS

		//teams array
		var teamArray = [];

		//team prototype
		function Team(name){

			this.score = 0;

			this.currentTurnScore = 0;

			this.name = "Team " + name;

			this.currentTeam = false;

			this.turnComplete = true;

			this.setName = function(name){
				this.name = name;
			};

			this.getName = function(){
				return this.name;
			};

			this.getCurrentTeam = function(){
				return this.currentTeam;
			}

			this.getScore = function(){
				return this.score;
			}

			this.getTurnScore = function(){
				return this.currentTurnScore;
			}

			this.changeScore = function(score){
				this.score += score;
				this.currentTurnScore += score;
				$("#playerScore").text("Score: " + this.currentTurnScore);
			}

			this.resetCurrentTurnScore = function(){
				this.currentTurnScore = 0;
			}

			this.resetScore = function(){
				this.score = 0;
				this.currentTurnScore = 0;
			}


		}


		//generate teams
		function generateTeam(){
			//check array position to add to parameter to add to list
			var arrayPos;

			if(teamArray === undefined || teamArray.length === 0){
				teamArray[0] = new Team(1);
				arrayPos = 0;
			}
			else{
				teamArray[teamArray.length] = new Team(teamArray.length + 1);
				arrayPos = teamArray.length -1;
			}

			addToTeamList(arrayPos);			
		}

		//if true, will delete next team clicked
		var removeTeam = false;


		//begin to generate a team when add team is clicked
		$(".add-team-btn").click(function(){
			generateTeam();
		});

		$(".remove-team-btn").click(function(){
			if(removeTeam){
				removeTeam = false;
				$(this).removeClass("remove-team-btn-enabled");
			}
			else{
				removeTeam = true;
				$(this).addClass("remove-team-btn-enabled");
			}
		});
		
		
		//adds to end of team ul ( for newly added teams)
	    function addToTeamList(arrayPos){
			
	        var ul = document.getElementById("team-list");        		
			var li = document.createElement("li");				
			var name = teamArray[arrayPos].getName();
			li.setAttribute("id", name);
			li.className = li.className + "team";
			li.appendChild(document.createTextNode(name));			
			ul.appendChild(li);		
	       }	

	    function updateToTeamList(teamID, newName){
			var li = document.getElementById(teamID);
			li.innerHTML = newName;
	    }     


	    // when click on "team" change name or delete    
	    $(document).on('click', "li.team", function () {

	    	if(removeTeam){
	    		
		    	for(var i = 0; i < teamArray.length; i++)
	        	{	
					var name = teamArray[i].getName();

					if(name === this.innerHTML){
						teamArray.splice(i, 1);
					}
	        	}

	        	removeTeam = false;

	        	$(".remove-team-btn").removeClass("remove-team-btn-enabled");

	        	this.remove();

	        	DisplayTeamMenuScreen();

	        	return;
	    	}
	    	

	    	var newName = prompt("Enter your team Name: ", "team name here");

		    for(var i = 0; i < teamArray.length; i++)
        	{		
				var name = teamArray[i].getName();
				 
				if(name === this.innerHTML && newName != "team name here" 
					&& newName != null && newName != " ")	
				{
					teamArray[i].setName(newName);
					updateToTeamList(this.id, newName);				
				}
        	}
		});
	    
	    //set the current team
	    function ChooseCurrentTeam(){


	    	for(var i = 0; i < teamArray.length; i++)
        	{ 	

				if(teamArray[i].getCurrentTeam()){
					
					//if current team has not finished
					if(teamArray[i].turnComplete === false){
						return;
					}

					//if at the end of the array, loop around
					if(i === teamArray.length -1){
						//turn complete and stop being current team
						teamArray[i].currentTeam = false;
						teamArray[i].turnComplete = true;

						//loop around and 0 becomes current team
						teamArray[0].currentTeam = true;
						teamArray[0].turnComplete = false;

						DisplayRoundSummaryPage();

						currentRound += 1;
					}
					//else the next team is made current team
					else{
						var nextArrayI = i+1;
						teamArray[i].currentTeam = false;
						teamArray[i].turnComplete = true;

						teamArray[nextArrayI].currentTeam = true;
						teamArray[nextArrayI].turnComplete = false;					
					}

					return;

				}

			}

			if(teamArray.length > 0){

				for(var i = 0; i < teamArray.length; i++)
        		{ 
					teamArray[i].currentTeam = false;
					teamArray[i].turnComplete = true;
				}

				teamArray[0].currentTeam = true;
				teamArray[0].turnComplete = false;
				
				
			}
        } 
        	

	        



			     	
	    

   		//Get Current Team
   		function GetCurrentTeam(){

   			//if empty tell them they need to add teams
   			if(teamArray.length === 0){
        		return "Need some teams!";
        	}

   			//sort through array
   			var teamArrayPos;
   			
   			for(var i = 0; i < teamArray.length; i++){ 
   				if(teamArray[i].currentTeam){
   					teamArrayPos = teamArray[i];   					
   				} 
        	}

        	if(teamArrayPos === null){
        		return null;
        	}
        	else{
        		return teamArrayPos;
        	}

   		}






	







        //CATEGORIES

        //category array
		Category.objects = [];

        //shuffle function
        function shuffle(array) {
		    var counter = array.length, temp, index;

		    // While there are elements in the array
		    while (counter > 0) {
		        // Pick a random index
		        index = Math.floor(Math.random() * counter);

		        // Decrease counter by 1
		        counter--;

		        // And swap the last element with it
		        temp = array[counter];
		        array[counter] = array[index];
		        array[index] = temp;
		    }

		    return array;
		}

		//catergory prototype
		function Category(name){

			//category name
			this.name = name;

			//has this been toggled?
			this.enabled = true;

			//array information
			this.wordArray = [];


			//set wordArrayInt based on local storage
			if(localStorage.getItem(this.name + "ArrayInt" === null)){
				this.wordArrayInt = 0;
			}
			else{
				var storedArrayInt = localStorage.getItem(this.name + "ArrayInt");

				this.wordArrayInt = parseInt(storedArrayInt);
			}



			//add to category array
			Category.objects.push(this);		



			//returns word from array
			this.getWord = function(){

				//loops through array index
				if(this.wordArrayInt < this.wordArray.length - 1){
					this.wordArrayInt += 1;
				}
				else{
					this.wordArrayInt = 0;
					//shuffle array when looping through again
					shuffle(this.wordArray);
					this.saveArray();
				}

				//returns current word
				return(this.wordArray[this.wordArrayInt]);				
			};


			//allows access to category name
			this.getName = function(){
				return(name);
			};

			//save array int to local storage so no repeats!
			this.saveArrayInt = function(){
				localStorage.setItem(this.name + "ArrayInt", this.wordArrayInt);				
			};

			this.saveArray = function(){
				localStorage.setItem(this.name + "Array", JSON.stringify(this.wordArray));				
			};

			this.loadArray = function(){
				if(localStorage.getItem(this.name + "Array") === null){
					return null;
				}
				else{			
					var storedArray = localStorage.getItem(this.name + "Array");
					this.wordArray = JSON.parse(storedArray);				
				}
			};

	
		}

		//animal catergory
		var animalCategory = new Category("Animals");
		
		//fill array
		animalCategory.wordArray = [
			"Bear",
			"Wolf",
			"Snake",
			"Cat",
			"Monkey",
			"Lizard",
			"Lynx",
			"Fox",
			"Octopus",
			"Penguin",
			"Skunk",
			"Starfish",
			"Tortoise",
			"Turtle",
			"Crocodile",
			"Hippo",
			"Killer Whale",
			"Lion",
			"Stingray",
			"Shark",
			"Blue Whale",
			"Cow",
			"Chinchilla",
			"Duck",
			"Guinea Pig",
			"Hamster",
			"Dog",
			"Panda",
			"Leopard",
			"Polar Bear",
			"Rhino",
			"Dolphin",
			"Tiger",
			"Bullfrog",
			"Newt",
			"Toad",
			"Heron",
			"Eagle",
			"Magpie",
			"Hummingbird",
			"Puffin",
			"Vulture",
			"Crab",
			"Prawn",
			"Sponge",
			"Snail",
			"Grasshopper",
			"Earwig",
			"Elephant",
			"Bat",
		];

		//load previously saved array
		animalCategory.loadArray();


		//movie celebrity catergory
		var movieCelebrityCategory = new Category("Movie Celebrities");

		movieCelebrityCategory.wordArray = [			
			"Johnny Depp",
			"Arnold Schwarzenegger",
			"Jim Carrey",
			"Emma Watson",
			"Daniel Radcliffe",
			"Leonardo DiCaprio",
			"Tom Cruse",
			"Brad Pitt",
			"Charlie Chaplin",
			"Morgan Freeman",
			"Tom Hanks",
			"Sylvester Stallone",
			"Will Smith",
			"Clint Eastwood",
			"Cameron Diaz",
			"George Clooney",
			"Steven Spielberg",
			"Harrison Ford",
			"Robert De Niro",
			"Robert Downey Jr",
			"Russel Crowe",
			"Kate Winslet",
			"Natalie Portman",
			"Pierce Brosnan",
			"Sean Connery",
			"Jackie Chan",
			"Angelina Jolie",
			"Adam Sandler",
			"Scarlett Johansson",
			"Anne Hathaway",
			"Jessica Alba",
			"Will Ferrell",
			"Julia Roberts",
			"Daniel Craig",
			"Keanu Reeves",
			"Halle Berry",
			"Bruce Willis",
			"Samuel L. Jackson",
			"Sandra Bullock",
			"Drew Barrymore",
			"Mel Gibson",
			"Tim Allen",
			"Robin Williams",
			"Peter Jackson",
			"Bruce Lee",
			"Macaulay Culkin",
			"Jack Nicholson",
			"Sigourney Weaver",
			"Rowan Atkinson",
			"John Travolta",
			"Jennifer Aniston",

		];

		movieCelebrityCategory.loadArray();

		//food catergory
		var foodCategory = new Category("food");

		foodCategory.wordArray = [
			"Bread",
			"Dough",
			"Milk",
			"Cheese",
			"Butter",
			"Margarine",
			"Egg",
			"Peas",
			"Chickpeas",
			"Apples",
			"Oranges",
			"Grapes",
			"Strawberrys",
			"Bananas",
			"Lemons",
			"Potato",
			"Eggplant",
			"Onion",
			"Mushroom",
			"Sausage",
			"Burger",
			"Kebab",
			"Bacon",
			"Nuts",
			"Sushi",
			"Rice",
			"Gravy",
			"Chocolate",
			"Ice Cream",
			"Cream",
			"Noodles",
			"Chips",
			"Salad",
			"Sandwich",
			"Soup",
			"Pancakes",
			"Pizza",
			
		];

		foodCategory.loadArray();
		
    });










//Audio function - plays sound
	function playSound(sound){
		document.getElementById(sound).currentTime = 0;
		document.getElementById(sound).play();
	}

	function stopSound(sound){
		document.getElementById(sound).pause();
	}
