/*  Federated SPARQL Search Widget
    Esko Ikkala, SeCo, Aalto University, 12/07/2015
		Jouni Tuominen, SeCo, Aalto University, 08/06/2016
    http://seco.cs.aalto.fi
*/

(function() {
	// An immediately-invoked function expression => the code here is executed once in its own scope

$(document).ready(function() {
	$.ajax({
	  url: "//cdnjs.cloudflare.com/ajax/libs/typeahead.js/0.11.1/typeahead.jquery.min.js",
	  dataType: "script",
		cache: true,
	  success: initWidget
	});
});

// UI strings

var strings = {
		selectionTitle: "Select source dataset(s)",
		searchPlaceholder: "Type at least two letters, e.g. Kivennapa",
		browseLinkedData: "Browse Linked Data",
		trySparqlEndpoint: "Try SPARQL endpoint",

		typeaheadEmpty : "No results.",
		typeaheadMissingCoordinates: "[coordinates missing]"
};

// Functions for building the widget

function initWidget() {
	$(".sparql-widget").addClass("container")
	.html('\
		<div class="row"> \
			<div class="col-md-4"> \
				<!--<div id="datasets" class="hipla-only">--> \
				<div id="datasets"> \
					<h4 id="selection-title">'+strings["selectionTitle"]+'</h4> \
				</div> \
				<div id="#tt-wrapper"> \
					<input id="search-input" placeholder="'+strings["searchPlaceholder"]+'" class="form-control typeahead" type="text" name="search-input"> \
				</div> \
			</div> \
		</div> \
	');

	initTypeahead(true);
	initCheckboxes();
}

function initTypeahead(pageLoad) {
	var typeahead_sources = [];
	$.each(sparql_widget_config['sources'], function(index, element) {
	  if (pageLoad) {
			if (!element["title-long"])
			  element["title-long"] = element["title"];
			$("#datasets").append('\
			<div class="row" id="dataset-'+index+'"> \
				<div class="checkbox pull-left"> \
					<label> \
						<input id="check-'+index+'" type="checkbox" value="" checked="true"> \
					</label> \
				</div> \
				<div class="dropdown pull-left"> \
					<button class="btn btn-primary btn-xs dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true"> \
						<span class="glyphicon glyphicon-menu-hamburger" aria-hidden="true"></span> \
					</button> \
					<ul class="dropdown-menu" aria-labelledby="dropdownMenu1"> \
						<li><a href="'+element["endpoint"]+'" target="_blank">'+strings["trySparqlEndpoint"]+'</a></li> \
					</ul> \
				</div> \
				<div id="title-'+index+'" class="pull-left dataset-title" data-toggle="tooltip" data-placement="right" title="'+element["title-long"]+'">'+element["title"]+'</div> \
			</div> \
		');
	  }
		if (!element['disabled'])
			typeahead_sources.push(initTypeaheadSource(index, element, sparql_widget_config['callback']));
	});

	$('.typeahead').typeahead({
		hint: false,
		highlight: true,
		minLength: 2 },
		typeahead_sources
	)
	// This keeps tt-menu always open if the query >= minLength
	.on('typeahead:beforeclose', function(ev) {
		ev.preventDefault();
	})
	.on("typeahead:render", function(ev, suggestion, async, dataset) {
		// Here it's possible to detect when all suggestions have been rendered
	})
	.on("typeahead:asyncrequest", function(ev, query, dataset) {
		//console.log("typeahead:asyncrequest " + query + dataset);
	})
	// Preventing the default click functionality, click functions are defined earlier for each dataset
	.on("typeahead:asyncreceive", function(ev, query, dataset) {
		$(".tt-selectable").removeClass("tt-selectable");
		//console.log("typeahead:asyncreceive " + query + dataset);
	})
	// Preventing the default click functionality
	.on("typeahead:select", function(ev, suggestion) {
		ev.preventDefault();
	})
	.on("typeahead:asynccancel", function(ev, query, dataset) {
		//console.log("typeahead:canceled " + ev + " " + query + " " +  dataset);
	})
	.on("typeahead:open", function(ev, suggestion) {
		//$("#instructions").hide();
	})
}

function initTypeaheadSource(id, config, global_callback) {

	var typeahead_source = {
			name: id,
			displayKey: 'value',
			source: function(query, syncResults, asyncResults) {
				querySource(id, config, query, syncResults, asyncResults);
			},
			limit: 500,
			templates:
			{
				empty: '<h3 class="typeahead-header">'+config["title"]+'</h3><div class="empty-message">' + strings["typeaheadEmpty"] +'</div>',
				suggestion: function(data) {
						dropdown = '<div class="btn-group pull-right result-button-g">' +
															'<button id="result-dd" type="button" class="btn btn-primary btn-xs dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
																'<span class="glyphicon glyphicon-menu-hamburger" aria-hidden="true"></span>' +
															'</button>' +
															'<ul class="dropdown-menu pull-right">' +
																'<li><a href="' + data.uri + '" target="_blank">' + strings["browseLinkedData"] +'</a></li>' +
															'</ul>';
									 '</div>';

					var htmlString ='<div class="row" data-preflabel="'+data.value+'" data-polygon="'+data.polygon+'" data-lat="'+data.lat+'" data-long="'+data.long+'" data-id="'+data.id+'" data-uri="'+data.uri+'" data-query="'+data.query+'" data-specifier="'+data.specifier+'">' +
											'<a class="result-text pull-left" role="button">' +
															data.value + data.specifier + data.missing +
														'</a>' +
														dropdown +
													 '</div>';

					var dataset = {};
					dataset.title = config['title'];
					dataset.endpoint = config['endpoint'];

					$(".tt-menu").off("click", "[data-id='" + data.id + "']");
					$(".tt-menu").on("click", "[data-id='" + data.id + "']", function() {
						if (config['callback'])
							config['callback'](data, dataset);
						else if (global_callback)
							global_callback(data, dataset);
						else
							console.log(data.value + " (" + data.uri + "; " + dataset.title + "; " + dataset.endpoint);
					});

					return htmlString;
				},
				header: '<h3 class="typeahead-header">'+config["title"]+'</h3>'
				}
		}
return typeahead_source;
}

function resetTypeahead() {
	var theVal = $(".typeahead").val();
	$(".typeahead").typeahead('destroy');
	initTypeahead();
	$(".typeahead").focus().typeahead('val',theVal).focus();
}

function querySource(id, config, query, syncResults, asyncResults) {
	ajaxRequest =  $.ajax({
		url: config['endpoint'],
		data: {
			query: config['query'].replace("QUERY", query)
		},
		dataset_id: id,
		dataType: 'json',
		success: function(data) {
			var bindings = data.results.bindings;
			var matches = new Array();
			if (bindings.length > 0) {
				for (var i=0; i<bindings.length; i++) {

					var specifier = "";
					if (bindings[i].typeLabel)
						specifier = " (" + bindings[i].typeLabel.value;
					if (bindings[i].hierarchyLabel)
						specifier += ", " + bindings[i].hierarchyLabel.value;
					if (bindings[i].typeLabel)
						specifier += ")";

					var miss = "";
					var polygon = ""
					var lat = "";
					var long = "";

					if ( bindings[i].lat === undefined) {
						//miss = " " + strings["typeaheadMissingCoordinates"];
					} else {
						lat = bindings[i].lat.value;
						long = bindings[i].long.value;
					}

					if ( bindings[i].polygon === undefined) {
					} else {
						polygon = bindings[i].polygon.value;
					}

					matches.push({ value: bindings[i].prefLabel.value,
									 uri: bindings[i].s.value,
									 specifier: specifier,
									 missing: miss,
									 polygon: polygon,
									 lat: lat,
									 long: long,
									 id: this.dataset_id + "_" + bindings[i].s.value,
									 });
				}
			}
			asyncResults(matches);
		}
	});
}

function initCheckboxes() {
	$("#datasets input:checkbox").change(function() {
		var source_id = $(this).attr("id").replace("check-", "");
		if ( $(this).prop("checked") ) {
			sparql_widget_config['sources'][source_id].disabled = false;
		} else {
			sparql_widget_config['sources'][source_id].disabled = true;
		}
		resetTypeahead();
	});
}

})();
