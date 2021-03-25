const research = document.getElementById('search');
const notify = document.getElementById('notifications');
const btnSearch = document.getElementById('searchBtn');
const result = document.getElementById('results');
const form = document.getElementById('form');

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
  if(e.keyCode === 13){
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
  notify.innerHTML = ("Searched for:  " +research.value);
  
  result.innerHTML = `
  <ul class="song-list">
    ${data.data
      .map(song=> `<li>
                  <div>
                      <strong>${song.artist.name}</strong> -${song.title} 
                  </div>
                  <span data-artist="${song.artist.name}" data-songtitle="${song.title}">Get lyrics</span>
              </li>`
      )
      .join('')}
  </ul>
`;


  


}

//EVENT LISTENER IN GET LYRICS BUTTON
result.addEventListener('click', e=>{
  const clickedElement = e.target;

  //CHECKING CLICKED ELEMENT IS BUTTON OR NOT
  if (clickedElement.tagName === 'SPAN'){
      const artist = clickedElement.getAttribute('data-artist');
      const songTitle = clickedElement.getAttribute('data-songtitle');
      
      getLyrics(artist, songTitle)
  }
})

// GET LYRICS FOR SONG
async function getLyrics(artist, songTitle) {
  const res = await fetch(`${apiURL}/v1/${artist}/${songTitle}`);
  const data = await res.json();

  const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>');

  results.innerHTML = `<button><i class="fas fa-arrow-circle-left "></i></button>
                       <button><i class="fas fa-plus plus"></i></button>
          <h2><strong>${artist}</strong> - ${songTitle}</h2>
          <p>${lyrics}</p>`;
}


