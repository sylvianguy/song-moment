'use strict';

var myApp = {};

myApp.apiUrl = "https://api.spotify.com/v1/search";

myApp.uriArray = [];

myApp.weddingSong = [];
myApp.babySong = [];

myApp.runResults = function (choice) {
	return myApp.getArtists(choice).then(function (res) {
		var artist = res.artists.items[0];
		if (artist !== undefined) {

			//*** calling getAlbums and getting data of artist
			return myApp.getAlbums(artist.id).then(function (res) {
				var album = res.items[0].id;
				return myApp.getTracks(album)

				// *** Calling getTracks and getting data for tracks
				.then(function (res) {
					// **** Get full list of tracks
					var newArray = [];
					return res.items.map(function (item) {
						// *** Get single IDS from list of tracks
						var allTracks = item.uri;
						var pushedItems = newArray.push(allTracks);
						return newArray;
					});
				});
			});
		}
	});
};

//displays Iframe on the page
//randomizes playlists
myApp.createIframe = function (filteredRandom) {
	var wedding = filteredRandom[Math.floor(Math.random() * filteredRandom.length)];
	filteredRandom.splice(filteredRandom.indexOf(wedding), 1);
	var displayWedding = '<iframe src="https://embed.spotify.com/?uri=' + wedding + '" width="300" height="80" frameborder="0" allowtransparency="true"></iframe>';
	$('.weddingSong').append(displayWedding);

	var babySong = filteredRandom[Math.floor(Math.random() * filteredRandom.length)];
	filteredRandom.splice(filteredRandom.indexOf(babySong), 1);
	var displayBabySong = '<iframe src="https://embed.spotify.com/?uri=' + babySong + '" width="300" height="80" frameborder="0" allowtransparency="true"></iframe>';
	$('.babySong').append(displayBabySong);

	var cookingSong = filteredRandom[Math.floor(Math.random() * filteredRandom.length)];
	filteredRandom.splice(filteredRandom.indexOf(cookingSong), 1);
	var displayCooking = '<iframe src="https://embed.spotify.com/?uri=' + cookingSong + '" width="300" height="80" frameborder="0" allowtransparency="true"></iframe>';
	$('.cookingSong').append(displayCooking);

	var dogHouse = filteredRandom[Math.floor(Math.random() * filteredRandom.length)];
	filteredRandom.splice(filteredRandom.indexOf(dogHouse), 1);
	var displayDogHouse = '<iframe src="https://embed.spotify.com/?uri=' + dogHouse + '" width="300" height="80" frameborder="0" allowtransparency="true"></iframe>';
	$('.dogHouse').append(displayDogHouse);
};

myApp.loadingAnim = function () {
	//Waits for iframe to load before showing grey boxes and descriptions
	$('iframe').load(function () {
		console.log("things have loaded");
		$('.section__results').fadeIn(800);
		$('.loadingText').fadeOut(800);
		$('.loading').removeClass('show-loading');
		$('.loading').css('display', 'none');
		myApp.tweet();
	});
};

myApp.displayChoices = function (results) {
	console.log("Resuts", results);
	//*** Generate random track ID
	var randomSongs = [];
	var filteredRandom = [];
	var updated = [];

	results.filter(function (item) {
		console.log("ERROR");
		return item !== undefined;
	}).map(function (item) {
		var random = item[Math.floor(Math.random() * item.length)];
		randomSongs.push(random);
	});

	randomSongs.map(function (song) {
		var randomList = song[Math.floor(Math.random() * song.length)];
		filteredRandom.push(randomList);
	});

	myApp.createIframe(filteredRandom);
	myApp.loadingAnim();
};

//*** function to initialize
myApp.init = function () {
	$('form').on('submit', function (e) {
		e.preventDefault();
		$('input[type=submit]', this).attr('disabled', 'disabled').addClass('highlight');
		//*** Getting the user's choice
		//Using toArray() to make our jquery into an JS array
		//Because promises 
		var userOneChoice = $('.selected').toArray();
		var userChoiceArray = userOneChoice.map(function (choice) {
			myApp.userChoice = $(choice).val();
			return myApp.runResults(myApp.userChoice);
		});

		//When a Promise returns ALL results back
		//Then loop through our array and randomize
		Promise.all(userChoiceArray).then(function (response) {
			//THEN call my function that randomizes my data
			myApp.displayChoices(response);
		});
		$('.loading').addClass('show-loading');
		$('.loadingText').fadeIn(800);
	});
};

//*** get music genres
myApp.getArtists = function (chosenArtist) {
	return $.ajax({
		url: myApp.apiUrl,
		method: 'GET',
		dataType: 'json',
		data: {
			q: chosenArtist,
			type: 'artist',
			limit: 10
		}
	}); //end of ajax
}; //end myApp.getArtists

myApp.getAlbums = function (id) {
	return $.ajax({
		url: 'https://api.spotify.com/v1/artists/' + id + '/albums',
		method: 'GET',
		dataType: 'json',
		data: {
			limit: 10
		}
	});
};

myApp.getTracks = function (id) {
	return $.ajax({
		url: 'https://api.spotify.com/v1/albums/' + id + '/tracks',
		method: 'GET',
		dataType: 'json',
		data: {
			limit: 10
		}
	});
};

myApp.tweet = function () {
	$('.tweet-button').empty();
	var tweetBtn = $('<a></a>').addClass('twitter-share-button').attr('href', 'http://twitter.com/share').attr('data-url', 'http://www.sylvia.io/song-moment').attr('data-text', 'A cute app that generates a song for your relationship milestones using the Spotify API').attr('data-hashtags', 'couplesmilestone' + ' #playlists' + ' #spotify').attr('data-size', 'large');
	$('.tweet-button').append(tweetBtn);
	twttr.widgets.load();
	console.log(tweetBtn);
	$('.tweet').html("Share the love with your friends!");
};

$(function () {
	myApp.init();

	//smoothscroll
	$(".smoothScroll").click(function (e) {
		e.preventDefault();
		var dest = 0;
		if ($(this.hash).offset().top > $(document).height() - $(window).height()) {
			dest = $(document).height() - $(window).height();
		} else {
			dest = $(this.hash).offset().top;
		}
		//go to destination
		$('html,body').animate({ scrollTop: dest }, 500, 'swing');
	});

	//smooth scroll to results
	$('#results').on('click', function () {
		console.log("hello");
		if ($(this).length) {
			$('html, body').animate({
				scrollTop: $(this).offset().top
			}, 3000);
		}
	});
});