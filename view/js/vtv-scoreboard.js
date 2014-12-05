$(document).on('ncgReady', function() {
  'use strict';

  nodecg.listenFor('update', update);

  nodecg.listenFor('fadeIn', function() {
    container.addClass('shown');
  });
  nodecg.listenFor('fadeOut', function() {
    container.removeClass('shown');
  });

  var maps = [];
  maps[0] = $('#map1');
  maps[1] = $('#map2');
  maps[2] = $('#map3');
  maps[3] = $('#map4');
  maps[4] = $('#map5');

  var container = $('#container');

  function update(data) {
    $('.selected').removeClass('selected');
    maps[data.selected].addClass('selected');

    $('.team.blue').each(function () {
      $(this).text(data.teamA);
    });
    $('.team.red').each(function() {
      $(this).text(data.teamB);
    });

    if (data.swapped) {
      container.addClass('swapped');
    } else {
      container.removeClass('swapped');
    }

    data.maps.forEach(function(map, idx) {
      if (map.name !== "") {
        maps[idx].find('.name').text(map.name + ':');
      } else {
        maps[idx].find('.name').text('Map ' + (idx+1) + ':');
      }

      maps[idx].find('.score.blue').text(map.scoreA);
      maps[idx].find('.score.red').text(map.scoreB);
      if (map.shown) {
        maps[idx].removeClass('hidden');
      } else {
        maps[idx].addClass('hidden');
      }
    });
  }
});
