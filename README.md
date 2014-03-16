Nouron Galaxy Map
=================

Nouron Galaxy Map is a javascript generated dynamic SVG map for browsergames


Quickstart
----------

create a div with class "ngm" and fill the data attributes data-height and data-width with your desired values (currently 700px is default - other values can be buggy for now)

```html
    <div class="ngm"></div> <!-- content will be filled by javascript! -->
```

inlucde ngm.js at the end of html and execute init method:

```html
<script src="ngm.js"></script>
<script>
    $(document).ready( function() {
        ngm.init({
            'dataSourceUri': "./dummydata.json", // data source - see description below
            'selector': '.ngm', // jquery selector to load content inside
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

### dataSourceUri

currently ./dummydata.json is included for testing purposes. Later it is intended to name a source uri (e.g. ajax function call) with minimum and maximum coordinates as query parameters. The *result json* has to have the following contents. 

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


Good to know
------------

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

### layer support

you can define up to four layers

more info follows...
