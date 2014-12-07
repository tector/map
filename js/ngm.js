    ngm = {
        /* defaults */
        //systemsize: 50, // units
        //fieldsize: 10, // pixel
        //width: 700,
        //height: 700,

        sprintf: function(format, etc)
        {
            var arg = arguments;
            var i = 1;
            return format.replace(/%((%)|s)/g, function (m) { return m[2] || arg[i++]; });
        },

        makeDIV: function(attribs, value)
        {
            if (attribs === null) {
                attribs = {};
            }

            var el = document.createElement('div');

            for (var k in attribs) {
                el.setAttribute(k, attribs[k]);
            }

            if (value) {
                value = document.createTextNode(value);
                el.appendChild(value);
            }
            return el;
        },

        moveIndicator: function(e)
        {
            var range = ngm.range;
            var scale = ngm.scale;
            var xMin = Math.floor(ngm.coordx - ngm.range/2);
            var yMin = Math.floor(ngm.coordy - ngm.range/2);

            var selector = ngm.selector + ' .ngm';
            //console.log(selector);
            map_offset_left = Math.floor($(selector).offset().left);
            map_offset_top  = Math.floor($(selector).offset().top);
            center_div_left = Math.floor($(selector + " .grid-div:nth(4)").offset().left);
            center_div_top  = Math.floor($(selector + " .grid-div:nth(4)").offset().top);

            x = xMin + Math.floor((e.pageX - center_div_left) / scale);
            y = yMin + Math.floor((e.pageY - center_div_top) / scale);

            left = center_div_left + (x - xMin) * scale - map_offset_left;
            top_ = center_div_top  + (y - yMin) * scale - map_offset_top;

            $(selector + ' #field-indicator').remove();
            $(selector).append('<div id="field-indicator" style="top:'+top_+'px; left:'+left+'px; width:'+scale+'px; height:'+scale+'px;"><!-- --></div>');
            console.debug('['+x+','+y+',0]');
            console.debug($('#field-indicator'));

            return '['+x+','+y+',0]';
        },

        /**
         * calculate and (re)positioning the field selector
         *
         * @param e  mouseclick event
         * @return coords
         */
        toggleSelect: function(e)
        {
            var range = ngm.range;
            var scale = ngm.scale;
            var xMin = Math.floor(ngm.coordx - ngm.range/2);
            var yMin = Math.floor(ngm.coordy - ngm.range/2);


            var selector = ngm.selector + ' .ngm';
            //console.log(selector);
            map_offset_left = Math.floor($(selector).offset().left);
            map_offset_top  = Math.floor($(selector).offset().top);
            center_div_left = Math.floor($(selector + " .grid-div:nth(4)").offset().left);
            center_div_top  = Math.floor($(selector + " .grid-div:nth(4)").offset().top);

            x = xMin + Math.floor((e.pageX - center_div_left) / scale);
            y = yMin + Math.floor((e.pageY - center_div_top) / scale);

            left = center_div_left + (x - xMin) * scale - map_offset_left;
            top_ = center_div_top  + (y - yMin) * scale - map_offset_top;

            $(selector + ' #field-selector').remove();
            $(selector).append('<div id="field-selector" style="top:'+top_+'px; left:'+left+'px; width:'+scale+'px; height:'+scale+'px;"><!-- --></div>');
            console.debug('['+x+','+y+',0]');
            console.debug('toggleSelect');
            console.debug($('#field-selector'));

            $(selector).trigger('fieldSelect');

            return '['+x+','+y+',0]';
        },

        /**
         * create a new div element and position it in the right direction
         *
         * @param direction north|east|south|west
         * @return a div string
         */
        createGridDom: function(direction)
        {
            var tpl = '<div class="grid-div %s" style="width:%spx; height:%spx; margin-left: %spx; margin-top: %spx;"></div>';
            var width  = ngm.range * ngm.scale;
            var height = ngm.range * ngm.scale;

            var halfwidth  = Math.floor(width/2);
            var halfheight = Math.floor(height/2);

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
                    break;
                default:
                    throw "invalid direction";
            }

            //console.log(ngm.sprintf(tpl, class_, width, height, margin_left, margin_top));
            var tmp = ngm.sprintf(tpl, class_, width, height, margin_left, margin_top);
            return tmp;

        },

        /**
         * load data for one div map:
         *
         *        -25
         *         ^
         * -25 <- x,y -> +25
         *         v
         *        +25
         *
         * load data for 9 div maps:
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
        loadMapDataByCoords: function(coordx, coordy, initfullmap)
        {
            var xymin = [coordx-ngm.range*0.5, coordy-ngm.range*0.5];
            var xymax = [coordx+ngm.range*0.5, coordy+ngm.range*0.5];

            var data = (function () {
                var json = null;
                $.ajax({
                    jsonp: 'jsonp_callback',
                    'async': false,
                    'global': false,
                    'url': ngm.sprintf(ngm.dataSourceUri, coordx, coordy),
                    'dataType': "json",
                    'success': function (data) {
                        json = data;
                    }
                });
                return json;
            })();

            return data.filter(function(el){
                return (el.y >= xymin[1] && el.y < xymax[1] &&
                        el.x >= xymin[0] && el.x < xymax[0]);
            });
        },
        /**
         * check if essential settings are given in config
         */
        _validateConfig: function(config)
        {
            var missingProperties = [];
            if (!('dataSourceUri' in config)) {
                missingProperties.push('dataSourceUri');
            }
            if (!('selector' in config)) {
                missingProperties.push('selector');
            }
//            if (!('width' in config)) {
//                missingProperties.push('width');
//            }
//            if (!('height' in config)) {
//                missingProperties.push('height');
//            }
            if (!('center' in config)) {
                missingProperties.push('center');
            }
            if (!('scale' in config)) {
                missingProperties.push('scale');
            }
            if (!('range' in config)) {
                missingProperties.push('range');
            }
            if (!('layers' in config)) {
                missingProperties.push('layers');
            }

            //console.log(missingProperties);
            if (missingProperties.length>0) {
                var tmp = missingProperties.join(', ');
                throw ("Missing configuration setting(s) for: " + tmp );
            }

        },

        configurate: function(config)
        {
            if (isNaN(config.scale) || isNaN(config.range)) {
                config.width = isNaN(window.innerWidth) ? window.clientWidth : window.innerWidth;
                config.height = isNaN(window.innerHeight) ? window.clientHeight : window.innerHeight;
                config.scale = Math.round((config.height / 100) * 60 / 10);
                config.range = 10;
            }

            ngm._validateConfig(config);

            ngm.dataSourceUri = config.dataSourceUri;
            ngm.mode = config.mode;
            ngm.selector = config.selector;
            ngm.coordx = config.center[0];
            ngm.coordy = config.center[1];
            ngm.scale = parseInt(config.scale);
            ngm.range = parseInt(config.range);
            ngm.layers = config.layers;
            ngm.backgroundImageUrl = config.backgroundImageUrl;

            // event callbacks are optional - but we have to provide defaults:
            ngm.eventCallbacks = config.eventCallbacks || [];
            ngm.eventCallbacks.fieldSelect = ngm.eventCallbacks.fieldSelect || null;

            console.log('configuration complete:');
            console.log(ngm);

            $(ngm.selector).on('fieldSelect', ngm.eventCallbacks.fieldSelect);

        },

        /**
         * initialize whole map for first time
         * create nine separate div elements which are filled with loaded data
         *
         * @param config: array of configuration options
         */
        init: function(scale, range)
        {
            $('.ngm').remove();

            if (parseInt(scale)>0) {
                ngm.scale = parseInt(scale);
            }

            if (parseInt(range)>0) {
                ngm.range = parseInt(range);
            }

            if (ngm.backgroundImageUrl !== undefined) {
                background = 'background-image: url('+ngm.backgroundImageUrl+')';
            } else {
                background = '';
            }

            $(ngm.selector).attr('style', 'position:absolute');
            $(ngm.selector).html('<div class="ngm" style="width:100%;height:100%;'+background+'"></div>');

            var selector = ngm.selector + ' .ngm';
            map = $(selector).eq(0);

            data_north_west = ngm.loadMapDataByCoords(ngm.coordx-ngm.range, ngm.coordy-ngm.range);
            data_north      = ngm.loadMapDataByCoords(ngm.coordx, ngm.coordy-ngm.range);
            data_north_east = ngm.loadMapDataByCoords(ngm.coordx+ngm.range, ngm.coordy-ngm.range);

            map.append(ngm.createGridDom('north-west'));
            ngm.fillWithContent('north-west', data_north_west);
            map.append(ngm.createGridDom('north'));
            ngm.fillWithContent('north', data_north);
            map.append(ngm.createGridDom('north-east'));
            ngm.fillWithContent('north-east', data_north_east);

            data_west   = ngm.loadMapDataByCoords(ngm.coordx-ngm.range, ngm.coordy);
            data_center = ngm.loadMapDataByCoords(ngm.coordx, ngm.coordy);
            data_east   = ngm.loadMapDataByCoords(ngm.coordx+ngm.range, ngm.coordy);

            map.append(ngm.createGridDom('west'));
            ngm.fillWithContent('west', data_west);
            map.append(ngm.createGridDom('center'));
            ngm.fillWithContent('center', data_center);
            map.append(ngm.createGridDom('east'));
            ngm.fillWithContent('east', data_east);

            data_south_west = ngm.loadMapDataByCoords(ngm.coordx-ngm.range, ngm.coordy+ngm.range);
            data_south      = ngm.loadMapDataByCoords(ngm.coordx, ngm.coordy+ngm.range);
            data_south_east = ngm.loadMapDataByCoords(ngm.coordx+ngm.range, ngm.coordy+ngm.range);

            map.append(ngm.createGridDom('south-west'));
            ngm.fillWithContent('south-west', data_south_west);
            map.append(ngm.createGridDom('south'));
            ngm.fillWithContent('south', data_south);
            map.append(ngm.createGridDom('south-east'));
            ngm.fillWithContent('south-east', data_south_east);

            map.append('<div id="push-north" class="grid-push grid-push-north">&#x25B2;</div>');
            map.append('<div id="push-west" class="grid-push grid-push-west">&#x25C0;</div>');
            map.append('<div id="push-east" class="grid-push grid-push-east">&#x25B6;</div>');
            map.append('<div id="push-south" class="grid-push grid-push-south">&#x25BC;</div>');

            map.append('<div id="zoom-in" class="zoom-tool">+</div>');
            map.append('<div id="zoom-out" class="zoom-tool">-</div>');

            $(selector + ' .grid-push').on('click', function(e) {
                e.preventDefault();
                var id = $(this).attr('id');
                //console.log(id);
                switch (id) {
                    case 'push-east':
                        ngm.addSystems('east');
                        break;
                    case 'push-west':
                        ngm.addSystems('west');
                        break;
                    case 'push-north':
                        ngm.addSystems('north');
                        break;
                    case 'push-south':
                        ngm.addSystems('south');
                        break;
                    default:
                        throw "invalid push direction";
                }
            });

            $('.ngm #zoom-in').on('click', function(e){
                e.preventDefault();
                ngm.zoomIn();
            });

            $('.ngm #zoom-out').on('click', function(e){
                e.preventDefault();
                ngm.zoomOut();
            });

            $(".ngm").on('wheel', function(e) {
                e.preventDefault();
                if (e.originalEvent.wheelDelta > 0 || e.originalEvent.detail < 0) {
                    //console.debug('scroll up');
                    ngm.zoomIn();
                }
                else {
                    //console.debug('scroll down');
                    ngm.zoomOut();
                }
            });

            $(".ngm .grid-div").on('click', function(e) {
                coords = ngm.toggleSelect(e);
            });

//            $('.ngm .grid-div').on('mousemove', function(e) {
//                coords = ngm.moveIndicator(e);
//            });

        },

        zoomOut: function()
        {
            if (ngm.scale > 5) {
                scale = ngm.scale - Math.round(ngm.scale/3);
                range = ngm.range;
                console.debug('zoom out (scale: '+scale);
                ngm.init(scale, range);
            }
            if (ngm.scale > 5) {
                $('#zoom-out').show();
            } else {
                console.info('lowest zoom level reached.');
                $('#zoom-out').hide();
            }
        },

        zoomIn: function()
        {
            if (ngm.scale < 50) {
                scale = ngm.scale + Math.round(ngm.scale/3);
                range = ngm.range;
                console.debug('zoom in (scale: '+scale);
                ngm.init(scale, range);
            }
            if (ngm.scale < 50) {
                $('#zoom-in').show();
            } else {
                $('#zoom-in').hide();
                console.info('highest zoom level reached.');
            }
        },

        /**
         *
         * @param direction north|east|south|west
         * @param data
         */
        fillWithContent: function(direction, data)
        {
            class_ = '.grid-div';

            switch (direction) {
                case 'north-east':
                    targetdiv = $('.grid-div.grid-north.grid-east');
                    break;
                case 'east':
                    targetdiv = $('.grid-div.grid-east').not('.grid-north')
                                                       .not('.grid-south');
                    break;
                case 'south-east':
                    targetdiv = $('.grid-div.grid-south.grid-east');
                    break;
                case 'north-west':
                    targetdiv = $('.grid-div.grid-north.grid-west');
                    break;
                case 'west':
                    targetdiv = $('.grid-div.grid-west').not('.grid-north')
                                                       .not('.grid-south');
                    break;
                case 'south-west':
                    targetdiv = $('.grid-div.grid-south.grid-west');
                    break;
                case 'north':
                    targetdiv = $('.grid-div.grid-north').not('.grid-west')
                                                        .not('.grid-east');
                    break;
                case 'south':
                    targetdiv = $('.grid-div.grid-south').not('.grid-west')
                                                        .not('.grid-east');
                    break;
                case 'center':
                    targetdiv = $('.grid-div').not('.grid-north')
                                              .not('.grid-east')
                                              .not('.grid-south')
                                              .not('.grid-west');
                    break;
                default:
                    throw "invalid direction given";
            }

            for (i=0; i<ngm.layers.length; i++) {
                var objects = data.filter(function(elem){return elem.layer==i;});
                ngm.drawLayerObjects(targetdiv[0], ngm.layers[i], objects);
            }
        },
        /**
         * draw basic grid for one div element
         *
         * @param targetDomElement  div element to draw inside
         */
        drawGrid: function(targetDomElement) {

            if (targetDomElement.firstChild) {
                var child = targetDomElement.firstChild;
                if (child.hasClass('ngm-grid-layer')) {
                    return;
                }
            }

            max = Math.floor(ngm.range/10) * ngm.scale;

//            // horizontal lines
//            var group = ngm.makeSVG('g', {'class': 'ngm-grid-layer'});
//            for (var i=0; i<10; i++) {
//                group.appendChild(ngm.makeSVG('line', {
//                    x1: 0,
//                    y1: i*max,
//                    x2: ngm.range*ngm.scale,
//                    y2: i*max,
//                    stroke: '#222222',
//                    'stroke-width': '1px',
//                    'fill-opacity':'0'
//                }));
//            }
//
//            // vertical lines
//            for (var j=0; j<10; j++) {
//                group.appendChild(ngm.makeSVG('line', {
//                    x1: j*max,
//                    y1: 0,
//                    x2: j*max,
//                    y2: ngm.range*ngm.scale,
//                    stroke: '#222222',
//                    'stroke-width': '1px',
//                    'fill-opacity':'0'
//                }));
//            }
//
//            targetDomElement.appendChild(group);

        },
        /**
         *
         * @param targetDomElement
         * @param layerConfig
         * @param layerObjects
         */
        drawLayerObjects: function(targetDomElement, layerConfig, layerObjects) {
            var group = ngm.makeDIV({'class': layerConfig.class});
            for (var j=0; j<layerObjects.length; j++) {
                attribs = layerObjects[j].attribs;
                var m = 0.5 * ngm.range;
                var x = ((parseInt(layerObjects[j].x) + m ) % ngm.range) * ngm.scale;
                var y = ((parseInt(layerObjects[j].y) + m ) % ngm.range) * ngm.scale;
                var style = "position: absolute; left: "+x+'px; top: '+y+'px; width:'+ngm.scale+'px; height:'+ngm.scale+'px;';
                if ("image_url" in attribs) {
                    style += 'background-image: url('+attribs.image_url+'); background-size:'+ngm.scale+'px;';
                }

                group.appendChild(ngm.makeDIV({
                    'title': attribs.title,
                    'data-x': layerObjects[j].x,
                    'data-y': layerObjects[j].y,
                    'class': attribs.class,
                    'style': style
                }));
            }
            targetDomElement.appendChild(group);
        },
        /**
         * this will load and add new systems (3 at a time) for the given direction
         *
         * @param direction north|east|south|west
         */
        addSystems: function(direction) {
            var selector = ngm.selector + ' .ngm';
            var map = $(selector);
            var delta = ngm.range;
            if (direction == 'east') {
                $('.grid-div').animate({marginLeft: "-="+delta*ngm.scale+'px'}, 500);
                $(selector+' #field-selector').animate({marginLeft: "-="+delta*ngm.scale+'px'}, 500);
                ngm.coordx = ngm.coordx+delta;
                console.debug('new center xy:', ngm.coordx, ngm.coordy);

                setTimeout(function() {
                    // delete west
                    $('.grid-west').remove();
                    // center -> west
                    elements = document.querySelectorAll('.grid-div:not(.grid-west):not(.grid-east)');
                    for (i=0; i<elements.length; i++) {
                        oldclass = elements[i].getAttribute('class');
                        newclass = oldclass + ' grid-west';
                        elements[i].setAttribute('class', newclass);
                    }
                    // east -> center
                    elements = document.querySelectorAll('.grid-east');
                    for (i=0; i<elements.length; i++) {
                        oldclass = elements[i].getAttribute('class');
                        newclass = oldclass.replace('grid-east', '')
                                           .replace('  ', ' ');
                        elements[i].setAttribute('class', newclass);
                    }
                    // create new
                    data_north_east = ngm.loadMapDataByCoords(ngm.coordx+delta, ngm.coordy-delta);
                    data_east       = ngm.loadMapDataByCoords(ngm.coordx+delta, ngm.coordy);
                    data_south_east = ngm.loadMapDataByCoords(ngm.coordx+delta, ngm.coordy+delta);

                    map.append(ngm.createGridDom('north-east'));
                    ngm.fillWithContent('north-east', data_north_east);
                    map.append(ngm.createGridDom('east'));
                    ngm.fillWithContent('east', data_east);
                    map.append(ngm.createGridDom('south-east'));
                    ngm.fillWithContent('south-east', data_south_east);

                }, 500);

            } else if (direction == 'west') {

                $('.grid-div').animate({marginLeft: "+="+delta*ngm.scale+'px'}, 500);
                $(selector +' #field-selector').animate({marginLeft: "+="+delta*ngm.scale+'px'}, 500);
                ngm.coordx = ngm.coordx-delta;
                console.debug('new center xy:', ngm.coordx, ngm.coordy);
                setTimeout(function() {
                    // delete east
                    $('.grid-east').remove();
                    // center -> east
                    elements = document.querySelectorAll('.grid-div:not(.grid-west):not(.grid-east)');
                    for (i=0; i<elements.length; i++) {
                        oldclass = elements[i].getAttribute('class');
                        newclass = oldclass + ' grid-east';
                        elements[i].setAttribute('class', newclass);
                    }
                    // west -> center
                    elements = document.querySelectorAll('.grid-west');
                    for (i=0; i<elements.length; i++) {
                        oldclass = elements[i].getAttribute('class');
                        newclass = oldclass.replace('grid-west', '')
                                           .replace('  ', ' ');
                        elements[i].setAttribute('class', newclass);
                    }

                    // create new
                    data_north_west = ngm.loadMapDataByCoords(ngm.coordx-delta, ngm.coordy-delta);
                    data_west       = ngm.loadMapDataByCoords(ngm.coordx-delta, ngm.coordy);
                    data_south_west = ngm.loadMapDataByCoords(ngm.coordx-delta, ngm.coordy+delta);

                    map.append(ngm.createGridDom('north-west'));
                    ngm.fillWithContent('north-west', data_north_west);
                    map.append(ngm.createGridDom('west'));
                    ngm.fillWithContent('west', data_west);
                    map.append(ngm.createGridDom('south-west'));
                    ngm.fillWithContent('south-west', data_south_west);

                }, 500);

            } else if (direction == 'north') {

                $('.grid-div').animate({marginTop: "+="+delta*ngm.scale+'px'}, 500);
                $(selector+' #field-selector').animate({marginTop: "+="+delta*ngm.scale+'px'}, 500);
                ngm.coordy = ngm.coordy-delta;
                console.debug('new center xy:', ngm.coordx, ngm.coordy);
                setTimeout(function() {
                    // delete south
                    $('.grid-south').remove();

                    // center -> south
                    elements = document.querySelectorAll('.grid-div:not(.grid-north):not(.grid-south)');
                    for (i=0; i<elements.length; i++) {
                        oldclass = elements[i].getAttribute('class');
                        newclass = oldclass + ' grid-south';
                        elements[i].setAttribute('class', newclass);
                    }
                    // north -> center
                    elements = document.querySelectorAll('.grid-north');
                    for (i=0; i<elements.length; i++) {
                        oldclass = elements[i].getAttribute('class');
                        newclass = oldclass.replace('grid-north', '')
                                           .replace('  ', ' ');
                        elements[i].setAttribute('class', newclass);
                    }

                    // create new
                    data_north_west = ngm.loadMapDataByCoords(ngm.coordx-delta, ngm.coordy-delta);
                    data_north      = ngm.loadMapDataByCoords(ngm.coordx, ngm.coordy-delta);
                    data_north_east = ngm.loadMapDataByCoords(ngm.coordx+delta, ngm.coordy-delta);

                    map.append(ngm.createGridDom('north-west'));
                    ngm.fillWithContent('north-west', data_north_west);
                    map.append(ngm.createGridDom('north'));
                    ngm.fillWithContent('north', data_north);
                    map.append(ngm.createGridDom('north-east'));
                    ngm.fillWithContent('north-east', data_north_east);
                }, 500);

            } else if (direction == 'south') {

                $('.grid-div').animate({marginTop: "-="+delta*ngm.scale+'px'}, 500);
                $(selector+' #field-selector').animate({marginTop: "-="+delta*ngm.scale+'px'}, 500);
                ngm.coordy = ngm.coordy+delta;
                console.debug('new center xy:', ngm.coordx, ngm.coordy);
                setTimeout(function() {
                    // delete north
                    $('.grid-north').remove();

                    // center -> north
                    elements = document.querySelectorAll('.grid-div:not(.grid-north):not(.grid-south)');
                    for (i=0; i<elements.length; i++) {
                        oldclass = elements[i].getAttribute('class');
                        newclass = oldclass + ' grid-north';
                        elements[i].setAttribute('class', newclass);
                    }
                    // south -> center
                    elements = document.querySelectorAll('.grid-south');
                    for (i=0; i<elements.length; i++) {
                        oldclass = elements[i].getAttribute('class');
                        newclass = oldclass.replace('grid-south', '')
                                               .replace('  ', ' ');
                        elements[i].setAttribute('class', newclass);
                    }

                    // create new
                    data_south_west = ngm.loadMapDataByCoords(ngm.coordx-delta, ngm.coordy+delta);
                    data_south      = ngm.loadMapDataByCoords(ngm.coordx, ngm.coordy+delta);
                    data_south_east = ngm.loadMapDataByCoords(ngm.coordx+delta, ngm.coordy+delta);

                    map.append(ngm.createGridDom('south-west'));
                    ngm.fillWithContent('south-west', data_south_west);
                    map.append(ngm.createGridDom('south'));
                    ngm.fillWithContent('south', data_south);
                    map.append(ngm.createGridDom('south-east'));
                    ngm.fillWithContent('south-east', data_south_east);
                }, 500);
            }
        }

//        removeSystem: function(direction) {
//
//        },

//        exportMap: function() {
//            var objects_data = [];
//            $('.ngm svg g').children().each(function(i, item){
//                var layer_class = $(this).parent().attr('class');
//                if (this.tagName == 'rect' || this.tagName == 'circle') {
//                    objects_data.push({
//                        'attr': {
//                            'class' : $(this).attr('class'),
//                            'title' : $(this).attr('title'),
//                            'image_url': $(this).attr('image_url')
//                        },
//                        'x' : $(this).data('x'),
//                        'y' : $(this).data('y')
//                    });
//                }
//            });
//            return objects_data;
//        }
    };
