
$(function() {

	var inputText = "";
	var html = "";
	var textLength;
	var $el = $(".example")
	var blurAmount = .1;

	
	$( "form" ).submit(function(e) {
		e.preventDefault();
		inputText = $('#input-text').val();
		textLength = inputText.length;
		originalWords = inputText;
		words = splitWords(inputText);
		wordScroll($el, words);
		howBlurry(blurAmount);

	});

	$( ".flip" ).click(function(){
		$(this).toggleClass('active');
		$('form').toggleClass('active');
	});	
		
	function wordScroll() {
		$el.html(words.splice(0,1)).hide().fadeIn(200);
		if(words.length > 0) {
			setTimeout( wordScroll, 1000);
		} else {
			var markov = new Markov(originalWords, 3);
			originalWords = markov.generateText(textLength);
			words = splitWords(originalWords);
			setTimeout( wordScroll, 1000);
			howBlurry(blurAmount);
		}
	}

	function splitWords(n) {
	return n.split(" ")
	}

	function howBlurry(n) {
		$('h1').css('text-shadow', '0 0 ' + n +'em rgba(255,255,255, .5)')
		blurAmount += .05;
		console.log(blurAmount);
	}

	function Markov(sourceText, order) {
	this.sourceText = sourceText;
    this.order = order;
	this._setupFrequencies();
	}

	//random markov js
	Markov.prototype = {
		_setupFrequencies: function() {
			this.frequencies = {};
	        // for each substring of length <order>,
	        // create an array of characters that can follow it
	        for (var i = 0; i < this.sourceText.length - (this.order - 1); i++) {
	            var chunk = this.sourceText.substr(i, this.order);
	            if (!this.frequencies.hasOwnProperty(chunk)) {
	                var followers = [];
	                for (var k = 0; k < this.sourceText.length - (this.order - 1); k++) {
	                    if (this.sourceText.substr(k, this.order) == chunk) {
	                        follower = this.sourceText.substr(k + this.order, 1);
	                        followers.push(follower);
	                    }
	                }
	                this.frequencies[chunk] = followers;
	            }
	        }

	    },
	    _getRandomChar: function(chunk) {
	        if (!this.frequencies.hasOwnProperty(chunk)) {
	            return '';
	        }
	        var followers = this.frequencies[chunk];
	        var randIndex = Math.floor(Math.random() * followers.length);
	        return followers[randIndex];
	    },
	    _getRandomChunk: function() {
	        var randIndex = Math.floor(Math.random() * this.sourceText.length);
	        return this.sourceText.substr(randIndex, this.order);
	    },
	    generateText: function(length) {
	        if (this.sourceText.length <= this.order) {
	            return '';
	        }
	        var text = this._getRandomChunk();
	        // take the last <order> characters from the generated string,
	        // select one of its possible followers, and append it
	        for (var i = this.order; i < length; i++) {
	            var currentChunk = text.substr(text.length - this.order);
	            var newChar = this._getRandomChar(currentChunk);
	            if (newChar != '') { // the last chunk of the source has no follower
	                text += newChar;
	            } else {
	                text += this._getRandomChunk();
	            }
	        }
	        return text;
	    }
	}

});



