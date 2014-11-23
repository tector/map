// return  a random integer between min and max
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

for (var i=1; i<=100; i++) {
    x = getRandomInt(1185, 1254);
    y = getRandomInt(1185, 1254);
    console.log('{"layer": 1, "x": '+x+', "y": '+y+', "attribs":{"title":"test '+x+'-'+y+'", "class":"sprites planet-'+i%10+'"}},');
}