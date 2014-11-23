// return  a random integer between min and max
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var xmin = 1185;
var xmax = 1254;
var ymin = 1185;
var ymax = 1254;

var environments = [
    'asteroids-1', 'asteroids-1-brown', 'asteroids-2', 'asteroids-2-brown',
    'fog-blue', 'fog-red', 'fog-green', 'fog-grey',
    'fog-magenta', 'fog-red', 'fog-yellow'];

console.log('planets');

// planets
for (var i=1; i<=100; i++) {
    x = getRandomInt(xmin, xmax);
    y = getRandomInt(ymin, ymax);
    console.log('{"layer": 1, "x": '+x+', "y": '+y+', "attribs":{"title":"test '+x+'-'+y+'", "class":"sprites planet-'+i%10+'"}},');
}

console.log('environments');

// environments
for (var i=1; i<=200; i++) {
    x = getRandomInt(xmin, xmax);
    y = getRandomInt(ymin, ymax);
    idx = Math.floor(Math.random() * 11);
    console.log('{"layer": 0, "x": '+x+', "y": '+y+', "attribs":{"title":"test '+x+'-'+y+'", "class":"sprites '+environments[idx]+'"}},');
}