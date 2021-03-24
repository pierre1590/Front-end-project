const research = document.querySelector('.search');
const Notify = document.getElementById('notifications span');
const btnSearch = document.querySelector('.search-btn');

btnSearch.addEventListener('click', (e)=> {
  Notify.innerHTML = `Searched for: " +${research.value}+"`;
});

