/*  Federated SPARQL Search Widget
    Esko Ikkala, SeCo, Aalto University, 12/07/2015
    Jouni Tuominen, SeCo, Aalto University, 08/06/2016
    http://seco.cs.aalto.fi
*/

window.SparqlSearchWidget = (function($) {
    'use strict';

    return SparqlSearchWidget;

    function SparqlSearchWidget(config) {
        // UI strings
        var strings = {
            selectionTitle: 'Select source dataset(s)',
            searchPlaceholder: 'Type at least two letters',
            browseLinkedData: 'Browse Linked Data',
            trySparqlEndpoint: 'Try SPARQL endpoint',
            typeaheadEmpty : 'No results.',
            typeaheadMissingCoordinates: '[coordinates missing]'
        };

        var self = this;

        self.config = config;

        initWidget();

        // Functions for building the widget

        function initWidget() {

            var inputId = self.config.containerId + '-input';
            self.typeaheadElem = $('<label for=" '+ inputId +' ">' + self.config.inputLabel +'</label><input id="'+ inputId +'" placeholder="' + strings['searchPlaceholder'] + '" class="form-control typeahead" type="text" />');

            self.datasetContainer = $('<div class="source-options pull-left"></div>');
            self.datasetContainer.html(
              '<div class="row"> ' +
                  '<div class="col-lg-12"> ' +
                    '<div class="button-group"> ' +
                      '<button type="button" class="btn btn-default btn-sm dropdown-toggle" data-toggle="dropdown"> <span class="glyphicon glyphicon-cog"></span> Select sources  <span class="caret"></span></button>' +
                        '<ul class="dropdown-menu dropdown-datasets">' +
                        '</ul>' +
                    '</div>' +
                  '</div>' +
                '</div>'
            );

            //self.datasetContainer = $('<div class="datasets"></div>');
            //self.datasetContainer.html(
            //    ' <div class=selection-title-container> ' +
            //        ' <h4 class="selection-title">' + strings['selectionTitle'] + '</h4> ' +
            //    ' </div> '
            //);

            var inputWrapper = $('<div class="tt-wrapper pull-left"></div>');
            inputWrapper.append(self.typeaheadElem);

            self.widgetContainer = $('#' + self.config.containerId);
            self.widgetContainer
                .addClass('sparql-search-widget-container')
                //.append(self.datasetContainer)
                .append(inputWrapper);

            initTypeahead(true);

            inputWrapper.after(self.datasetContainer);

            initCheckboxes();
        }

        function initTypeahead(pageLoad) {
            var typeaheadSources = [];
            //console.log(self.config.sources);
            $.each(self.config.sources, function(datasetId, element) {
                if (pageLoad) {
                    if (!element['title-long'])
                        element['title-long'] = element['title'];

                    self.datasetContainer.find('.dropdown-datasets').append(

                        '<li><a href="#" class="small" data-value="'+datasetId+'" tabIndex="-1"><input id="check-' + datasetId + '" type="checkbox" checked="true" />&nbsp;'+ element['title'] +'</a></li>'



                        // ' <div class="row" id="dataset-' + datasetId + '"> ' +
                        //     ' <div class="checkbox pull-left"> ' +
                        //         ' <label> ' +
                        //             ' <input id="check-' + datasetId + '" type="checkbox" value="" checked="true"> ' +
                        //         ' </label> ' +
                        //     ' </div> ' +
                        //     ' <div class="dropdown pull-left"> ' +
                        //         ' <button class="btn btn-primary btn-xs dropdown-toggle" type="button" id="dropdownMenu' + datasetId +
                        //                 '" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true"> ' +
                        //             ' <span class="glyphicon glyphicon-menu-hamburger" aria-hidden="true"></span> ' +
                        //         ' </button> ' +
                        //         ' <ul class="dropdown-menu" aria-labelledby="dropdownMenu' + datasetId + '"> ' +
                        //             ' <li><a href="' + element['endpoint'] + '" target="_blank">' + strings['trySparqlEndpoint'] + '</a></li> ' +
                        //         ' </ul> ' +
                        //     ' </div> ' +
                        //     ' <div id="title-' + datasetId + '" class="pull-left dataset-title" data-toggle="tooltip" data-placement="right" title="' +
                        //             element['title-long'] + '">' +
                        //         element['title'] +
                        //     '</div> ' +
                        // ' </div> '
                    );
                }
                if (!element['disabled'])
                    typeaheadSources.push(initTypeaheadSource(datasetId, element, self.config['callback']));
            });

            self.typeaheadElem.typeahead(
                {
                    hint: false,
                    highlight: true,
                    minLength: 2
                },
                typeaheadSources
            )
            // This keeps tt-menu always open if the query >= minLength
            .on('typeahead:beforeclose', function(ev) {
                ev.preventDefault();
            })
            .on('typeahead:render', function(ev, suggestion, async, dataset) {
                // Here it's possible to detect when all suggestions have been rendered
            })
            .on('typeahead:asyncrequest', function(ev, query, dataset) {
                //console.log('typeahead:asyncrequest ' + query + dataset);
            })
            // Preventing the default click functionality, click functions are defined earlier for each dataset
            .on('typeahead:asyncreceive', function(ev, query, dataset) {
                $('.tt-selectable').removeClass('tt-selectable');
                //console.log('typeahead:asyncreceive ' + query + dataset);
            })
            // Preventing the default click functionality
            .on('typeahead:select', function(ev, suggestion) {
                ev.preventDefault();
            })
            .on('typeahead:asynccancel', function(ev, query, dataset) {
                //console.log('typeahead:canceled ' + ev + ' ' + query + ' ' +  dataset);
            })
            .on('typeahead:open', function(ev, suggestion) {
                //$("#instructions").hide();
            });
        }

        function initTypeaheadSource(id, config, callback) {

            var typeahead_source = {
                name: id,
                displayKey: 'value',
                source: function(query, syncResults, asyncResults) {
                    querySource(id, config, query, syncResults, asyncResults);
                },
                limit: 500,
                templates: {
                    empty: '<h3 class="typeahead-header">' + config['title'] + '</h3><div class="empty-message">' + strings['typeaheadEmpty'] + '</div>',
                    suggestion: function(data) {
                        var dropdown =
                            '<div class="btn-group pull-right result-button-g">' +
                                '<button type="button" class="btn btn-primary btn-xs dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
                                    '<span class="glyphicon glyphicon-menu-hamburger" aria-hidden="true"></span>' +
                                '</button>' +
                                '<ul class="dropdown-menu pull-right">' +
                                    '<li><a href="' + data.uri + '" target="_blank">' + strings['browseLinkedData'] +'</a></li>' +
                                '</ul>' +
                            '</div>';

                        var htmlString =
                            '<div class="row" data-preflabel="' + data.value + '" data-polygon="' + data.polygon +
                                    '" data-lat="' + data.lat + '" data-long="' + data.long + '" data-id="' + data.id +
                                    '" data-uri="' + data.uri + '" data-query="' + data.query + '" data-specifier="' + data.specifier + '">' +
                                '<a class="result-text pull-left" role="button" data-id="' + data.id + '">' +
                                    data.value + data.specifier + data.missing +
                                '</a>' +
                                dropdown +
                            '</div>';

                        var dataset = {};
                        dataset.title = config['title'];
                        dataset.endpoint = config['endpoint'];

                        $('.tt-menu').off('click', '[data-id="' + data.id + '"]');
                        $('.tt-menu').on('click', '[data-id="' + data.id + '"]', function() {
                            if (config['callback'])
                                config['callback'](data, dataset);
                            else if (callback)
                                callback(data, dataset);
                            else
                                console.log(data.value + ' (' + data.uri + '; ' + dataset.title + '; ' + dataset.endpoint);
                        });

                        return htmlString;
                    },
                    header: '<h3 class="typeahead-header">' + config['title'] + '</h3>'
                }
            };
            return typeahead_source;
        }

        function resetTypeahead() {
            var theVal = self.typeaheadElem.val();
            self.typeaheadElem.typeahead('destroy');
            initTypeahead();
            self.typeaheadElem.focus().typeahead('val',theVal).focus();
        }

        function querySource(id, config, query, syncResults, asyncResults) {
            $.ajax({
                url: config['endpoint'],
                data: {
                    query: config['query'].replace('QUERY', query)
                },
                dataset_id: id,
                dataType: 'json',
                headers: { Accept: 'application/sparql-results+json' },
                success: function(data) {
                    var bindings = data.results.bindings;
                    var matches = [];
                    if (bindings.length > 0) {
                        for (var i=0; i<bindings.length; i++) {

                            var specifier = '';
                            if (bindings[i].typeLabel)
                                specifier = ' (' + bindings[i].typeLabel.value;
                            if (bindings[i].hierarchyLabel)
                                specifier += ', ' + bindings[i].hierarchyLabel.value;
                            if (bindings[i].typeLabel)
                                specifier += ')';

                            var miss = '';
                            var polygon = '';
                            var lat = '';
                            var long = '';

                            if (bindings[i].lat === undefined) {
                                //miss = " " + strings["typeaheadMissingCoordinates"];
                            } else {
                                lat = bindings[i].lat.value;
                                long = bindings[i].long.value;
                            }

                            if (bindings[i].polygon !== undefined) {
                                polygon = bindings[i].polygon.value;
                            }

                            matches.push({
                                value: bindings[i].prefLabel.value,
                                uri: bindings[i].s.value,
                                specifier: specifier,
                                missing: miss,
                                polygon: polygon,
                                lat: lat,
                                long: long,
                                id: this.dataset_id + '_' + bindings[i].s.value
                            });
                        }
                    }
                    asyncResults(matches);
                }
            });
        }

        function initCheckboxes() {
            self.datasetContainer.find('input:checkbox').change(function() {
                var source_id = $(this).attr('id').replace('check-', '');
                if ( $(this).prop('checked') ) {
                    self.config['sources'][source_id].disabled = false;
                } else {
                    self.config['sources'][source_id].disabled = true;
                }
                resetTypeahead();
            });

        }
      }
/* global jQuery */
})(jQuery);
