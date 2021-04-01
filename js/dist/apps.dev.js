"use strict";

var research = document.getElementById('search');
var notify = document.getElementById('searched-text');
var btnSearch = document.getElementById('searchBtn');
var result = document.getElementById('results');
var form = document.getElementById('form');
var notes = document.getElementById('notifications');
var star = document.querySelector('.star');
var favorite = document.querySelector('.favorite');
var removeAll = document.querySelector('.clear-all');
var deleteItems = document.querySelector('.delete-items span');
var favSongs = document.querySelector('.fav-list');
var remove_Item = document.querySelector('.remove-item');
var btn_Music = document.querySelector('.btn_music');
var play = document.querySelector('.fa-play-circle');
var pause = document.querySelector('.fa-pause-circle');
var myMusic = document.getElementById('music'); // OPEN AND CLOSE FAVORITE LIST

star.addEventListener('click', function () {
  favorite.classList.toggle('favorite-view');
}); // API URL

var apiURL = 'https://api.lyrics.ovh'; // ADD EVENT LISTENER

form.addEventListener('submit', function (e) {
  e.preventDefault();
  searchValue = research.value.trim();

  if (!searchValue) {
    alert("There is nothing to search");
  } else {
    searchSong(searchValue);
  }
}); // PRESS ENTER TO SEARCH

research.addEventListener('keydown', function (e) {
  if (e.key === 13) {
    searchSong();
  }
}); // SEARCH SONG

function searchSong(searchValue) {
  var searchResult, data;
  return regeneratorRuntime.async(function searchSong$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(fetch("".concat(apiURL, "/suggest/").concat(searchValue)));

        case 2:
          searchResult = _context.sent;
          _context.next = 5;
          return regeneratorRuntime.awrap(searchResult.json());

        case 5:
          data = _context.sent;
          showData(data);
          console.log(data);

        case 8:
        case "end":
          return _context.stop();
      }
    }
  });
} // DISPLAY FINAL RESULT


function showData(data) {
  notify.innerHTML = "Searched for  " + "\"".concat(research.value, "\"");

  if (data.data < '0') {
    var message = "No results for  " + "\"".concat(research.value, "\"");
    notes.style.visibility = "visible";
    notes.style.backgroundColor = "lightcoral";
    notes.style.color = "darkred";
    notes.style.fontSize = "25px";
    notes.innerHTML = message;
  } else result.innerHTML = "\n  <ul class=\"song-list\">\n    ".concat(data.data.map(function (song) {
    return "<li>\n                    <span>\n                      <strong>".concat(song.artist.name, "</strong> -").concat(song.title, " \n                    </span>\n                    <div class=\"buttons\">\n                      <button class=\"btn\" data-artist=\"").concat(song.artist.name, "\" data-songtitle=\"").concat(song.title, "\">Get Lyrics</button>\n                      <audio id=\"music\" src=\"data-preview='").concat(song.link, "'\"></audio>\n                      <button class=\"btn_music\">\n                          <i class=\"far fa-play-circle\"></i>\n                          <i class=\"far fa-pause-circle\"></i>\n                      </button>\n                      <button onclick = \"addToList('").concat(song.artist.name, "', '").concat(song.title, "', '").concat(song.id, "')\" class=\"add\"><i class=\"fas fa-plus\"></i></button>\n                    </div>\n              </li>");
  }).join(''), "\n  </ul>\n");

  if (data.prev || data.next) {
    more.innerHTML = "\n    ".concat(data.prev ? "<button class=\"btn\" onclick=\"getMoreSongs('".concat(data.prev, "')\">Prev</button>") : '', "\n    ").concat(data.next ? "<button class=\"btn\" onclick=\"getMoreSongs('".concat(data.next, "')\">Next</button>") : '', "\n    ");
  } else {
    more.innerHTML = '';
  }
} //MORE SONGS


function getMoreSongs(url) {
  var res, data;
  return regeneratorRuntime.async(function getMoreSongs$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(fetch("https://cors-anywhere.herokuapp.com/".concat(url)));

        case 2:
          res = _context2.sent;
          _context2.next = 5;
          return regeneratorRuntime.awrap(res.json());

        case 5:
          data = _context2.sent;
          result.innerHTML = '';
          showData(data);

        case 8:
        case "end":
          return _context2.stop();
      }
    }
  });
}
/*
// PREVIEW SONG
btn_Music.addEventListener('click', function(){
  play.toggleClass('hide');
  pause.toggleClass('fadeIn');
  myMusic.play();
})

btn_Music.addEventListener('click', function(){
  pause.toggleClass('hide');
  play.toggleClass('fadeIn');
  myMusic.pause();
})
*/
//EVENT LISTENER TO GET LYRICS


result.addEventListener('click', function (e) {
  var clickedElement = e.target; //CHECKING CLICKED ELEMENT IS BUTTON OR NOT

  if (clickedElement.tagName === 'BUTTON') {
    var artist = clickedElement.getAttribute("data-artist");
    var songTitle = clickedElement.getAttribute("data-songtitle");

    var _songId = clickedElement.getAttribute("data-id");

    getLyrics(artist, songTitle, _songId);
  }
}); // GET LYRICS FOR SONG

function getLyrics(artist, songTitle) {
  var res, data, lyrics;
  return regeneratorRuntime.async(function getLyrics$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(fetch("".concat(apiURL, "/v1/").concat(artist, "/").concat(songTitle)));

        case 2:
          res = _context3.sent;
          _context3.next = 5;
          return regeneratorRuntime.awrap(res.json());

        case 5:
          data = _context3.sent;
          lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>');
          results.innerHTML = "\n                 \n                  <h2><strong>".concat(artist, "</strong> - ").concat(songTitle, "</h2>\n                  <p>").concat(lyrics, "</p>");

        case 8:
        case "end":
          return _context3.stop();
      }
    }
  });
} // PREVIEW OF A SONG
//ADD SONG TO FAVOURITE LIST


function addToList(artist, songTitle, songId) {
  var favorites = getFavorites();
  favorites.push({
    artist: artist,
    songTitle: songTitle,
    songId: songId
  });
  localStorage.setItem("favorites", JSON.stringify(favorites));
  notes.style.visibility = "visible";
  notes.innerHTML = "Song successfully added to favorite list";
} //invoke showFavorites on adding new new list to favourites


showFavorites(); // RETRIEVING AUTHOR AND TITLE 

function getFavorites() {
  var favorites = JSON.parse(localStorage.getItem("favorites"));

  if (favorites) {
    return favorites;
  } else {
    return [];
  }
}

function showFavorites() {
  var favorites = JSON.parse(localStorage.getItem("favorites"));

  if (favorites.length) {
    favSongs.innerHTML = "<ul class=\"fav\">\n                              \n                          ".concat(favorites.map(function (fav) {
      return "<li>".concat(fav.artist, " - ").concat(fav.songTitle, " <button class=\"remove-item\">Remove</button></li>");
    }).join(""), "\n\n                              \n                         \n                        </ul>\n                        ");
  }
}

showFavorites(); // REMOVE ALL ITEMS FROM LIST

removeAll.addEventListener('click', function () {
  var msg = confirm("Are you sure to delete all items from the list?");

  if (msg = "ok") {
    localStorage.clear("favorites");
    var items = "All items have been deleted";
    favSongs.innerHTML = '';
    deleteItems.innerHTML = items;
  }
}); // REMOVE SINGLE ITEM 

remove_Item.addEventListener('click', function () {
  localStorage.removeItem(favorites[songId]);
});