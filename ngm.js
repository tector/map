$(document).ready( function() {

    function makeSVG(tag, attribs, value)
    {
        if (attribs == null) {
            attribs = {};
        }

        var el = document.createElementNS('http://www.w3.org/2000/svg', tag);
        for (var k in attribs) {
            el.setAttribute(k, attribs[k]);
        }

        if (value) {
            value = document.createTextNode(value);
            el.appendChild(value);
        }
        return el;
    }

    function sprintf(format, etc) {
        var arg = arguments;
        var i = 1;
        return format.replace(/%((%)|s)/g, function (m) { return m[2] || arg[i++] })
    }

    function extractDataByCoordLimits(data, xymin, xymax) {
        return data.filter(function(el){
            return (el.y >= xymin[1] && el.y < xymax[1]
                    && el.x >= xymin[0] && el.x < xymax[0]);
        });
    }

    ngm = {
        systemsize: 100, // units
        fieldsize: 5, // pixel
        width: 700,
        height: 700,

        createGridSVGDom: function(direction) {
            var tpl = '<svg class="grid-svg %s" width="%spx" height="%spx" style="margin-left: %spx; margin-top: %spx;"></svg>'
            var width  = ngm.systemsize * ngm.fieldsize;
            var height = ngm.systemsize * ngm.fieldsize;

            var halfwidth  = width/2;
            var halfheight = height/2;

            switch (direction) {
                case 'north-east':
                    class_ = 'grid-north grid-east';
                    margin_left = halfwidth;
                    margin_top = -height-halfheight;
                    break;
                case 'east':
                    class_ = 'grid-east';
                    margin_left = halfwidth;
                    margin_top = -halfheight;
                    break;
                case 'south-east':
                    class_ = 'grid-south grid-east';
                    margin_left = halfwidth;
                    margin_top = halfheight;
                    break;
                case 'north-west':
                    class_ = 'grid-north grid-west';
                    margin_left = -width-halfwidth;
                    margin_top  = -height-halfheight;
                    break;
                case 'west':
                    class_ = 'grid-west';
                    margin_left = -width-halfwidth;
                    margin_top  = -halfwidth;
                    break;
                case 'south-west':
                    class_ = 'grid-south grid-west';
                    margin_left = -width-halfwidth;
                    margin_top  = halfheight;
                    break;
                case 'north':
                    class_ = 'grid-north';
                    margin_left = -halfwidth;
                    margin_top  = -height-halfheight;
                    break;
                case 'south':
                    class_ = 'grid-south';
                    margin_left = -halfwidth;
                    margin_top  = halfheight;
                    break;
                case 'center':
                    class_ = '';
                    margin_left = -halfwidth;
                    margint_top = -halfheight;
                default:
                    break;
            }

            //console.log(class_, width, height, margin_left, margin_top);
            return sprintf(tpl, class_, width, height, margin_left, margin_top);
        },
        setNewCenterCoords: function(coordx, coordy) {
            // TODO: complete reload of all SVG maps with new coords as center
        },
        /**
         * load data for one svg map:
         *
         *        -25
         *         ^
         * -25 <- x,y -> +25
         *         v
         *        +25
         *
         * load data for 9 svg maps:
         *
         *        -75
         *         ^
         * -75 <- x,y -> +75
         *         v
         *        +75
         *
         * @param {number} coordx
         * @param {number} coordy
         * @return array
         */
        loadDataByCoords: function(coordx, coordy) {


            // currently use of dummy data
            // TODO: data should be loaded by ajax request
            data = [
                // north-west
                {'name': 'nw-test', 'type': 'planet', 'x': 1199, 'y': 1199},

                // north
                {'name': 'north-test', 'type': 'planet', 'x':1225, 'y':1195},

                // north-east
                {'name': 'ne-test', 'type': 'planet', 'x': 1251, 'y': 1199},

                // west
                {'name': 'west-test', 'type': 'planet', 'x': 1195, 'y': 1225},

                // center
                {'name': 'test', 'type': 'planet', 'x': 1210, 'y': 1222},
                {'name': 'test', 'type': 'planet', 'x': 1211, 'y': 1222},
                {'name': 'test', 'type': 'planet', 'x': 1212, 'y': 1222},
                {'name': 'test', 'type': 'planet', 'x': 1213, 'y': 1222},
                {'name': 'test', 'type': 'planet', 'x': 1214, 'y': 1222},
                {'name': 'test2', 'type': 'planet', 'x': 1234, 'y': 1234},
                {'name': 'a station', 'type': 'station', 'x': 1230, 'y': 1210},

                // east
                {'name': 'east-test', 'type': 'planet', 'x': 1254, 'y': 1217},
                {'name': 'debris field', 'type': 'debris', 'x': 1251, 'y': 1243},
                {'name': 'asteroid field', 'type': 'asteroids', 'x': 1253, 'y': 1243},
                {'name': 'mine field', 'type': 'mines', 'x': 1253, 'y': 1245},
                {'name': 'nebular', 'type': 'nebular', 'x': 1254, 'y': 1247},

                // south-west
                {'name': 'south-west test', 'type': 'planet', 'x': 1199, 'y': 1251},

                // south
                {'name': 'south test', 'type': 'planet', 'x': 1225, 'y':1255},

                // south-east
                {'name': 'south-east test', 'type': 'planet', 'x': 1255, 'y': 1255}
            ]
            return data;
        },
        init: function(selector, coordx, coordy, fieldsize) {

            var map = $(selector);
            ngm.width  = map.data('width');
            ngm.height = map.data('height');
            ngm.fieldsize = parseInt(fieldsize);
            ngm.coordx = coordx;
            ngm.coordy = coordy;

            map.attr('style', 'width:'+ngm.width+';height:'+ngm.height+';position:absolute');

            data = ngm.loadDataByCoords(coordx, coordy);

            data_north_west = extractDataByCoordLimits(data, [coordx-75, coordy-75], [coordx-25, coordy-25]);
            data_north      = extractDataByCoordLimits(data, [coordx-25, coordy-75], [coordx+25, coordy-25]);
            data_north_east = extractDataByCoordLimits(data, [coordx+25, coordy-75], [coordx+75, coordy-25]);

            map.append(ngm.createGridSVGDom('north-west'));
            ngm.fillWithContent('north-west', data_north_west);
            map.append(ngm.createGridSVGDom('north'));
            ngm.fillWithContent('north', data_north);
            map.append(ngm.createGridSVGDom('north-east'));
            ngm.fillWithContent('north-east', data_north_east);

            data_west       = extractDataByCoordLimits(data, [coordx-75, coordy-25], [coordx-25, coordy+25]);
            data_center     = extractDataByCoordLimits(data, [coordx-25, coordy-25], [coordx+25, coordy+25]);
            data_east       = extractDataByCoordLimits(data, [coordx+25, coordy-25], [coordx+75, coordy+25]);

            map.append(ngm.createGridSVGDom('west'));
            ngm.fillWithContent('west', data_west);
            map.append(ngm.createGridSVGDom('center'));
            ngm.fillWithContent('center', data_center);
            map.append(ngm.createGridSVGDom('east'));
            ngm.fillWithContent('east', data_east);

            data_south_west = extractDataByCoordLimits(data, [coordx-75, coordy+25], [coordx-25, coordy+75]);
            data_south      = extractDataByCoordLimits(data, [coordx-25, coordy+25], [coordx+25, coordy+75]);
            data_south_east = extractDataByCoordLimits(data, [coordx+25, coordy+25], [coordx+75, coordy+75]);

            map.append(ngm.createGridSVGDom('south-west'));
            ngm.fillWithContent('south-west', data_south_west);
            map.append(ngm.createGridSVGDom('south'));
            ngm.fillWithContent('south', data_south);
            map.append(ngm.createGridSVGDom('south-east'));
            ngm.fillWithContent('south-east', data_south_east);

            map.append('<div id="push-north" class="grid-push grid-push-north">&#x25B2;</div>');
            map.append('<div id="push-west" class="grid-push grid-push-west">&#x25C0;</div>');
            map.append('<div id="push-east" class="grid-push grid-push-east">&#x25B6;</div>');
            map.append('<div id="push-south" class="grid-push grid-push-south">&#x25BC;</div>');

            $('.ngm .grid-push').on('click', function(e) {
                e.preventDefault();
                var id = $(this).attr('id');
                console.log(id);
                switch (id) {
                    case 'push-east':
                        $('.grid-svg').each(function(){
                            var left = parseInt($(this).css('margin-left').replace('px', ''));
                        });
                        ngm.addSystems('east');
                        break;
                    case 'push-west':
                        $('.grid-svg').each(function(){
                            var left = parseInt($(this).css('margin-left').replace('px', ''));
                        });
                        ngm.addSystems('west');
                        break;
                    case 'push-north':
                        $('.grid-svg').each(function(){
                            var top = parseInt($(this).css('margin-top').replace('px', ''));
                        });
                        ngm.addSystems('north');
                        break;
                    case 'push-south':
                        $('.grid-svg').each(function(){
                            var top = parseInt($(this).css('margin-top').replace('px', ''));
                        });
                         ngm.addSystems('south');
                        break;
                    default:
                        break;
                }
            });

        },
        fillWithContent: function(direction, data) {
            var planets = data.filter(function(elem){return elem.type=='planet'})
            var misc = data.filter(function(elem){
                var miscTypes = ['station', 'debris', 'asteroids', 'mines', 'nebular'];
                return (miscTypes.indexOf(elem.type) > -1);
            })

            switch (direction) {
                case 'north-east':
                    var targetsvg = $('.grid-north.grid-east');
                    break;
                case 'east':
                    var targetsvg = $('.grid-east').not('.grid-north')
                                                   .not('.grid-south');
                    break;
                case 'south-east':
                    var targetsvg = $('.grid-south.grid-east');
                    break;
                case 'north-west':
                    var targetsvg = $('.grid-north.grid-west');
                    break;
                case 'west':
                    var targetsvg = $('.grid-west').not('.grid-north')
                                                   .not('.grid-south');
                    break;
                case 'south-west':
                    var targetsvg = $('.grid-south.grid-west');
                    break;
                case 'north':
                    var targetsvg = $('.grid-north').not('.grid-west')
                                                    .not('.grid-east');
                    break;
                case 'south':
                    var targetsvg = $('.grid-south').not('.grid-west')
                                                    .not('.grid-east');
                    break;
                case 'center':
                    var targetsvg = $('.grid-svg').not('.grid-north')
                                                .not('.grid-east')
                                                .not('.grid-south')
                                                .not('.grid-west');

                default:
                    break;
            }

            //console.log(targetsvg);
            //console.log(targetsvg[0]);
            ngm.drawGrid(targetsvg[0]);
            ngm.drawPlanets(targetsvg[0], planets);
            ngm.drawMisc(targetsvg[0], misc);
        },
        drawGrid: function(targetDomElement)
        {
            var group = makeSVG('g', {'class': 'ngm-grid-layer' });
            for (var i=0; i<10; i++)
            {
                for (var j=0; j<10; j++)
                {
                    var params = {
                        x1: j*50,
                        y1: 0,
                        x2: j*50,
                        y2: 500,
                        stroke: '#222222',
                        'stroke-width': '1px',
                        'fill-opacity':'0'
                    };
                    group.appendChild(makeSVG('line', params));
                }

                var params = {
                    x1: 0,
                    y1: i*50,
                    x2: 500,
                    y2: i*50,
                    stroke: '#222222',
                    'stroke-width': '1px',
                    'fill-opacity':'0'
                };
                group.appendChild(makeSVG('line', params));
            }

            targetDomElement.appendChild(group);

        },
        drawPlanets: function(targetDomElement, planets)
        {
            var group = makeSVG('g', {'class': 'ngm-planets-layer'});
            // now draw planets and co
            for (var i=0; i<planets.length; i++) {
                var params = {
                    title: planets[i]['name']+'('+planets[i]['x']+','+planets[i]['y']+')',
                    cx: parseInt(planets[i]['x']) % 50*10+5,
                    cy: parseInt(planets[i]['y']) % 50*10+5,
                    r: 5,
                    fill: '#9999bb',
                    'class': 'planet'
                }
                group.appendChild(makeSVG('circle', params));
            }

            targetDomElement.appendChild(group);
        },
        drawMisc: function(targetDomElement, misc)
        {
            var group = makeSVG('g', {'class': 'ngm-misc-layer'});
            // now draw planets and co
            for (var i=0; i<misc.length; i++) {
                var params = {
                    title: misc[i]['name'],
                    x: parseInt(misc[i]['x']) % 50*10,
                    y: parseInt(misc[i]['y']) % 50*10,
                    width: 10,
                    height: 10,
                    fill: 'grey',
                    'class': 'misc'
                }
                group.appendChild(makeSVG('rect', params));
            }

            targetDomElement.appendChild(group);
        },
        addSystems: function(direction) {
            var map = $('.ngm');

            if (direction == 'east') {

                $('.grid-svg').animate({marginLeft: "-=500px"}, 500);
                ngm.coordx = ngm.coordx+50;
                console.log('new center xy:', ngm.coordx, ngm.coordy);

                setTimeout(function() {
                    // delete west
                    $('.grid-west').remove();
                    // center -> west
                    var elements = document.querySelectorAll('.grid-svg:not(.grid-west):not(.grid-east)');
                    for (var i=0; i<elements.length; i++) {
                        var oldclass = elements[i].getAttribute('class');
                        var newclass = oldclass + ' grid-west';
                        elements[i].setAttribute('class', newclass);
                    }
                    // east -> center
                    var elements = document.querySelectorAll('.grid-east');
                    for (var i=0; i<elements.length; i++) {
                        var oldclass = elements[i].getAttribute('class');
                        var newclass = oldclass.replace('grid-east', '').replace('  ', ' ');
                        elements[i].setAttribute('class', newclass);
                    }
                    // create new
                    data = ngm.loadDataByCoords(ngm.coordx, ngm.coordy)

                    data_north_east = extractDataByCoordLimits(data, [ngm.coordx+25,ngm.coordy-75], [ngm.coordx+75,ngm.coordy-25]);
                    data_east       = extractDataByCoordLimits(data, [ngm.coordx+25,ngm.coordy-25], [ngm.coordx+75,ngm.coordy+25]);
                    data_south_east = extractDataByCoordLimits(data, [ngm.coordx+25,ngm.coordy+25], [ngm.coordx+75,ngm.coordy+75]);

                    map.append(ngm.createGridSVGDom('north-east'));
                    ngm.fillWithContent('north-east', data_north_east);
                    map.append(ngm.createGridSVGDom('east'));
                    ngm.fillWithContent('east', data_east);
                    map.append(ngm.createGridSVGDom('south-east'));
                    ngm.fillWithContent('south-east', data_south_east);

                }, 500);

            } else if (direction == 'west') {

                $('.grid-svg').animate({marginLeft: "+=500px"}, 500);
                ngm.coordx = ngm.coordx-50;
                console.log('new center xy:', ngm.coordx, ngm.coordy);
                setTimeout(function() {
                    // delete east
                    $('.grid-east').remove();
                    // center -> east
                    var elements = document.querySelectorAll('.grid-svg:not(.grid-west):not(.grid-east)');
                    for (var i=0; i<elements.length; i++) {
                        var oldclass = elements[i].getAttribute('class');
                        var newclass = oldclass + ' grid-east';
                        elements[i].setAttribute('class', newclass);
                    }
                    // west -> center
                    var elements = document.querySelectorAll('.grid-west');
                    for (var i=0; i<elements.length; i++) {
                        var oldclass = elements[i].getAttribute('class');
                        var newclass = oldclass.replace('grid-west', '').replace('  ', ' ');
                        elements[i].setAttribute('class', newclass);
                    }

                    // create new
                    data = ngm.loadDataByCoords(ngm.coordx, ngm.coordy)

                    data_north_west = extractDataByCoordLimits(data, [ngm.coordx-75,ngm.coordy-75], [ngm.coordx-25,ngm.coordy-25]);
                    data_west       = extractDataByCoordLimits(data, [ngm.coordx-75,ngm.coordy-25], [ngm.coordx-25,ngm.coordy+25]);
                    data_south_west = extractDataByCoordLimits(data, [ngm.coordx-75,ngm.coordy+25], [ngm.coordx-25,ngm.coordy+75]);

                    map.append(ngm.createGridSVGDom('north-west'));
                    ngm.fillWithContent('north-west', data_north_west);
                    map.append(ngm.createGridSVGDom('west'));
                    ngm.fillWithContent('west', data_west);
                    map.append(ngm.createGridSVGDom('south-west'));
                    ngm.fillWithContent('south-west', data_south_west);

                }, 500);

            } else if (direction == 'north') {

                $('.grid-svg').animate({marginTop: "+=500px"}, 500);
                ngm.coordy = ngm.coordy-50;
                console.log('new center xy:', ngm.coordx, ngm.coordy);
                setTimeout(function() {
                    // delete south
                    $('.grid-south').remove();

                    // center -> south
                    var elements = document.querySelectorAll('.grid-svg:not(.grid-north):not(.grid-south)');
                    for (var i=0; i<elements.length; i++) {
                        var oldclass = elements[i].getAttribute('class');
                        var newclass = oldclass + ' grid-south';
                        elements[i].setAttribute('class', newclass);
                    }
                    // north -> center
                    var elements = document.querySelectorAll('.grid-north');
                    for (var i=0; i<elements.length; i++) {
                        var oldclass = elements[i].getAttribute('class');
                        var newclass = oldclass.replace('grid-north', '').replace('  ', ' ');
                        elements[i].setAttribute('class', newclass);
                    }

                    // create new
                    data = ngm.loadDataByCoords(ngm.coordx, ngm.coordy)

                    data_north_west = extractDataByCoordLimits(data, [ngm.coordx-75,ngm.coordy-75], [ngm.coordx-25,ngm.coordy-25]);
                    data_north      = extractDataByCoordLimits(data, [ngm.coordx-25,ngm.coordy-75], [ngm.coordx+25,ngm.coordy-25]);
                    data_north_east = extractDataByCoordLimits(data, [ngm.coordx+25,ngm.coordy-75], [ngm.coordx+75,ngm.coordy-25]);

                    map.append(ngm.createGridSVGDom('north-west'));
                    ngm.fillWithContent('north-west', data_north_west);
                    map.append(ngm.createGridSVGDom('north'));
                    ngm.fillWithContent('north', data_north);
                    map.append(ngm.createGridSVGDom('north-east'));
                    ngm.fillWithContent('north-east', data_north_east);
                }, 500);

            } else if (direction == 'south') {

                $('.grid-svg').animate({marginTop: "-=500px"}, 500);
                ngm.coordy = ngm.coordy+50;
                console.log('new center xy:', ngm.coordx, ngm.coordy);
                setTimeout(function() {
                    // delete north
                    $('.grid-north').remove();

                    // center -> north
                    var elements = document.querySelectorAll('.grid-svg:not(.grid-north):not(.grid-south)');
                    for (var i=0; i<elements.length; i++) {
                        var oldclass = elements[i].getAttribute('class');
                        var newclass = oldclass + ' grid-north';
                        elements[i].setAttribute('class', newclass);
                    }
                    // south -> center
                    var elements = document.querySelectorAll('.grid-south');
                    for (var i=0; i<elements.length; i++) {
                        var oldclass = elements[i].getAttribute('class');
                        var newclass = oldclass.replace('grid-south', '').replace('  ', ' ');
                        elements[i].setAttribute('class', newclass);
                    }

                    // create new
                    data = ngm.loadDataByCoords(ngm.coordx, ngm.coordy)

                    data_south_west = extractDataByCoordLimits(data, [ngm.coordx-75,ngm.coordy+25], [ngm.coordx-25,ngm.coordy+75]);
                    data_south      = extractDataByCoordLimits(data, [ngm.coordx-25,ngm.coordy+25], [ngm.coordx+25,ngm.coordy+75]);
                    data_south_east = extractDataByCoordLimits(data, [ngm.coordx+25,ngm.coordy+25], [ngm.coordx+75,ngm.coordy+75]);

                    map.append(ngm.createGridSVGDom('south-west'));
                    ngm.fillWithContent('south-west', data_south_west);
                    map.append(ngm.createGridSVGDom('south'));
                    ngm.fillWithContent('south', data_south);
                    map.append(ngm.createGridSVGDom('south-east'));
                    ngm.fillWithContent('south-east', data_south_east);
                }, 500);
            }
        },
        removeSystem: function(direction) {

        }

    }

});
