Nouron Galaxy Map
=================

Nouron Galaxy Map is a javascript generated dynamic SVG map for browsergames


Quickstart
----------

create a div (without any attributes) with an id you like to use, e.g. "ngm-map":

```html
    <div id="ngm-map"></div> <!-- content will be filled by javascript! -->
```

inlucde ngm.js at the end of html and execute init method with your desired settings:

```html
<script src="ngm.js"></script>
<script>
    $(document).ready( function() {
        ngm.init({
            'dataSourceUri': "./dummydata.json", // data source - see description below
            'selector': '#ngm-map', // jquery selector to load content inside; set your chosen id here!
            'width': '700px',
            'height': '700px',
            'center' : [1225, 1225], // absolute current center (these are business coords - not page coords!)
            'scale' : 10, // pix width of one field unit
            'range' : 50, // how many field units has one map (horizontal)
            'layers': [ // optional
                {'name': 'misc', 'class': 'ngm-misc-layer', 'objectDefaultShape': 'square'},
                {'name': 'planets', 'class': 'ngm-planets-layer', 'objectDefaultShape': 'circle'},
                {'name': 'stations', 'class': 'ngm-stations-layer', 'objectDefaultShape': 'square'},
                {'name': 'ships', 'class': 'ngm-ships-layer', 'objectDefaultShape': 'triangle'}
            ]
        });
    })
</script>
```

Settings
--------

#### dataSourceUri

This setting is the most important part. The script has to know where to send ajax requests to get the map data.

For example i use this string in nouron: "/galaxy/json/getmapdata/%s/%s"

The string should be given a url schema with (sprintf compatible) placeholders for x and y! It would even work without the placeholders, e.g. for a static map (but it's not tested) - it is up to you what the ajax request will return! (see below)

For the initial creation of the map x and y values from 'center'-setting will be used.
X and y will mark the center and depending on the range setting map data around this center position will be loaded via ajax request.

The *result json* has to have the following contents.

* x
* y
* layer (optional)
* attribs (optional)

**Example:**

```json
[{"layer": 1, "x": 1199, "y": 1199, "attribs":{"title":"nw-test", "class": "planet"}},
{"layer": 1, "x":1225, "y":1195, "attribs":{"title":"north-test", "class": "planet"}},
{"layer": 1, "x": 1251, "y": 1199, "attribs":{"title":"ne-test", "class": "planet"}},
{"layer": 1, "x": 1195, "y": 1225, "attribs":{"title":"west-test", "class": "planet"}},
{"layer": 1, "x": 1210, "y": 1222, "attribs":{"title":"test", "class": "planet"}},
{"layer": 1, "x": 1211, "y": 1222, "attribs":{"title":"test", "class": "planet"}},
{"layer": 1, "x": 1212, "y": 1222, "attribs":{"title":"test", "class": "planet"}},
{"layer": 1, "x": 1213, "y": 1222, "attribs":{"title":"test", "class": "planet"}},
{"layer": 1, "x": 1214, "y": 1222, "attribs":{"title":"test", "class": "planet"}},
{"layer": 1, "x": 1234, "y": 1234, "attribs":{"title":"test2", "class": "planet"}},
{"layer": 2, "x": 1230, "y": 1210, "attribs":{"title":"a station", "class": "station"}},
{"layer": 1, "x": 1254, "y": 1217, "attribs":{"title":"east-test", "class": "planet"}},
{"layer": 0, "x": 1251, "y": 1243, "attribs":{"title":"debris field", "class": "debris"}},
{"layer": 0, "x": 1253, "y": 1243, "attribs":{"title":"asteroid field", "class": "asteroids"}},
{"layer": 0, "x": 1253, "y": 1245, "attribs":{"title":"mine field", "class": "mines"}},
{"layer": 0, "x": 1254, "y": 1247, "attribs":{"title":"nebular", "class": "nebular"}},
{"layer": 1, "x": 1199, "y": 1251, "attribs":{"title":"south-west test", "class": "planet"}},
{"layer": 1, "x": 1225, "y":1255, "attribs":{"title":"south test", "class": "planet"}},
{"layer": 1, "x": 1255, "y": 1255, "attribs":{"title":"south-east test", "class": "planet"}}]
```

**Execute map examples:**

currently ./dummydata.json is included for testing purposes. No x and y given.

:exclamation: ATTENTION: if you want to test the examples locally and you have
no webserver like apache or nginx running you have to start a simple development
server to avoid problems concerning the same-origin-policy that major browsers
have build in. (see: http://en.wikipedia.org/wiki/Same-origin_policy)

```bash
# php >= 5.3
(project_root)$ php -S localhost:10000

# python 2.7
(project_root)$ python -m SimpleHTTPServer 10000

# then navigate your browser to http://localhost:10000/examples/galaxy_map
```

#### selector

You define a map container div in your html. This div will have a selector to be identified.
It is up to you to choose an id or a class but it is purposed to use an id like '#ngm-map'.
The div should not have any other attributes then the selector, otherwise it is possible that important attributes are overwritten with wrong values..

#### width and height

width and height of the map container div. Don't forget to give the unit type, e.g. '700px' (currently only pixel units are supported)

#### center

The initial center coordinates. All positions will be calculated on this coordinates as a basis.

#### scale

the scale: how many pixels will be used for one coordinate unit

#### range

distance in coordinates units from left to right or top to bottom border

#### layers

you can define up to four layers

more info follows...


Good to know
------------

### pixel units vs coordinates units

don't be confused with that:
- pixel units are used for positioning DOM elements
- coordinates units are used for you business objects, e.g. planets in a galaxy system map

### grid structure

this ascii square symbolize one SVG DOM element:

```html
<svg class="grid-svg">...</svg>
```


<pre>
+-------------+
|             |
|             |
|     SVG     |
|             |
|             |
|             |
+-------------+
</pre>

the full map consists of 9 separate SVG DOM elements:

```html
<div class="ngm" data-height="700px" data-width="700px">
    <svg class="grid-svg grid-north grid-west">...</svg>
    <svg class="grid-svg grid-north">...</svg>
    <svg class="grid-svg grid-north grid-east">...</svg>
    <svg class="grid-svg grid-west">...</svg>
    <svg class="grid-svg">...</svg>
    <svg class="grid-svg grid-east">...</svg>
    <svg class="grid-svg grid-south grid-west">...</svg>
    <svg class="grid-svg grid-south">...</svg>
    <svg class="grid-svg grid-south grid-east">...</svg>
</div>
```

<pre>
+-------------++-------------++-------------+
|             ||             ||             |
|             ||             ||             |
| .grid-north || .grid-north || .grid-north |
| .grid-west  ||             || .grid-east  |
|             ||             ||             |
|             ||             ||             |
+-------------++-------------++-------------+
+-------------++-------------++-------------+
|             ||             ||             |
|             ||             ||             |
| .grid-west  ||             || .grid-east  |
|             ||             ||             |
|             ||             ||             |
|             ||             ||             |
+-------------++-------------++-------------+
+-------------++-------------++-------------+
|             ||             ||             |
|             ||             ||             |
| .grid-south || .grid-south || .grid-south |
| .grid-west  ||             || .grid-east  |
|             ||             ||             |
|             ||             ||             |
+-------------++-------------++-------------+
</pre>

License
-------
This software is licensed under MIT License. See license.md for details.