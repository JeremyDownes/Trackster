var Trackster = {};
const API_KEY = "40f13d2f0721f3e75a883099fcdd8243";

$(document).ready( function(){ 
  $("input").click( function() {
    $(this).attr("value","");
  });

  $(".glyphicon-remove").click( function() {
    $("input").val("");
  });

  $("#submit").click( function(){
    Trackster.searchTracksByTitle($("input[name='search']").val());
  });

  $("input").keyup( function(event) {
      if (event.key === "Enter") {
      Trackster.searchTracksByTitle($("input[name='search']").val());
    }
  });
})

/*
  Given an array of track data, create the HTML for a Bootstrap row for each.
  Append each "row" to the container in the body to display all tracks. 
*/
Trackster.renderTracks = function(tracks) {
  $("#results").empty();
	for (track in tracks) {
    var listeners = tracks[track].listeners;
    listeners = Number(listeners).toLocaleString();
		var song = '<div class="row results">'+
        '<div class="col-xs-1 play"><a href="'+tracks[track].url+'" target="_blank"><i class="fa fa-play-circle-o"></i></a></div>'+
        '<div class="col-xs-4"><label>'+(Number(track)+1)+'</label>'+tracks[track].name+'</div>'+ 
        '<div class="col-xs-4">'+tracks[track].artist+'</div>'+
        '<div class="col-xs-1"><img src="'+tracks[track].image[0]["#text"]+'"></div>'+
        '<div class="col-xs-1">'+listeners+'</div>'+
        '<div class="col-xs-1">3:35</div>'+
      '</div>'+
      '<div class="divider"></div>';
		$("#results").append(song);
	}
};

/*
  Given a search term as a string, query the LastFM API.
  Render the tracks given in the API query response.
*/
Trackster.searchTracksByTitle = function(title) {
	$.ajax({url: "http://ws.audioscrobbler.com/2.0/?method=track.search&track="+title+"&api_key="+API_KEY+"&format=json", success: function(result){
		var tracks = result.results.trackmatches.track;
    Trackster.renderTracks(tracks);
  }});

};

//AP_KEY = 40f13d2f0721f3e75a883099fcdd8243		"http://ws.audioscrobbler.com/2.0/?method=track.search&track=tiny&api_key="+API_KEY+"&format=json"
 
 	