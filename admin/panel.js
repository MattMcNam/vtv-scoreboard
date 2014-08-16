$(document).ready(function() {
  var bluTeam = $('#vtv-scoreboard_bluTeam');
  var redTeam = $('#vtv-scoreboard_redTeam');
  var swapColours = $('#vtv-scoreboard_swapColour');

  var maps = [];
  for (var i = 0; i < 5; i++) {
    maps[i] = {
      name: $('#vtv-scoreboard_mapName'+ (i+1)),
      minusA: $('#vtv-scoreboard_minusA'+ (i+1)),
      scoreA: $('#vtv-scoreboard_scoreA'+ (i+1)),
      plusA: $('#vtv-scoreboard_plusA'+ (i+1)),
      minusB: $('#vtv-scoreboard_minusB'+ (i+1)),
      scoreB: $('#vtv-scoreboard_scoreB'+ (i+1)),
      plusB: $('#vtv-scoreboard_plusB'+ (i+1)),
      show: $('#vtv-scoreboard_show'+ (i+1))
    }
  }

  var selectedMap = 1;
  // Selected map radio button changes
  $('input[name=vtv-scoreboard_active-map]').change(function() {
    $('.selected').removeClass('selected');

    selectedMap = parseInt(this.value);

    $('#vtv-scoreboard').find('.map-container').eq(selectedMap-1).addClass('selected');
  });

  // Plus/minus changes
  maps.forEach(function(map, idx) {
    map.plusA.click(function() {
      map.scoreA.text(parseInt(map.scoreA.text()) + 1)
    });
    map.minusA.click(function() {
      map.scoreA.text(parseInt(map.scoreA.text()) - 1)
    });
    map.plusB.click(function() {
      map.scoreB.text(parseInt(map.scoreB.text()) + 1)
    });
    map.minusB.click(function() {
      map.scoreB.text(parseInt(map.scoreB.text()) - 1)
    });
  });

  $('#vtv-scoreboard_update').click(function () {
    var data = {
      teamA: bluTeam.val(),
      teamB: redTeam.val(),
      swapped: swapColours.prop('checked'),
      selected: selectedMap - 1,
      maps: []
    };

    maps.forEach(function(map, idx) {
      data.maps[idx] = {
        name: map.name.val(),
        scoreA: map.scoreA.text(),
        scoreB: map.scoreB.text(),
        shown: map.show.prop('checked')
      }
    });

    console.log("sending: "+ data);

    nodecg.sendMessage('update', data);
  })
});