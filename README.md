Template Engine bases in requireJS to render html templates asociated with a javascript file

Requeriments:
-------------
It use **require.js** (https://github.com/requirejs) and **text.requireJS** (https://github.com/requirejs/text) plugin to load templates files. If you don't want use it, you can load templates embebed into your code.

Description:
-------------
tplEng is an template engine based in javascript. It use requireJS library to load templates, but its not mandatory.
tplEng uses <% %> to replace values of variables into the template.
It uses {{ }} to load templates into templates. This feature needs requireJS library.

It has 3 main methods:
* **applyHTMLTpl** receives a HTML template and its parameters and returns the HTML output with params parsed and replaced.
* **applyTplIntoDOM** receives a HTML template, its parameters and a DOM identifier. Inserts the HTML output with the params parsed and replaced into the DOM element of identifier receive
* **loadTpl** receives a template file name, a DOM identifier, and parameters. It loads, using requireJS, the HTML template file and inserts the HTML output with the params parsed and replaced into the DOM element of identifier receive

_____________

applyHTMLTpl:
-------------
Receives a JSON argument with this structure:
* **html**: the HTML code with the parameters into <% %>.
* **[params]**: json object with pairs key:value
* **[callback]**: a javascript existing function that it is called when the template has been renderized

Its mandatory use "this" in every parameter into template. Ej: &lt;h1&gt;<%this.name%>&lt;/h1&gt;

_____________

applyTplIntoDOM:
----------------
Receives a JSON argument with this structure:
* **domid**: the DOM identifier where insert the HTML renderized.
* **html**: the HTML code with the parameters into <% %>.
* **[params]**: json object with pairs key:value
* **[callback]**: a javascript existing function that it is called when the template has been renderized

_____________

loadTpl:
--------
Receives a JSON argument with this structure:
* **tplname**: exitsing template file name into ./tpl directory
* **domid**: the DOM identifier where insert the HTML renderized. 
* **[params]**: json object with pairs key:value
* **[callback]**: a javascript existing function that it is called when the template has been renderized

_____________

Examples:
--------------

```javascript
    var jte = new TplEng();
    var htmlTpl = "<h1><%this.title%></h1><div>Lore Ipsum...</div>";
    var params = { title: "My Title" };
    var callback = function() { console.log( "My template was renderized" );
    var output = jte.applyHTMLTpl( htmlTpl, params );
```

This returns into the *output* variable: 
```html
<h1>My Title</h1>
<div>Lore Ipsum...</div>
```

And show by console: "My template was renderized"
