const research = document.getElementById('search');
const notify = document.getElementById('searched-text');
const btnSearch = document.getElementById('searchBtn');
const result = document.getElementById('results');
const form = document.getElementById('form');
const notes = document.getElementById('notifications');
const star = document.querySelector('.star');
const favorite = document.querySelector('.favorite');
const removeAll = document.querySelector('.clear-all');
const deleteItems = document.querySelector('.delete-items span');
const favSongs = document.querySelector('.fav-list');
const removeItem = document.querySelector('.remove-item');

let searchResults = null;
let selectedSong = null;




// OPEN AND CLOSE FAVORITE LIST
star.addEventListener('click', () => {
   favorite.classList.toggle('favorite-view');
})


// API URL
const apiURL = 'https://api.lyrics.ovh';



// ADD EVENT LISTENER

form.addEventListener('submit', e => {
  e.preventDefault();
  searchValue = research.value.trim()

  if (!searchValue){
    alert("There is nothing to search")
  }
  else {
    searchSong(searchValue);
  }
  
})

// PRESS ENTER TO SEARCH
research.addEventListener('keydown', function(e){
  if(e.key === 13){
    searchSong();
  }
})

// SEARCH SONG

async function searchSong(searchValue){
  const searchResult = await fetch(`${apiURL}/suggest/${searchValue}`);
  const data = await searchResult.json();
  searchResults = data;
  showData(data);

}


// DISPLAY FINAL RESULT

function showData(data){
 
  notify.innerHTML = ("Searched for  " +`"${research.value}"`);
  
  if (data.data < '0'){ 
    let message = ("No results for  "  +`"${research.value}"`);
    notes.style.visibility = "visible";
    notes.style.backgroundColor = "lightcoral";
    notes.style.color = "darkred";
    notes.style.fontSize = "28px";
    notes.innerHTML = message;
}else{
  result.innerHTML = `
  <ul class="song-list">
    ${data.data
      .map(song=> `<li>
                    <span>
                      <strong>${song.artist.name}</strong> -${song.title} 
                    </span>
                  <button class="btn" data-id="${song.id}" >Get Lyrics</button>
                  
              </li>`
      )
      .join('')}
  </ul>
`};

  if (data.prev || data.next) {
    more.innerHTML = `
    ${data.prev ? `<button class="btn" onclick="getMoreSongs('${data.prev}')">Prev</button>` : ''}
    ${data.next ? `<button class="btn" onclick="getMoreSongs('${data.next}')">Next</button>` : ''}
    `;
  } else {
    more.innerHTML = '';
  }

 

  
  }




//MORE SONGS
async function getMoreSongs(url){
  (function() {
    var cors_api_host = 'cors-anywhere.herokuapp.com';
    var cors_api_url = 'https://' + cors_api_host + '/';
    var slice = [].slice;
    var origin = window.location.protocol + '//' + window.location.host;
    var open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function() {
        var args = slice.call(arguments);
        var targetOrigin = /^https?:\/\/([^\/]+)/i.exec(args[1]);
        if (targetOrigin && targetOrigin[0].toLowerCase() !== origin &&
            targetOrigin[1] !== cors_api_host) {
            args[1] = cors_api_url + args[1];
        }
        return open.apply(this, args);
    };
})();
  const res = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
  const data = await res.json();
  result.innerHTML = '';
  showData(data);
 
}

//EVENT LISTENER TO GET LYRICS
result.addEventListener('click', e=>{
    const clickedElement = e.target;

    //CHECKING CLICKED ELEMENT IS BUTTON OR NOT
    if (clickedElement.tagName === 'BUTTON'){
        const songId = clickedElement.getAttribute("data-id");
        const song = getSongFromId(songId)
        selectedSong = song
        getLyrics(song.artist.name, song.title);
        
       
    }
})

function getSongFromId(id){
  return searchResults.data.find((song) => song.id === id);
}
  
// GET LYRICS FOR SONG
async function getLyrics(artist, songTitle) {
  const res = await fetch(`${apiURL}/v1/${artist}/${songTitle}`);
  const data = await res.json();

  const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>');

  results.innerHTML = `
                       <button onclick="addToList()" class="add"><i class="fas fa-plus"></i></button>
          <h2><strong>${artist}</strong> - ${songTitle}</h2>
          <p>${lyrics}</p>`;

 

}

//ADD SONG TO FAVOURITE LIST



function addToList(artist, songTitle)  {
 
  
 
  notes.style.visibility = "visible";
  notes.innerHTML = ("Song successfully added to favorite list");                      
}

// RETRIEVING AUTHOR AND TITLE 


// REMOVE ALL ITEMS FROM LIST
removeAll.addEventListener('click', () => {
 let msg = confirm("Are you sure to delete all items?");
 if (msg = "ok"){
   localStorage.clear("obj");
   let items = ("All items have been deleted");
   favSongs.innerHTML = '';
   deleteItems.innerHTML = items;
 }  
})

// REMOVE SINGLE ITEM 

