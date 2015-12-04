var strings = {
	
		warsaMunicipalities: "Finnish municipalities 1939-44",
		warsaMunicipalitiesLong : "Finnish municipalities 1939-44 (625 municipalities)",
		karelianPlaces : "Karelian map names 1922-44",
		karelianPlacesLong : "Karelian places 1922-44 (32 402 places)",
		karelianPlaces20000 : "Karelian places 1:20 000",
		karelianPlaces100000 : "Karelian places 1:100 000",
		pnr : "Geographic Names Registry",
		pnrLong : "Geographic Names Registry (800 000 places)",
		sapo: "SAPO",
		sapoLong: "Finnish Spatio-Temporal Ontology (SAPO)",
		suggestedPlaces: "Suggested places",
		suggestedPlacesLong: "User suggested places",
		tgn: "Getty TGN",
		tgnLong: "The Getty Thesaurus of Geographic Names (TGN)",
		
		typeaheadEmpty : "No results.",
		infoMissing: "information missing",	
		typeaheadMissingCoordinates: "[coordinates missing]",
		
		selectionTitle: "Select source dataset(s)",
		showPlaces: "View all places on current map view",
		tabSearchPlaces: "Search places",
		tabSearchMaps: "Maps",
		searchPlaceholder: "Type at least two letters, e.g. Kivennapa",	
		
		mapHelp: "Use the checkboxes to select maps that intersect" +
				"the current map view. The opacity of the historical " +
				"map can be controlled with the slider on the top right corner " +
				"of the screen.",
		mapAllSeries: "All map series ",
		mapSenateAtlas: "Senate atlas",
		mapKarelianAtlas: "Karelian maps",
		map100000topographic: "1:100 000 topographic",
		map20000topographic: "1:20 000 topographic",
		mapRefresh: " Refresh map list",
		mapSelectAll : " select all",
		
		instuctionsTitle : "",
		//(625 kpl) (32 402 kpl)
		instructionsP1 : "" +
				"" +
				"",
		instructionsP2 : "" +
				"" +
				"" +
				"" +
				"",
				
		alertModalSetZoom : "Set map zoom level to 12",		
		close : "Close",	
		alertModalWarning: " dataset is too large for viewing all places " +
		"at current zoom level. The zoom level must be at least 12.",
		
		articlesTitle : "Articles from Kansa taisteli magazines possibly related to",
		articlesIssue : "Issue",
		articlesReadPdf : "Read the original article",
		
		eventsTitle : "Events related possibly to",
		eventsViewDataPage : "View event data page", 
		
		missingDate : "(missing date)",
		warsampoLinks : "Related linked data from the <a href='http://seco.cs.aalto.fi/projects/sotasampo/en/' target='_blank'> WarSampo project</a>:",
		
		onlyWithLinks: "Search only places with links to WarSampo content",
};

var searchOnlyPlacesWithLinks = true;
var warsaMode = true;


//Source dataset selections
var sources = {};

//Set initial sources
sources["warsa_municipalities"] = true;
sources["warsa_karelian_places"] = true;
sources["sapo"] = true;
sources["suggested_places"] = true;
sources["pnr"] = true;
//sources["tgn"] = false;


$("#selection-title").text(strings["selectionTitle"]);
$("#title-warsa").text(strings["warsaMunicipalities"]);
$("#title-warsa").attr("title", strings["warsaMunicipalitiesLong"]);
$("#title-karelian").text(strings["karelianPlaces"]);
$("#title-karelian").attr("title", strings["karelianPlacesLong"]);
$("#title-pnr").text(strings["pnr"]);
$("#title-pnr").attr("title", strings["pnrLong"]);
$("#show-places").text(strings["showPlaces"]);
$("#show-places-with-links").text(strings["showPlacesWithLinks"]);
$("#tab-search-places").text(strings["tabSearchPlaces"]);
$("#tab-search-maps").text(strings["tabSearchMaps"]);
$("#search-input").attr("placeholder", strings["searchPlaceholder"]);
$("#search-only-with-links").append(strings["onlyWithLinks"]);

initTypeahead();
initCheckboxes();

$("#check-warsa").prop("checked", true);
$("#check-karelian").prop("checked", true);
$("#check-sapo").prop("checked", true);
$("#check-suggested").prop("checked", true);
$("#check-pnr").prop("checked", true);
//$("#check-tgn").prop("checked", false);


$("#check-search-only-with-links").prop("checked", true);

$('#check-search-only-with-links').change(function() {
	if ( $(this).prop("checked") ) {
		searchOnlyPlacesWithLinks = true;
	} else {
		searchOnlyPlacesWithLinks = false;
	}
	resetTypeahead();
});


