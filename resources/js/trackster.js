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
  var results = [];
  setTimeout(function() {
    $("h1").removeClass("title-animation");
  	
    for (track in tracks) {
      
      var trackObject = { name: tracks[track].name,
                         artist: tracks[track].artist,
                         listeners: tracks[track].listeners,
                         url: tracks[track].url,
                         length: tracks[track].length,
                         imageUrl: tracks[track].imageUrl
      };

  		var song = '<div class="row results">'+
        '<div class="col-xs-1 play"><a href="'+trackObject.url+'" target="_blank"><i class="fa fa-play-circle-o"></i></a></div>'+
        '<div class="col-xs-4"><label>'+(Number(track)+1)+'</label>'+trackObject.name+'</div>'+ 
        '<div class="col-xs-4">'+trackObject.artist+'</div>'+
        '<div class="col-xs-1"><img src="'+trackObject.imageUrl+'"></div>'+
        '<div class="col-xs-1">'+trackObject.listeners.toLocaleString()+'</div>'+
        '<div class="col-xs-1">'+trackObject.length+'</div>'+
        '</div>'+
        '<div class="divider"></div>';
	    $("#results").append(song);
      $(".row.results:eq("+track+")").data(trackObject);
      results.push($(".row.results:eq("+track+")").data());
  	}
    $("#name,#artist,#listeners,#length").click(function(){
      Trackster.sortResults(results, $(this).attr("id"));
      results = [];
    })
  },1500);
};

Trackster.sortResults = function(results, order) {
  $("h1").addClass("title-animation");
  if (order != "listeners") { results.sort((a, b) => a[order].localeCompare(b[order])); }
  else results.sort((a, b) => a[order] - b[order]);
  Trackster.renderTracks(results);
}

/*
  Given a search term as a string, query the LastFM API.
  Render the tracks given in the API query response.
*/
Trackster.searchTracksByTitle = function(title) {
  $("h1").addClass("title-animation");
	$.ajax({url: "https://ws.audioscrobbler.com/2.0/?method=track.search&track="+title+"&api_key="+API_KEY+"&format=json", success: function(result){
		var tracks = result.results.trackmatches.track;
    for (track in tracks) {
      tracks[track].imageUrl = tracks[track].image[0]["#text"];
      tracks[track].listeners = Number(tracks[track].listeners);
      tracks[track].length = Trackster.fakeTrackTime();
    }
    Trackster.renderTracks(tracks);
  }});

};

Trackster.fakeTrackTime = function() {
  var fakeMinutes = Math.round(Math.random()+3);
  var fakeSeconds = Math.floor(Math.random()*60);
  if (fakeSeconds < 10) {fakeSeconds = "0"+String(fakeSeconds)};
  var fakeTime = String(fakeMinutes)+":"+String(fakeSeconds);
  return fakeTime;
}
 
 	