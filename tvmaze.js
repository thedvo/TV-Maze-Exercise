const missing_Img = 'https://tinyurl.com/tv-missing';

// AJAX request to Search Shows API
async function searchShows(query) {
  const res = await axios.get('https://api.tvmaze.com/search/shows', {params: {q : query}})
   const shows = res.data.map(result => {
    let show = result.show;
  
    return {
      id: show.id,
      name: show.name,
      genre: show.genres[0] ? show.genres[0] : '',
      summary: show.summary,
      runtime: show.runtime,
      url: show.url,
      image: show.image ? show.image.medium : missing_Img
    };
  });

  return shows; 
}

/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */
// populateShows deals just with inserting the passed-in shows into the DOM. This makes this testable without having to have it tied to the code that gets data from the API.

function populateShows(shows) {
  const $showsList = $("#shows-list"); 
  // selects div of id #shows-list
  $showsList.empty();
  // .empty() method removes child and other descendant elements, also any text within the set of matched elements.

  // in this case it will delete the div with id '#show-list' 
  // basically clears the webpage of any previous searches. 

  // this will loop through the selected show array and create the card for each show matching the search query
  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
           <div class="card-body">
              <a href="${show.url} target="_blank" class="text-decoration-none"><h5 class="card-title fw-bold">${show.name}</h5></a>
              <a href="${show.url}" target="_blank"><img class="card-img-top" src="${show.image}"></a>
              <p class ="card-text fs-5 fw-bold">${show.genre}</p>
              <p class ="card-text fs-6 fst-italic">Runtime: ${show.runtime}</p>
              <p class="card-text">${show.summary}</p>
              <button class="btn btn-primary" id="get-episodes">View Episodes</button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($item);
    // for every loop, the $item will append to the $showlist div element
  }
}


/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */
// when search (Go!) button is clicked

// our handleSearch event handler ties the two together: it gets the search term, gets the shows using searchShows, and fills in the DOM with populateShows.
$("#search-form").on("submit", async function handleSearch (e) {
  e.preventDefault();

  let query = $("#search-query").val(); // extracts value of the search Input
  if (!query) return;

  $("#episodes-area").hide();
  // refers to section where search results for TV Shows pop up
  // .hide() hides this section immediately with no animation. Equivalent to doing display: none. 

  let shows = await searchShows(query); 
  // when user submits seearch form, search query is extracted from Input and then plugged into searchShows function.

  populateShows(shows); 
  // once searchShows(query) is done with its request, run populateShows(shows). This function plugs in the result from searchShows(query). populateShows(shows) function will take that value and append results to the DOM   
});


/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */
 // TODO: get episodes from tvmaze
  //       you can get this by making GET request to
  //       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes

  // TODO: return array-of-episode-info, as described in docstring above

async function getEpisodes(id) {
  const res = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);

  const episodes = res.data.map(episode => ({
      id: episode.id,
      name: episode.name,
      season: episode.season,
      number: episode.number,
      summary: episode.summary,
      url: episode.url,
      image: episode.image ? episode.image.medium : missing_Img
    }));

  return episodes;
}

function populateEpisodes(episodes){
  const $episodesList = $('#episodes-list');
  $episodesList.empty();

  for(let episode of episodes){
    let $item = $(`
      <li class="mb-3">
        <a href="${episode.url}" target="_blank" class="list-group-item list-group-item-action">
          <span class="fw-bold fs-5 m-0">S${episode.season} | Episode ${episode.number} - ${episode.name}</span>
          <p>${episode.summary}</p>
          <img src="${episode.image}" alt="episode_thumbnail" class="m-0">
          </a> 
      </li>
    `);
    $episodesList.append($item);
  }
  $("#episodes-area").show();
}

// Handle Click on show name. 
$('#shows-list').on('click', '#get-episodes', 
  async function handleEpisodeClick(e){
    let showId = $(e.target).closest('.Show').data('show-id');
    
    let episodes = await getEpisodes(showId);
    populateEpisodes(episodes);
  }
);