function initTypeahead() {
	
	// All sources are disabled by default. It seems impossible to
	// pass empty dataset objects to typeahead, so source functions
	// were made to return empty results when they are disabled. 
	var warsa_municipalities = { 
			source: queryWarsaMunicipalities("disabled"),	
	}	
	var warsa_karelian_places = { 
			source: queryKarelianPlaces("disabled"),	
	}
	var sapo = { 
			source: querySapo("disabled"),	
	}
	var suggested_places = { 
			source: querySuggestedPlaces("disabled"),	
	}
	var pnr = { 
			source: queryPNR("disabled"),	
	}
//	var tgn = { 
//			source: queryPNR("disabled"),	
//	}
	
	if (sources["warsa_municipalities"] == true) {
		
		warsa_municipalities = { 
				name: 'warsa_municipalities',
				displayKey: 'value',
				source: queryWarsaMunicipalities(),
				limit: 500,
				templates: 
				{
					empty: '<h3 class="typeahead-header">'+strings["warsaMunicipalities"]+'</h3><div class="empty-message">' + strings["typeaheadEmpty"] +'</div>',
					suggestion: function(data) {
						//console.log(warsaMode);
						if (warsaMode) {
							dropdown = '';
							
						} else {
							dropdown = '<div class="btn-group pull-right result-button-g">' +
	                   						'<button id="result-dd" type="button" class="btn btn-primary btn-xs dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
	                   							'<span class="glyphicon glyphicon-menu-hamburger" aria-hidden="true"></span>' +
	                   						'</button>' +
	                   						'<ul class="dropdown-menu pull-right">' +
		                   				//      '<li><a id="' + data.id + '" role="button">Focus on map</a></li>' +
		                   						'<li><a href="' + data.uri + '" target="_blank">View/edit in SAHA editor</a></li>' +
		                   			   //       '<li><a id="' + data.id + '_map" role="button">Search historical maps</a></li>' +
	                   						'</ul>';
									   '</div>';   	
						}

						var htmlString ='<div class="row" data-preflabel="'+data.value+'" data-polygon="'+data.polygon+'" data-lat="'+data.lat+'" data-long="'+data.long+'" data-id="'+data.id+'" data-uri="'+data.uri+'" data-query="'+data.query+'" data-laani="'+data.laani+'" data-laaniuri="'+data.laaniURI+'" data-query="'+data.query+'">' +
							    			'<a id="'+ data.id +'" class="result-text pull-left" role="button">' +
					               				data.value + ', ' + data.laani + ' ' + data.missing + 
					               			'</a>' +
					               			dropdown +
						                 '</div>';
							
	
						$(".tt-menu").off("click", "#" + data.id);
						$(".tt-menu").on("click", "#" + data.id, function() {
							if (data.missing == "") {
								for (var i = 0; i < warsaMarkers.length; i++) {
									if (warsaMarkers[i].id == data.id) {
										history.pushState(null, null, window.location.pathname + "?uri=" + data.uri);
										var marker = warsaMarkers[i];
										//console.log(marker.uri);
										if (data.polygon == "") {
											queryKtMagazinesOpenIW(marker, false, false);
										} else {
											queryKtMagazinesOpenIW(marker, true, false);
										}
									}
								}
							}
						});
	
						$(".tt-menu").off("click", "#" + data.id + "_inside");
						$(".tt-menu").on("click", "#" + data.id + "_inside", function() {
							//console.log(data.uri);
							queryPlacesInsidePolygon(data.uri);
						});
						return htmlString;
					},
					header: '<h3 class="typeahead-header">'+strings["warsaMunicipalities"]+'</h3>'		
					}
			}	
		
	} 
	
	if (sources["warsa_karelian_places"] == true) {
		warsa_karelian_places = { 
									name: 'warsa_karelian_places',
									displayKey: 'value',
									source: queryKarelianPlaces(),
									limit: 500,
									templates: 
									{
										empty: '<h3 class="typeahead-header">'+strings["karelianPlaces"]+'</h3><div class="empty-message">'+strings["typeaheadEmpty"] + '</div>',
										suggestion: function(data) {
											var dropdown;
											if (warsaMode) {
												dropdown = '';
												
											} else {
												dropdown = '<div class="btn-group pull-right result-button-g">' +
						                   						'<button id="result-dd" type="button" class="btn btn-primary btn-xs dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
						                   							'<span class="glyphicon glyphicon-menu-hamburger" aria-hidden="true"></span>' +
						                   						'</button>' +
						                   						'<ul class="dropdown-menu pull-right">' +
							                   				//      '<li><a id="' + data.id + '" role="button">Focus on map</a></li>' +
							                   						'<li><a href="' + data.uri + '" target="_blank">View/edit in SAHA editor</a></li>' +
							                   			   //       '<li><a id="' + data.id + '_map" role="button">Search historical maps</a></li>' +
						                   						'</ul>';
														   '</div>';   	
											}
											
											var htmlString ='<div class="row" data-preflabel="'+data.value+'" data-lat="'+data.lat+'" data-long="'+data.long+'" data-id="'+data.id+'" data-uri="'+data.uri+'" data-query="'+data.query+'"  data-type="'+data.type+'" data-municipality_iw="'+data.municipality_iw+'">' +
															'<a id="'+ data.id +'" class="result-text pull-left" role="button">' +
												    				data.value + ' (' + data.type + data.municipality + ')' +
										               			'</a>' +
												               	 dropdown +       
											                 '</div>';
								
							
											$(".tt-menu").off("click", "#" + data.id);
											$(".tt-menu").on("click", "#" + data.id, function() {
//												if (data.missing == "") {
													for (var i = 0; i < karelianMarkers.length; i++) {
														if (karelianMarkers[i].id == data.id) {							
															history.pushState(null, null, window.location.pathname + "?uri=" + data.uri);
															var marker = karelianMarkers[i];
															queryKtMagazinesOpenIW(marker, false, false);
														}
													}
//												}
											});
											return htmlString;										
										},
										header: '<h3 class="typeahead-header">' + strings["karelianPlaces"] + '</h3>'		
									}
								}
	}

	if (sources["sapo"] == true) {
		sapo = { 
					name: 'sapo',
					displayKey: 'value',
					source: querySapo(),
					limit: 500,
					templates: 
					{
						empty: '<h3 class="typeahead-header">Finnish Spatio-Temporal Ontology (SAPO)</h3><div class="empty-message">'+strings["typeaheadEmpty"] + '</div>',
						suggestion: function(data) {
							
							if (warsaMode) {
								dropdown = '';
								
							} else {
								dropdown = '<div class="btn-group pull-right result-button-g">' +
		                   						'<button id="result-dd" type="button" class="btn btn-primary btn-xs dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
		                   							'<span class="glyphicon glyphicon-menu-hamburger" aria-hidden="true"></span>' +
		                   						'</button>' +
		                   						'<ul class="dropdown-menu pull-right">' +
			                   				//      '<li><a id="' + data.id + '" role="button">Focus on map</a></li>' +
			                   						'<li><a href="' + data.uri + '" target="_blank">View/edit in SAHA editor</a></li>' +
			                   			   //       '<li><a id="' + data.id + '_map" role="button">Search historical maps</a></li>' +
		                   						'</ul>';
										   '</div>';   	
							}
							
							var htmlString ='<div class="row" data-preflabel="'+data.value+'" data-polygon="'+data.polygon+'" data-id="'+data.id+'" data-uri="'+data.uri+'" data-query="'+data.query+'">' +
												'<a id="'+ data.id +'" class="result-text pull-left" role="button">' +
								    				data.value + ' ' + data.missing + 
						               			'</a>' +
						               			dropdown + 
							                 '</div>';
				
							$(".tt-menu").on("click", "#" + data.id, function() {
								if (data.missing == "") {
									for (var i = 0; i < sapoMarkers.length; i++) {
										if (sapoMarkers[i].id == data.id) {
											history.pushState(null, null, window.location.pathname + "?uri=" + data.uri);
											var marker = sapoMarkers[i];
											var polygonBounds = marker.getBounds();
											//map.fitBounds(polygonBounds);
											info_window.setContent(marker.content);	
											info_window.setPosition(polygonBounds.getCenter());
									  		info_window.open(map,marker);
											//map.panToBounds(warsaMarkers[i].getBounds())
											
										}
									}
								}
							});
							return htmlString;										
						},
						header: '<h3 class="typeahead-header">Finnish Spatio-Temporal Ontology (SAPO)</h3>'		
						}
				}
	}
	
	if (sources["suggested_places"] == true) {
		suggested_places = { 
								name: 'suggested_places',
								displayKey: 'value',
								source: querySuggestedPlaces(),
								limit: 500,
								templates: {
									empty: '<h3 class="typeahead-header">Suggested place names</h3><div class="empty-message">'+strings["typeaheadEmpty"] + '</div>',
									suggestion: function(data) {
										
										if (warsaMode) {
											dropdown = '';
											
										} else {
											dropdown = '<div class="btn-group pull-right result-button-g">' +
					                   						'<button id="result-dd" type="button" class="btn btn-primary btn-xs dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
					                   							'<span class="glyphicon glyphicon-menu-hamburger" aria-hidden="true"></span>' +
					                   						'</button>' +
					                   						'<ul class="dropdown-menu pull-right">' +
						                   				//      '<li><a id="' + data.id + '" role="button">Focus on map</a></li>' +
						                   						'<li><a href="' + data.uri + '" target="_blank">View/edit in SAHA editor</a></li>' +
						                   			   //       '<li><a id="' + data.id + '_map" role="button">Search historical maps</a></li>' +
					                   						'</ul>';
													   '</div>';   	
										}
										
										
										
										var htmlString ='<div class="row" data-preflabel="'+data.value+'" data-lat="'+data.lat+'" data-long="'+data.long+'" data-id="'+data.id+'" data-uri="'+data.uri+'" data-query="'+data.query+'">' +
															'<a id="'+ data.id +'" class="result-text pull-left" role="button">' +
											    				data.value +
									               			'</a>' +
											               	dropdown +  
										                 '</div>';
							
										$(".tt-menu").off("click", "#" + data.id);
										
										$(".tt-menu").on("click", "#" + data.id, function() {
											for (var i = 0; i < suggestedMarkers.length; i++) {
												if (suggestedMarkers[i].id == data.id) {							
													history.pushState(null, null, window.location.pathname + "?uri=" + data.uri);
													var marker = suggestedMarkers[i];
													//map.panTo(marker.getPosition());
													//map.setZoom(12);
													info_window.setContent(marker.content);	
											  		info_window.open(map,marker);
												}
											}
										});
										return htmlString;										
									},
									header: '<h3 class="typeahead-header">Suggested place names</h3>'
									} 
							}
	}
	

	if (sources["pnr"] == true) {
		pnr = { 
									name: 'pnr',
									displayKey: 'value',
									source: queryPNR(),
									limit: 500,
									templates: 
									{
										empty: '<h3 class="typeahead-header">'+strings["pnr"]+'</h3><div class="empty-message">'+strings["typeaheadEmpty"] + '</div>',
										suggestion: function(data) {
											var dropdown;
											if (warsaMode) {
												dropdown = '';
												
											} else {
												dropdown = '<div class="btn-group pull-right result-button-g">' +
						                   						'<button id="result-dd" type="button" class="btn btn-primary btn-xs dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
						                   							'<span class="glyphicon glyphicon-menu-hamburger" aria-hidden="true"></span>' +
						                   						'</button>' +
						                   						'<ul class="dropdown-menu pull-right">' +
							                   				//      '<li><a id="' + data.id + '" role="button">Focus on map</a></li>' +
							                   						'<li><a href="' + data.uri + '" target="_blank">View/edit in SAHA editor</a></li>' +
							                   			   //       '<li><a id="' + data.id + '_map" role="button">Search historical maps</a></li>' +
						                   						'</ul>';
														   '</div>';   	
											}
											
							
											var htmlString ='<div class="row" data-preflabel="'+data.value+'" data-lat="'+data.lat+'" data-long="'+data.long+'" data-id="'+data.id+'" data-uri="'+data.uri+'" data-query="'+data.query+'" data-type="'+data.type+'" data-municipality="'+data.municipality+'">' +
																'<a id="'+ data.id +'" class="result-text pull-left" role="button">' +
												    				data.value + ' (' + data.type + ', ' + data.municipality + ')' +
										               			'</a>' +
										               			dropdown +
											                 '</div>';
								
											$(".tt-menu").on("click", "#" + data.id, function() {
												for (var i = 0; i < pnrMarkers.length; i++) {
													if (pnrMarkers[i].id == data.id) {							
														history.pushState(null, null, window.location.pathname + "?uri=" + data.uri);
														var marker = pnrMarkers[i];
														queryKtMagazinesOpenIW(marker, false, false);
													}
												}
											});
											
											return htmlString;										
										},
										header: '<h3 class="typeahead-header">'+strings["pnr"]+'</h3>'		
									}
								}
	}
	
	$('.typeahead').typeahead({
		hint: false,
		highlight: true,
		minLength: 2 }, 	
		warsa_municipalities,
		warsa_karelian_places,
		pnr,
		sapo,
		suggested_places
	)
	// Keep tt-menu always open
	.on('typeahead:beforeclose', function(ev) { 
		ev.preventDefault(); 
	})	
	.on("typeahead:render", function(ev, suggestion, async, dataset) {
//Functionality for updating the map in HIPLA when suggestions have been rendered
//		if (!mapSpinner)  {
//			var target = document.getElementById('map-wrapper');
//			mapSpinnerInstance.spin(target);
//			mapSpinner = true;
//		}
//		
//		
//		// When suggestions are rendered for the first time, start the timer
//		if (renderCount == 0) {
//			//$("#instructions").hide(); 
//			timer();
//		}	
//		
//		// Everytime suggestions for some dataset are rendered, start the timer from the beginning
//		if (counter != 0) {
//			counter = 0;
//		}
//		
//		renderCount += 1;
//		if (renderCount % 10 == 0) {
//			//$('#search-input').addClass("loading-results");
//			// When suggestions for 5 datasets are rendered, the map can be updated
//			canUpdate = true;
//			
//		} 
	})
	.on("typeahead:asyncrequest", function(ev, query, dataset) {
		//$(".spinner").css("visibility", "visible");
		//console.log("typeahead:asyncrequest " + query + dataset);
	})
	.on("typeahead:asyncreceive", function(ev, query, dataset) {
		//console.log("typeahead:asyncreceive " + query + dataset);
		$(".tt-selectable").removeClass("tt-selectable");
	})
	.on("typeahead:asynccancel", function(ev, query, dataset) {
		cancelled = true;
		//karelianAjaxRequest.abort();
		//console.debug(ev);
		//console.debug(karelianAjaxRequest.getResponseHeader());
		//console.log("typeahead:canceled " + ev + " " + query + " " +  dataset);
		//clearTimer();
	})
	.on("typeahead:select", function(ev, suggestion) {
		ev.preventDefault(); 
	})
	.on("typeahead:open", function(ev, suggestion) {
		//$("#instructions").hide(); 
	})
} 

