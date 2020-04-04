const API_KEY = "AIzaSyCyFqJ7Adn0Wz8XeRPwUDNSUF-Y8a-QKLU";
const maxResults = 10;

function searchVideo(searchText, pageToken) {
  let url = `https://www.googleapis.com/youtube/v3/search?part=snippet&key=${API_KEY}&maxResults=${maxResults}&type=video&order=relevance&q=${encodeURIComponent(searchText.trim())}`;
  if(pageToken != null) {
    url += `&pageToken=${pageToken}`;
  }
  
  let settings = {
    method: 'GET'
  };

  fetch( url, settings )
    .then( response => {
      if( response.ok ) {
        return response.json();
      }
      throw new Error( response.statusText );
    })
    .then( responseJSON => {
      console.log(responseJSON);
      showVideos(responseJSON, searchText);
    })
    .catch( err => {
      console.log( err );
    });
}

function showVideos(responseJSON, searchText) {
  let results = document.querySelector( '.results' );
  let navigation = document.querySelector( '.navigation' );
  results.innerHTML = '';

  for(i=0; i < responseJSON.items.length; i++) {
    results.innerHTML += `
      <a href="https://www.youtube.com/watch?v=${responseJSON.items[i].id.videoId}" target="_blank">
        <div class="video">
          <h4>${responseJSON.items[i].snippet.title}</h4>
          <img src="${responseJSON.items[i].snippet.thumbnails.medium.url}"/>
        </div>
      </a>
    `;
  }

  navigation.innerHTML = '';
  if(responseJSON.prevPageToken != null) {
    navigation.innerHTML += `
      <div>
        <button class="navBtn" onclick="searchVideo('${searchText}', '${responseJSON.prevPageToken}')">
          Previous
        </button>
        <button class="navBtn" onclick="searchVideo('${searchText}', '${responseJSON.nextPageToken}')">
          Next
        </button>
      </div>
    `
  } else {
    navigation.innerHTML += `
      <div>
        <button class="navBtn" onclick="searchVideo('${searchText}', '${responseJSON.nextPageToken}')">
          Next
        </button>
      </div>
    `
  }

  window.scrollTo(0, 0);
}

function watchForm() {
  let searchBtn = document.querySelector( '.searchBtn' );
  let searchInput = document.querySelector( '.searchInput' );

  searchBtn.addEventListener( 'click', ( event ) => {
    event.preventDefault();

    let searchText = searchInput.value;
    if (searchText != '') {
      console.log(searchText);
      searchVideo(searchText, null);
    } else {
      alert('Input something to search')
    }
  });
}

function init() {
  watchForm();
}

init();