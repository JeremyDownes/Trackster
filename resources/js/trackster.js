var Trackster = {};
const API_KEY = "40f13d2f0721f3e75a883099fcdd8243"; 
var songList = [];                                   // I used a global var here so I can reference it in the click listener without an error

$(document).ready( function(){ 
  $("input").click( function() {
    $(this).attr("value","");                                           // this line clears the "search" from the input field
  });

  $(".glyphicon-remove").click( function() {                            // this function clears the input field when the X is clicked
    $("input").val("");
  });

  $("#submit").click( function(){                                       // this function sends whatever text is in the input field to the "searchTracksByTitle" function
    Trackster.searchTracksByTitle($("input[name='search']").val());     // there is only one input field but this is one way to handle multiple with a name attribute
  });

  $("input").keyup( function(event) {                                   // this function does the same as above only on an <ENTER> key up event within the input field  
      if (event.key === "Enter") {                                     
      Trackster.searchTracksByTitle($("input[name='search']").val());
    }
  });

  $("#name,#artist,#listeners,#length").click(function(){               // adds click listener to our sortable field headings
    if (songList) {Trackster.sortResults(songList, $(this).attr("id"));}   // sends our array of trackObject data and the id of the clicked heading to the sortResults function  
  });    // I originally assigned this event in the render function which was adding another event every time the function was called and multiplying exponentially which caused eventual overflow
})

Trackster.searchTracksByTitle = function(title) {                     // this function is the ajax call to the api
  $("h1").addClass("title-animation");                                // starts te animation
  $.ajax({url: "https://ws.audioscrobbler.com/2.0/?method=track.search&track="+title+"&api_key="+API_KEY+"&format=json", success: function(result){  // a success message will trigger this funtion with the "result" data
    var resultData = result.results.trackmatches.track;                   // the data we want is nested in the json. We assign the useful bits to this variable        
    for (track in resultData) {                                           // this loop further facilitates formatting of the data 
      resultData[track].imageUrl = resultData[track].image[0]["#text"];       // the url to the album art is nested, indexed, and identified "#text"
      resultData[track].listeners = Number(resultData[track].listeners);      // this value comes as a string but we convert it to a number for sorting pruposes
      resultData[track].length = Trackster.fakeTrackTime();               // this value isn't included so I wrote a function to spoof it
    }
    Trackster.renderTracks(resultData);                                   // this sends our formatted data to our rendering function
  }});

};

Trackster.fakeTrackTime = function() {                                // fakes the track length
  var fakeMinutes = Math.round(Math.random()+3);                      // evaluates to either 3 or 4. Normal number of minutes for a song
  var fakeSeconds = Math.floor(Math.random()*59);                     // evaluates to 0 - 59. the seconds part of the fake time
  if (fakeSeconds < 10) {fakeSeconds = "0"+String(fakeSeconds)};      // adds a "0" in front of values lower than 10 for formatting purpose
  var fakeTime = String(fakeMinutes)+":"+String(fakeSeconds);         // add the colon. The explicit "String" casing is not necessary but I included it to show that our numbers are now converted to strings
  return fakeTime;                                                    // returns our properly formatted and realistic fake song length
}

Trackster.renderTracks = function(tracks) {
  $("#results").empty();   // clears the previous results from the screen                                      
  songList = tracks;       // tracks is an instance variable so we assign it's value to songList whick is available outside this scope
  setTimeout( function () {                                           // a little delay so that our 2 second animation can complete
    $("h1").removeClass("title-animation");                             // stops the animation
    for (track in tracks) {                                             // loops through each index in the tracks array
      
  		var row = '<div class="row results">'+                           // this will be the html construct starting with a bootstrap row
        '<div class="col-xs-1 play"><a href="'+tracks[track].url+'" target="_blank"><i class="fa fa-play-circle-o"></i></a></div>'+   // the play button is a link to the url
        '<div class="col-xs-4"><label>'+(Number(track)+1)+'</label>'+tracks[track].name+'</div>'+   // the numbers will be 1 - 30 regardless of order so we add 1 to the current index value followed by the song title
        '<div class="col-xs-4">'+tracks[track].artist+'</div>'+                                     // the artists name spans 4 columns as does the song title above  
        '<div class="col-xs-1"><img src="'+tracks[track].imageUrl+'"></div>'+                       // the album image was the only reference to the album returned by the endpoint and spans one column
        '<div class="col-xs-1">'+tracks[track].listeners.toLocaleString()+'</div>'+                 // the number of plays converted to a string with commas at the thousands place
        '<div class="col-xs-1">'+tracks[track].length+'</div>'+                                     // track length is a made up value as it was not included in the json
        '</div>'+                                                                                 // the end of the row
        '<div class="divider"></div>';                                                            // as the name suggests this is just the dividing line between rows        
	    
      $("#results").append(row);                                         // This line adds the html we just built to the #results section of the page 
    }
  },1500);                                                              // delay value for the animation to complete
};

Trackster.sortResults = function(list, order) {                        // sort function results is an array containing trackObjects. Order is a string whos value corresponds with both the Id of the element whos click event called the funtion and the key in trackObject that we want to sort by
  $("h1").addClass("title-animation");                                    // starts the animation
  if (order != "listeners") { list.sort((a, b) => a[order].localeCompare(b[order])); }  // if the order is not listeners it's a string and we sort by passing a and b's value that has the corresponding key of the variable "order" into the localeCompare method which is a string comparison method that compares strings independent of case
  else {
    list.sort((a, b) => a[order] - b[order]);                       //  We can't compare numbers as if they were strings so we subtract to get the difference in value
    list.reverse();                                                 //  Then we reverse the array to get decending values
  }
  Trackster.renderTracks(list);                                     // and send our sorted array back to be rendered
}