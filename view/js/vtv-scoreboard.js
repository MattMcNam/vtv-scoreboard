$(function () {
    'use strict';

    function runTextFit() {
        textFit($('.name'), {
            alignVert: true
        });

        textFit($('.teamA'), {
            alignVert: true
        });

        textFit($('.teamB'), {
            alignVert: true
        });

        textFit($('.score'), {
            alignVert: true
        });
    }

    var container = $('#container');

    // Slide & fade in animation for top and bottom bar
    var fadeInTimeline = new TimelineMax({paused: true});
    fadeInTimeline
        .to(container, 0.8, {
            opacity: 1,
            ease: Power2.easeOut
        });

    nodecg.declareSyncedVar({
        name: 'isShowing',
        initialValue: false,
        setter: function(isShowing) {
            if (isShowing) {
                runTextFit();
                fadeInTimeline.play();
            } else{
                fadeInTimeline.reverse();
            }
        }
    });

    nodecg.declareSyncedVar({
        name: 'teams',
        initialValue: ['',''],
        setter: function(teams) {
            $('.teamA').text(teams[0]);
            $('.teamB').text(teams[1]);
            runTextFit();
        }
    });

    nodecg.declareSyncedVar({
        name: 'selectedMap',
        initialValue: 1,
        setter: function(map) {
            $('.selected').removeClass('selected');

            var cell = $('.map').eq(map - 1);
            cell.addClass('selected');
        }
    });

    nodecg.declareSyncedVar({
        name: 'swapped',
        initialValue: false,
        setter: function(swapped) {
            if (swapped) {
                $('.teamA, .teamB').addClass('swapped');
            } else {
                $('.teamA, .teamB').removeClass('swapped');
            }
        }
    });

    nodecg.declareSyncedVar({
        name: 'maps',
        initialValue: [{
            name: 'cp_badlands',
            scores: [0, 0]
        }],
        setter: function(maps) {
            // If we somehow have 0 maps, go back to default
            if (maps.length === 0) {
                nodecg.variables.maps = [{name: 'cp_badlands', scores: [0, 0]}];
                return;
            }

            // Has number of maps changed
            var mapCells = $('.map');
            if (mapCells.length === maps.length) {
                updateMaps(maps);
            } else {
                recreateMaps(maps);
            }
        }
    });

    function updateMaps(maps) {
        var mapCells = $('.map');

        maps.forEach(function (map, idx) {
            var cell = mapCells.eq(idx);

            if (nodecg.variables.selectedMap === idx + 1) {
                cell.addClass('selected');
            }

            cell.find('.name').text(map.name);
            cell.find('.score').text(map.scores[0] + '-' + map.scores[1]);
            cell.find('.teamA').text(nodecg.variables.teams[0]);
            cell.find('.teamB').text(nodecg.variables.teams[1]);
        });

        runTextFit();
    }

    function recreateMaps(maps) {
        container.html('');

        maps.forEach(function(map, idx) {
            var mapDiv = document.createElement('div');
            mapDiv.className = 'map';

            // Map name
            var nameDiv = document.createElement('div');
            nameDiv.className = 'name';
            mapDiv.appendChild(nameDiv);

            // Team A
            var teamADiv = document.createElement('div');
            teamADiv.className = 'teamA';
            mapDiv.appendChild(teamADiv);

            // Score
            var scoreDiv = document.createElement('div');
            scoreDiv.className = 'score';
            mapDiv.appendChild(scoreDiv);

            // Team B
            var teamBDiv = document.createElement('div');
            teamBDiv.className = 'teamB';
            mapDiv.appendChild(teamBDiv);

            container.append(mapDiv.outerHTML);
        });

        updateMaps(maps);
    }
});