function resetTypeahead() {
	var theVal = $('.typeahead').val();
	$('.typeahead').typeahead('destroy');
	initTypeahead();	
	$(".typeahead").focus().typeahead('val',theVal).focus();
}

function queryWarsaMunicipalities(disabled) {

	if (disabled == "disabled" ) {
		return function (query, syncResults, asyncResults) {
			var matches = new Array();
			asyncResults(matches);
		}
		
	} else {
	
		return function (query, syncResults, asyncResults) {		
			
			var linkFilter = "";
			if (searchOnlyPlacesWithLinks) {
				linkFilter =  "FILTER(EXISTS { ?picture <http://purl.org/dc/terms/spatial> ?s . } " +
				"		|| EXISTS { ?event 	crm:P7_took_place_at ?s . } " +
				"		|| EXISTS {  ?magazine articles:place ?kataPlace ." +
				"			?kataPlace skos:relatedMatch ?s . } )";
				
			}
			
			var latLong;
			
			if (warsaMode) {
				latLong = "?s wgs84:lat ?lat ;" +
				"		 wgs84:long ?long . ";	
				
			} else {
				latLong = "OPTIONAL { ?s wgs84:lat ?lat ;" +
				"		 wgs84:long ?long . } ";	
			}
			
			
			
			//q = q.replace(/\(/g, "\\\("); // FIXME: does not work
			var sparqlEndpointURL = "http://ldf.fi/warsa/sparql";
			var sparqlQuery = "PREFIX skos: <http://www.w3.org/2004/02/skos/core#> "+
						"PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> "+
						"PREFIX text: <http://jena.apache.org/text#> "+
						"PREFIX hipla: <http://ldf.fi/schema/hipla/> " +
						"PREFIX suo: <http://www.yso.fi/onto/suo/> "+
						"PREFIX gs: <http://www.opengis.net/ont/geosparql#> " +
						"PREFIX spatial: <http://jena.apache.org/spatial#> " + 
						"PREFIX crm: <http://www.cidoc-crm.org/cidoc-crm/> " +
						"PREFIX articles: <http://ldf.fi/warsa/articles/article/>" +
						"PREFIX wgs84: <http://www.w3.org/2003/01/geo/wgs84_pos#>" +
						"SELECT * "+
						"WHERE {"+
						"	GRAPH <http://ldf.fi/warsa/places/municipalities> {"+
						//"		?s spatial:intersectBox (" + jenaBbox + " 100000) ." +
						"		?s"+
						"	   		a suo:kunta ;"+
						"	   		skos:prefLabel ?prefLabel ;"+
						" 	   		gs:sfWithin ?l ." +
						"		?l skos:prefLabel ?laani ." +
						latLong +		
						"		OPTIONAL { ?s <http://schema.org/polygon> ?polygon .}  " +
						//"	 	?s <http://schema.org/polygon> ?polygon . " +
						"		FILTER ( regex(str(?prefLabel), '^"+query+".*$' ,'i') )"+
						"	}" +
						linkFilter + 
						"} "+
						"ORDER BY ?prefLabel "+
						"LIMIT 100"+
						"";
			karelianAjaxRequest =  $.ajax({
				url: sparqlEndpointURL, 
				data: {
					query: sparqlQuery
				},
				dataType: 'json',
				success: function(data) {
					var bindings = data.results.bindings;
					//console.log(bindings);
					//console.log(query);
					var matches = new Array();
					if (bindings.length > 0) {
						for (var i=0; i<bindings.length; i++) {
							
							var miss = "";
							var polygon = ""
							var lat = "";
							var long = "";
							var id = bindings[i].s.value.replace("http://ldf.fi/warsa/places/municipalities/", "");   
							
							if ( bindings[i].lat === undefined) {
								miss = strings["typeaheadMissingCoordinates"];
							} else {
								lat = bindings[i].lat.value;
								long = bindings[i].long.value;
							}
							
							if ( bindings[i].polygon === undefined) {
								//miss = "[polygon missing]";
								
							} else {
								polygon = bindings[i].polygon.value;
							}
				
							matches.push({ value: bindings[i].prefLabel.value,
										   uri: bindings[i].s.value,
										   laani: bindings[i].laani.value,
										   laaniURI : bindings[i].l.value,
										   missing: miss,
										   polygon: polygon,
										   lat: lat,
										   long: long,
										   id: id
										   });
						}				
					}
					asyncResults(matches);
					
				}
			});
			
		}
	}
}

