$(function () {
    'use strict';

    var panel = $bundle.filter('.scoreboard');
    var teamA = $('#vtv-scoreboard_teamA');
    var teamB = $('#vtv-scoreboard_teamB');
    var swapColours = $('#vtv-scoreboard_swap');
    var mapsTable = $('#vtv-scoreboard_maps');

    swapColours.click(function () {
        nodecg.variables.swapped = !nodecg.variables.swapped;
    });

    function recreateMapsTable(maps) {
        var tbody = mapsTable.find('tbody');
        tbody.html('');

        maps.forEach(function(map, idx) {
            var tr = document.createElement('tr');

            // Radio button
            var tdRadio = document.createElement('td');
            var radioInput = document.createElement('input');
            radioInput.setAttribute('type', 'radio');
            radioInput.setAttribute('name', 'vtv-scoreboard_activeMap');
            radioInput.setAttribute('value', idx + 1);
            radioInput.setAttribute('type', 'radio');
            tdRadio.appendChild(radioInput);

            // Map input
            var tdMap = document.createElement('td');
            var mapInput = document.createElement('input');
            mapInput.className = 'form-control input-sm';
            mapInput.setAttribute('type', 'text');
            mapInput.setAttribute('data-map', idx + 1);
            tdMap.appendChild(mapInput);

            // Team A score
            var tdScoreA = document.createElement('td');
            var scoreAInput = document.createElement('input');
            scoreAInput.className = 'form-control input-sm';
            scoreAInput.setAttribute('type', 'number');
            scoreAInput.setAttribute('min', '0');
            scoreAInput.setAttribute('data-map', idx + 1);
            scoreAInput.setAttribute('data-team', 0);
            tdScoreA.appendChild(scoreAInput);

            // Team B score
            var tdScoreB = document.createElement('td');
            var scoreBInput = document.createElement('input');
            scoreBInput.className = 'form-control input-sm';
            scoreBInput.setAttribute('type', 'number');
            scoreBInput.setAttribute('min', '0');
            scoreBInput.setAttribute('data-map', idx + 1);
            scoreBInput.setAttribute('data-team', 1);
            tdScoreB.appendChild(scoreBInput);

            // Add all to row
            tr.appendChild(tdRadio);
            tr.appendChild(tdMap);
            tr.appendChild(tdScoreA);
            tr.appendChild(tdScoreB);
            tbody.append(tr.outerHTML);
        });

        updateMapsTable(maps);
        updateUIControls();
    }

    function updateMapsTable(maps) {
        var mapRows = mapsTable.find('tbody > tr');

        maps.forEach(function (map, idx) {
            var row = mapRows.eq(idx);

            if (nodecg.variables.selectedMap === idx + 1) {
                row.addClass('success');
                row.find('input[type=radio]').attr('selected', 'selected');
            }

            row.find('input[type=text]').attr('value', map.name);

            var scoreCells = row.find('input[type=number]');
            scoreCells.eq(0).attr('value', map.scores[0]);
            scoreCells.eq(1).attr('value', map.scores[1]);
        });
    }

    $('#vtv-scoreboard_removeMap').click(function() {
        var maps = nodecg.variables.maps;
        if (maps.length === 1) {
            return;
        }

        maps.pop();
        nodecg.variables.maps = maps;

        if (nodecg.variables.selectedMap > maps.length) {
            nodecg.variables.selectedMap -= 1;
        }
    });

    $('#vtv-scoreboard_addMap').click(function() {
        var maps = nodecg.variables.maps;
        maps.push({
            name: '',
            scores: [0, 0]
        });
        nodecg.variables.maps = maps;
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
            var mapRows = mapsTable.find('tbody > tr');
            if (mapRows.length === maps.length) {
                updateMapsTable(maps);
            } else {
                recreateMapsTable(maps);
            }
        }
    });

    // Selected map radio button changes and
    // up/down score changers
    function updateUIControls() {
        mapsTable.find('input[name=vtv-scoreboard_activeMap]').change(function () {
            nodecg.variables.selectedMap = parseInt(this.value);
        });

        mapsTable.find('input[type=number]').change(function() {
            var score = parseInt(this.value);
            if (score < 0) {
                return;
            }

            var team = parseInt(this.dataset.team);
            var mapIdx = this.dataset.map - 1;

            var maps = nodecg.variables.maps;
            maps[mapIdx].scores[team] = score;
            nodecg.variables.maps = maps;
        });

        mapsTable.find('input[type=text]').change(function() {
            var mapIdx = this.dataset.map - 1;

            var maps = nodecg.variables.maps;
            maps[mapIdx].name = this.value;
            nodecg.variables.maps = maps;
        });
    }

    teamA.change(function() {
        var tableHeaders = mapsTable.find('thead > tr > th');
        tableHeaders.eq(2).text(this.value);

        var teams = nodecg.variables.teams;
        teams[0] = this.value;
        nodecg.variables.teams = teams;
    });

    teamB.change(function() {
        var tableHeaders = mapsTable.find('thead > tr > th');
        tableHeaders.eq(3).text(this.value);

        var teams = nodecg.variables.teams;
        teams[1] = this.value;
        nodecg.variables.teams = teams;
    });

    nodecg.declareSyncedVar({
        name: 'swapped',
        initialValue: false,
        setter: function(swapped) {
            if (swapped) {
                panel.find('.teamColumn').addClass('swap');
            } else {
                panel.find('.teamColumn').removeClass('swap');
            }
        }
    });

    nodecg.declareSyncedVar({
        name: 'selectedMap',
        initialValue: 1,
        setter: function(map) {
            var mapsTable = $('#vtv-scoreboard_maps');
            mapsTable.find('.success').removeClass('success');

            var tableRow = mapsTable.find('tbody > tr').eq(map - 1);
            tableRow.addClass('success');
            tableRow.find('input[name=vtv-scoreboard_activeMap]').click();
        }
    });

    nodecg.declareSyncedVar({
        name: 'teams',
        initialValue: ['',''],
        setter: function(teams) {
            var tableHeaders = mapsTable.find('thead > tr > th');

            teamA.val(teams[0]);
            tableHeaders.eq(2).text(teams[0]);

            tableHeaders.eq(3).text(teams[1]);
            teamB.val(teams[1]);
        }
    });

    nodecg.declareSyncedVar({
        name: 'isShowing',
        initialValue: false,
        setter: function(isShowing) {
            $('#vtv-scoreboard_fadeIn').prop('disabled', isShowing);
            $('#vtv-scoreboard_fadeOut').prop('disabled', !isShowing);
        }
    });

    $('#vtv-scoreboard_fadeIn').click(function() {
        nodecg.variables.isShowing = true;
    });

    $('#vtv-scoreboard_fadeOut').click(function() {
        nodecg.variables.isShowing = false;
    });
});
