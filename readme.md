# Federated SPARQL Search Widget

Based on typeahead.jquery.js 0.11.1 with multiple source datasets (SPARQL endpoints).

Using jQuery 1.11.3 and Bootstrap v3.3.4 (included from a CDN) for styling the typeahead menu and dropdowns.

## How to use the widget

1. Copy the following files into some web location:

    ```
    sparql-widget.js
    sparql-widget.css
    ````

2. Add the following script and link elements into your web page:

   jQuery:

    ```html
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script> <!-- or use some other version you prefer -->
    ```
    
   SPARQL widget library:

    ```html
    <link rel="stylesheet" href="[PATH_TO_THE_CSS_FILE]/sparql-widget.css">
    <script src="[PATH_TO_THE_JS_FILE]/sparql-widget.js"></script>
    ```

3. The location of the widget is defined by adding a div element with class "sparql-widget" into the desired part of the page:

    ```html
    <div class="sparql-widget"></div>
    ```

4. The widget is configured by defining a JavaScript object as a variable "sparql_widget_config" that has the following structure:

    ```
    sources:
     source_1:
      title: short title of the dataset
      title-long: long title of the dataset
      endpoint: SPARQL endpoint URL
      disabled: boolean (default: false), set to true if the source should not be used by default
      query: a SPARQL SELECT query with following variables:
       ?s: URI of the item (required)
       ?prefLabel: preferred label of the item (required)
       ?typeLabel: label of the item's type (optional)
       ?hierarchyLabel: label of item's hierarchical information (optional)
       "QUERY": the query should contain the string "QUERY", which will be replaced with the actual query string once user types in a string
     ...
     source_n:
     ...
    callback: function(data, dataset): your own function that processes a search result that user selects (the callback functions can also be configured on a per-source basis)
    ```

See example.html for an example.