function queryKarelianPlaces(disabled) {
	
	if (disabled == "disabled" ) {
		return function (query, syncResults, asyncResults) {
			var matches = new Array();
			asyncResults(matches);
		}
		
	} else {
	
		return function (query, syncResults, asyncResults) {
			
			var linkFilter = "";
			if (searchOnlyPlacesWithLinks) {
				linkFilter =  "FILTER(EXISTS { ?picture <http://purl.org/dc/terms/spatial> ?s . } " +
				"		|| EXISTS { ?event 	crm:P7_took_place_at ?s . } " +
				"		|| EXISTS {  ?magazine articles:place ?kataPlace ." +
				"			?kataPlace skos:relatedMatch ?s . } )";
				
			}
				
			
			var sparqlEndpointURL = "http://ldf.fi/warsa/sparql";
			var sparqlQuery = "PREFIX skos: <http://www.w3.org/2004/02/skos/core#> "+
						"PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> "+
						"PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> "+
						"PREFIX text: <http://jena.apache.org/text#> "+
						"PREFIX hipla: <http://ldf.fi/schema/hipla/> " +
						"PREFIX suo: <http://www.yso.fi/onto/suo/> "+
						"PREFIX gs: <http://www.opengis.net/ont/geosparql#> " +
						"PREFIX text: <http://jena.apache.org/text#> " + 
						"PREFIX wgs84: <http://www.w3.org/2003/01/geo/wgs84_pos#>" +
						"PREFIX spatial: <http://jena.apache.org/spatial#> " + 
						"PREFIX crm: <http://www.cidoc-crm.org/cidoc-crm/> " +
						"PREFIX articles: <http://ldf.fi/warsa/articles/article/>" +
						"SELECT DISTINCT * "+
						"WHERE {"+
						"GRAPH <http://ldf.fi/warsa/places/karelian_places> { " + 
	
						"   ?s text:query (skos:prefLabel '" + query + "*') ;" + 	
						"	   skos:prefLabel ?prefLabel . " +
						// Using regex to filter out out-dated index matches   
						"	FILTER ( regex(str(?prefLabel), '^"+query+".*$' ,'i') )" +
					
					//	"	?s spatial:intersectBox (" + jenaBbox + " 100000) ." +
					
						"   ?s a ?type ." + 	
						"OPTIONAL { ?s wgs84:lat ?lat ;" +
						"			   wgs84:long ?long . " +
						"}" +
						"GRAPH <http://ldf.fi/warsa/places/place_types> { " +
							"OPTIONAL { ?type skos:prefLabel ?tlabel . } " +
						"}" +
						"OPTIONAL { ?s gs:sfWithin ?municipality . " +
								 	  "GRAPH <http://ldf.fi/warsa/places/municipalities> { " +
								 	  	"OPTIONAL {  ?municipality skos:prefLabel ?municipality_label . }" + 
								 	   "}" +
						"		  }" +	
						"} "+
						linkFilter + 
						"} "+
						"ORDER BY ?prefLabel "+
						"LIMIT 100";
			
			//console.log(sparqlQuery);
			
			karelianAjaxRequest = $.ajax({
				url: sparqlEndpointURL, 
				data: {
					query: sparqlQuery
				},
				dataType: 'json',
				success: function(data) {
					//setTimeout(queryKarelianPlaces, 10000);
					var bindings = data.results.bindings;
					//console.log(bindings);
					var matches = new Array();
		
					if (bindings.length > 0) {
						for (var i=0; i<bindings.length; i++) {
		
//							var binding = bindings[i];
//							addMarker(binding, karelianMarkers);
							var mun;
							var mun_iw;
							var type;
					
							if (bindings[i].municipality_label === undefined) {
								mun = "";
								mun_iw = strings["infoMissing"];
							} else {
								mun = ", " + bindings[i].municipality_label.value;
								mun_iw = bindings[i].municipality_label.value;
							}
							
							if (bindings[i].tlabel === undefined) {
								type = "no place type";
							} else {
								type = bindings[i].tlabel.value;
							}
							//console.log(results[i].tlabel);
							
							var id = bindings[i].s.value.replace("http://ldf.fi/warsa/places/karelian_places/", "");   
							
							matches.push({ value: bindings[i].prefLabel.value,
										   uri: bindings[i].s.value,
										   type: type,
										   municipality: mun,
										   municipality_iw: mun_iw,
										   id: id,
										   lat: bindings[i].lat.value,
										   long: bindings[i].long.value, 
										   query: query
										   });
						}				
					}
					asyncResults(matches);
				}
			});
			
		}
	}
}

