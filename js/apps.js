const research = document.getElementById('search');
const notify = document.getElementById('notifications');
const btnSearch = document.getElementById('searchBtn');
const result = document.querySelector('.result');

const apiURL = 'https://api.lyrics.ovh/v1';

// SEARCH BY SONG OR ARTIST 
async function searchSongs(term){
  const res = await fetch(`${apiURL}/suggest/${term}`);
  const data = await res.json();
  showData(data);
}

// SHOW DATA
function showData(data){
  let output = '';

  data.data.forEach(song => {
    output += `
    <li>
    <span><strong>${song.artist.name}</strong> - ${song.title}</span>
    <button class="btn">Add</btn>`
  })
}

// EVENT LISTENERS
btnSearch.addEventListener('submit', e => {
  e.preventDefault();

  const searchTerm = research.value.trim();

  if (!searchTerm){
    alert('Please type in a search term');
  } else {
    searchSongs(searchTerm);
  }
});