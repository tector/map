Nouron Galaxy Map - a javascript generated dynamic SVG map for browsergames



this ascii square symbolize one SVG DOM element:

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
| .grid-east  ||             || .grid-east  |
|             ||             ||             |
|             ||             ||             |
+-------------++-------------++-------------+
</pre>