function querySapo(disabled) {
	
	if (disabled == "disabled" ) {
		return function (query, syncResults, asyncResults) {
			var matches = new Array();
			asyncResults(matches);
		}
		
	} else {
	
		return function (query, syncResults, asyncResults) {
			//q = q.replace(/\(/g, "\\\("); // FIXME: does not work
			var sparqlEndpointURL = "http://ldf.fi/hipla/sparql";
			var sparqlQuery = "PREFIX skos: <http://www.w3.org/2004/02/skos/core#> "+
						"PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> "+
						"PREFIX text: <http://jena.apache.org/text#> "+
						"PREFIX sapometa: <http://paikannimet.fi/meta/sapo#> "+ 
						"PREFIX suo: <http://www.yso.fi/onto/suo/> "+
						"PREFIX sapo: <http://www.yso.fi/onto/sapo/> "+
						"SELECT * "+
						"FROM <http://www.yso.fi/onto/sapo> "+
						"WHERE {"+
						"	?s"+
						"	   a suo:kunta ;"+
						"	   rdfs:label ?prefLabel ."+
						
						"FILTER ( regex(str(?prefLabel), '^"+query+".*$' ,'i') )"+
						"OPTIONAL { ?s <http://www.yso.fi/onto/sapo/hasPolygon> ?polygon ." +
						"FILTER NOT EXISTS { " +
						"	?s sapo:hasPolygon ?polygon2 .  " +
						"	FILTER(  " +
						"		strlen(?polygon) < strlen(?polygon2) ||  " +
						"		(strlen(?polygon) = strlen(?polygon2) && ?polygon < ?polygon2)  " +
						"	)  " +
						"}  " +
						"}  " +
						//"	   text:query (rdfs:label '" + query + "*') . " +
						//"	FILTER ( regex(str(?match), '^"+q+".*$' ,'i') )"+
						
						//"	FILTER ( langMatches(lang(?prefLabel), lang(?match)) )"+
						
						
						"} "+
						"ORDER BY ?prefLabel "+
						"";
			//console.log(query);
			$.ajax({
				url: sparqlEndpointURL, 
				data: {
					query: sparqlQuery
				},
				dataType: 'json',
				success: function(data) {
					var bindings = data.results.bindings;
					
					var matches = new Array();
					if (bindings.length > 0) {
						for (var i=0; i<bindings.length; i++) {
						
							var miss = "";
							var id = bindings[i].s.value.replace("http://www.yso.fi/onto/sapo/", "");   
							id = id.replace(/["'()]/g, "_");
							var polygon = "";
						
							//console.log(id);
							
							if ( bindings[i].polygon === undefined) {
								miss = "[coordinates missing]";
							} else {
								polygon = bindings[i].polygon.value;
								//addPolygon(polygon, bindings[i].prefLabel.value, id, sapoMarkers);
							}
				
							matches.push({ value: bindings[i].prefLabel.value,
										   uri: bindings[i].s.value,
										   missing: miss,
										   id: id,
										   polygon: polygon
										});
						}				
					}
					asyncResults(matches);
		
				}
			});
			
		}
	}
}

function querySuggestedPlaces(disabled) {
	
	if (disabled == "disabled" ) {
		return function (query, syncResults, asyncResults) {
			var matches = new Array();
			asyncResults(matches);
		}
		
	} else {
	
		return function (query, syncResults, asyncResults) {
			
			var sparqlEndpointURL = "http://ldf.fi/demo/sparql";
			var query = "PREFIX skos: <http://www.w3.org/2004/02/skos/core#> " +
						"PREFIX wgs84: <http://www.w3.org/2003/01/geo/wgs84_pos#>" +
						"SELECT * "+
						"FROM <http://ldf.fi/demo/hipla-suggestions> "+
						"WHERE {"+
						"	?s"+
						"	   skos:prefLabel ?prefLabel ;"+
						"	   wgs84:lat ?lat ;" +
						"	   wgs84:long ?long . " +
						"	FILTER ( regex(str(?prefLabel), '^"+query+".*$' ,'i') )"+
						"} "+
						"ORDER BY ?prefLabel "+
						"LIMIT 50"+
						"";
			//console.log(query);
			$.ajax({
				url: sparqlEndpointURL, 
				data: {
					query: query
				},
				dataType: 'json',
				success: function(data) {
					var bindings = data.results.bindings;
					var matches = new Array();
					if (bindings.length > 0) {
						for (var i=0; i<bindings.length; i++) {
							//var binding = bindings[i];
							//var marker = addMarker(binding, suggestedMarkers);
							//console.log(bindings);
							var id = bindings[i].s.value.replace("http://ldf.fi/demo/hipla-suggestions/", "");
							var lat = bindings[i].lat.value;
							var long = bindings[i].long.value;
							
							matches.push({ value: bindings[i].prefLabel.value,
										   uri: bindings[i].s.value,
										   id: id,
										   lat: lat,
										   long: long,
										   query: query
										});
						}				
					}
					
					asyncResults(matches);
				}
			});
		}
	}
} 

function queryPNR(disabled) {
	
	if (disabled == "disabled" ) {
		return function (query, syncResults, asyncResults) {
			var matches = new Array();
			asyncResults(matches);
		}
		
	} else {

		return function (query, syncResults, asyncResults) {
			
			var linkFilter = "";
			if (searchOnlyPlacesWithLinks) {
			
			linkFilter = 	 "	SERVICE <http://ldf.fi/warsa/sparql> { " +	
							 "		FILTER( EXISTS {?event crm:P7_took_place_at ?s } ) . " +
						   //"		?event crm:P7_took_place_at|(articles:place/skos:relatedMatch) ?pnrPlace . " +
							 " 	} ";
			}
			
			var sparqlEndpointURL = "http://ldf.fi/pnr/sparql";
			var sparqlQuery = "PREFIX skos: <http://www.w3.org/2004/02/skos/core#> "+
						"PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> "+
						"PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> "+
						"PREFIX text: <http://jena.apache.org/text#> "+
						"PREFIX hipla: <http://ldf.fi/schema/hipla/> " +
						"PREFIX suo: <http://www.yso.fi/onto/suo/> "+
						"PREFIX gs: <http://www.opengis.net/ont/geosparql#> " +
						"PREFIX text: <http://jena.apache.org/text#> " + 
						"PREFIX wgs84: <http://www.w3.org/2003/01/geo/wgs84_pos#>" +
						"PREFIX spatial: <http://jena.apache.org/spatial#> " + 
						"PREFIX crm: <http://www.cidoc-crm.org/cidoc-crm/> " +
						"PREFIX articles: <http://ldf.fi/warsa/articles/article/> " +
						"SELECT DISTINCT * "+
						"WHERE {"+
						//"	?s spatial:intersectBox (" + jenaBbox + " 100000) ." +
						"	?s text:query (skos:prefLabel '" + query + "*') ;" + 	
						"	   skos:prefLabel ?prefLabel . " +
						// Using regex to filter out out-dated index matches   
						"	FILTER ( regex(str(?prefLabel), '^"+query+".*$' ,'i') )" +
						"	FILTER (LANGMATCHES(LANG(?prefLabel), 'fi'))" +
						linkFilter +
						"   ?s a ?type ;" + 	
						"	   wgs84:lat ?lat ;" +
						"	   wgs84:long ?long . " +
						"	?type skos:prefLabel ?tlabel . " +
						"	FILTER (LANGMATCHES(LANG(?tlabel), 'fi'))" +
						"	OPTIONAL { 	?s <http://www.cidoc-crm.org/cidoc-crm/P89_falls_within> ?municipality . " +
						"				?municipality skos:prefLabel ?municipality_label ." + 
						"				FILTER (LANGMATCHES(LANG(?municipality_label), 'fi'))" +
						"			 }" +
						"} "+
						"ORDER BY ?prefLabel "+
						"LIMIT 100";
			
			//console.log(sparqlQuery);
			
			$.ajax({
				url: sparqlEndpointURL, 
				data: {
					query: sparqlQuery
				},
				dataType: 'json',
				success: function(data) {
					var bindings = data.results.bindings;
					//console.debug(bindings);
					var matches = new Array();
					if (bindings.length > 0) {
						for (var i=0; i<bindings.length; i++) {
							//var binding = bindings[i];
							//var marker = addMarker(binding, pnrMarkers);
							
							var mun;
							var type;
							var lat;
							var long;
							
							if (bindings[i].municipality_label === undefined) {
								mun = "";
							} else {
								mun = bindings[i].municipality_label.value;
							}
							
							if (bindings[i].tlabel === undefined) {
								type = "no place type";
							} else {
								type = bindings[i].tlabel.value;
							}
							
							if (bindings[i].lat === undefined) {
								lat = "";
							} else {
								lat = bindings[i].lat.value;
							}
							
							if (bindings[i].long === undefined) {
								long = "";
							} else {
								long = bindings[i].long.value;
							}
							
							var id = bindings[i].s.value.replace("http://ldf.fi/pnr/", "");   
							
							matches.push({ value: bindings[i].prefLabel.value,
										   uri: bindings[i].s.value,
										   type: type,
										   municipality: mun,
										   id: id,
										   lat: lat,
										   long: long,
										   query: query
										   });
						}				
					}
					asyncResults(matches);
				}
			});
			
		}
	}
}

function initCheckboxes() {
	$('#check-warsa').change(function() {
		if ( $(this).prop("checked") ) {
			sources["warsa_municipalities"] = true;		
		} else {
			sources["warsa_municipalities"] = false;
		}
		resetTypeahead();
	});
	
	$('#check-karelian').change(function() {
		if ( $(this).prop("checked") ) {
			sources["warsa_karelian_places"] = true;
		} else {
			sources["warsa_karelian_places"] = false;
		}
		resetTypeahead();
	});
	
	$('#check-karelian-20000').change(function() {
		if ( $(this).prop("checked") ) {
			sources["warsa_karelian_places_20000"] = true;
		} else {
			sources["warsa_karelian_places_20000"] = false;
		}
		resetTypeahead();
	});
	
	$('#check-karelian-100000').change(function() {
		if ( $(this).prop("checked") ) {
			sources["warsa_karelian_places_100000"] = true;
		} else {
			sources["warsa_karelian_places_100000"] = false;
		}
		resetTypeahead();
	});
	
	
	$('#check-sapo').change(function() {
		if ( $(this).prop("checked") ) {
			sources["sapo"] = true;
		} else {
			sources["sapo"] = false;
		}
		resetTypeahead();
	});

	$('#check-suggested').change(function() {
		if ( $(this).prop("checked") ) {
			sources["suggested_places"] = true;
		} else {
			sources["suggested_places"] = false;
		}
		resetTypeahead();

	});
	
	$('#check-pnr').change(function() {
		if ( $(this).prop("checked") ) {
			sources["pnr"] = true;
			
		} else {
			sources["pnr"] = false;
		}
		resetTypeahead();
	});
	
//	$('#check-tgn').change(function() {
//		if ( $(this).prop("checked") ) {
//			sources["tgn"] = true;
//			
//		} else {
//			sources["tgn"] = false;
//		}
//		resetTypeahead();
//	});
	
}
