$(document).ready( function() {
    ngm_editor = {
        init: function (config) {
            ngm_editor.dataSourceUri = config.dataSourceUri;
            ngm_editor.layers = config.layers;
            var controls = $('#ngm-editor');
            var objectTypes = ngm_editor.loadObjectTypes();
            for (var i=0; i<ngm_editor.layers.length; i++) {
                controls.append();
                var html = '<fieldset class="'+ngm_editor.layers[i].class+'"><legend>'+ngm_editor.layers[i].name+'</legend>';
                var objects = objectTypes.filter(function(el){return (el.layer == i);});
                for (var j=0; j<objects.length; j++) {
                    //console.log(objects[j]['attribs']['image']);
                    html = html + '<div class="object ' + objects[j].attribs.class + '" style="background-image: url(./'+ objects[j].attribs.image +')"></div>';
                }
                html = html + '</fieldset>';
                controls.append(html);
            }

            $("#ngm-editor .object").on('click', function (e) {
                e.preventDefault();
                $("#ngm-editor .object").removeClass('selected');
                $(this).addClass('selected');
            });

            $(".grid-svg").on('click', function(e) {
                coords = ngm.toggleSelect(e);
                console.log(coords);
                var selectedType = $("#ngm-editor .object.selected");
                console.log(selectedType);
                var layerClass = selectedType.parent().attr('class');
                console.log(layerClass);
                var tmp = $(".grid-svg ."+layerClass);
                console.log(tmp);
            });
        },
        loadObjectTypes: function() {
            // currently use of dummy data
            return (function () {
                var json = null;
                $.ajax({
                    jsonp: 'jsonp_callback',
                    'async': false,
                    'global': false,
                    'url': ngm_editor.dataSourceUri,
                    'dataType': "json",
                    'success': function (data) {
                        json = data;
                    }
                });
                return json;
            })();
        },
        exportMap: function() {
            var objects_data = [];
            $('.ngm svg g').children().each(function(i, item){
                var layer_class = $(this).parent().attr('class');
                if (this.tagName == 'rect' || this.tagName == 'circle') {
                    objects_data.push({
                        'attr': {
                            'class' : $(this).attr('class'),
                            'title' : $(this).attr('title')
                        },
                        'x' : $(this).data('x'),
                        'y' : $(this).data('y')
                    });
                }
            });
            return objects_data;
        }
    };
});
