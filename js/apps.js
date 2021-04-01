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
    notes.style.fontSize = "25px";
    notes.innerHTML = message;
}else
  result.innerHTML = `
  <ul class="song-list">
    ${data.data
      .map(song=> `<li>
                    <span>
                      <strong>${song.artist.name}</strong> -${song.title} 
                    </span>
                    <div class="buttons">
                      <button class="btn" data-artist="${song.artist.name}" data-songtitle="${song.title}">Get Lyrics</button>
                     
                      <button class="btn_music>
                          <i class="far fa-play-circle"></i>
                          <i class="far fa-pause-circle"></i>
                      </button>
                      <button onclick = "addToList('${song.artist.name}', '${song.title}')" class="add"><i class="fas fa-plus"></i></button>
                    </div>
              </li>`
      )
      .join('')}
  </ul>
`;

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
 
  const res = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
  const data = await res.json();
  result.innerHTML = '';
  showData(data);
 
 
}



// PREVIEW SONG




//EVENT LISTENER TO GET LYRICS
result.addEventListener('click', e=>{
    const clickedElement = e.target;

    //CHECKING CLICKED ELEMENT IS BUTTON OR NOT
    if (clickedElement.tagName === 'BUTTON'){
        const artist = clickedElement.getAttribute("data-artist");
        const songTitle = clickedElement.getAttribute("data-songtitle");
        
        getLyrics(artist, songTitle);
        
       
    }
})



  
// GET LYRICS FOR SONG

async function getLyrics(artist,songTitle) {
  const res = await fetch(`${apiURL}/v1/${artist}/${songTitle}`);
  const data = await res.json();
  
  const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>');

  results.innerHTML = `
                 
                  <h2><strong>${artist}</strong> - ${songTitle}</h2>
                  <p>${lyrics}</p>`;

 

}

//ADD SONG TO FAVOURITE LIST

function addToList(artist, songTitle)  {

 
  const favorites = getFavorites();
  favorites.push({artist, songTitle});
  localStorage.setItem("favorites", JSON.stringify(favorites));
 
  
 
  notes.style.visibility = "visible";
  notes.innerHTML = ("Song successfully added to favorite list");      
  showFavorites()                
}

// RETRIEVING AUTHOR AND TITLE 
function getFavorites() {
   
  const favorites = JSON.parse(localStorage.getItem("favorites"));

  if(favorites){
    return favorites;
  }else{
    return []
  }


  
}

function showFavorites(){
  const favorites = JSON.parse(localStorage.getItem("favorites"));
  if (favorites.length) {
   favSongs.innerHTML = `<ul>
                              
                          ${favorites.map(fav => {return `<li>${fav.artist}, ${fav.songTitle}</li>`})  }
   
                        </ul>
                        `;
  }
}



// REMOVE ALL ITEMS FROM LIST
removeAll.addEventListener('click', () => {
 let msg = confirm("Are you sure to delete all items from the list?");
 if (msg = "ok"){
   localStorage.clear("obj");
   let items = ("All items have been deleted");
   favSongs.innerHTML = '';
   deleteItems.innerHTML = items;
 }  
})

// REMOVE SINGLE ITEM 

