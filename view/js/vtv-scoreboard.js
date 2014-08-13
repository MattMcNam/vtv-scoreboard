$(document).ready(function() {
    //nodecg.listenFor('update', update);

    var map = [];
    map[0] = $('#map1');
    map[1] = $('#map2');
    map[2] = $('#map3');
    map[3] = $('#map4');
    map[4] = $('#map5');

    var container = $('#container');

    // Browser source fix
    map[3].removeClass('hidden');
    setTimeout(function() { map[3].addClass('hidden');}, 50);
});
