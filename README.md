Nouron Galaxy Map
=================

Nouron Galaxy Map is a javascript generated dynamic SVG map for browsergames


Quickstart
----------
create a div with class "ngm" and fill the data attributes data-height and data-width with your desired values (currently 700px is default - other values can be buggy for now)
<code>
<div class="ngm" data-height="700px" data-height="700px"></div> <!-- content will be filled by javascript! -->
</code>

inlucde ngm.js at the end of html and execute init method:

<code>
<script src="ngm.js"></script>
<script>
    $(document).ready( function() {
        ngm.init('.ngm', 1225, 1225, 5);
    })
</script>
</code>

Good to know
------------

this ascii square symbolize one SVG DOM element:

<code>
<svg class="grid-svg">...</svg>
</code>


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

<code>
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
</code>

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
