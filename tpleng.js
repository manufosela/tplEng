/* Template Engine by @manufosela - 2015 */
/* Methods: 
  applyHTMLTpl( html, params )
  applyTplIntoDOM( domID, tplGroup, otherparams )
  loadTpl( String nameTpl, String domId, Bool nocache )
  searchTpl( String html )
  include( path, callback )
*/

TplEng = (function (){

  TplEng = function ( args ){
    args = args || {};
    this.path = args.path || "./";
    this.popup = new Popup() || false;
    this.pathjs = this.path + args.pathjs;
    this.pathtpl = this.path + args.pathtpl;
  };

  TplEng.prototype.applyHTMLTpl = function( objArgs ) {
    var html = objArgs.html || "<!-- ARG HTML EMPTY -->",
        params = objArgs.params || {},
        callback = objArgs.callback || function(){},
        re1 = /<%([^%>]+)?%>/g,
        re2 = /(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g,
        strev = 'var h=[];\n', 
        cursor = 0,
        add = function( line, js ) {
          if ( js ) {
            strev += line.match( re2 ) ? line + '\n' : 'h.push( ' + line + ' );\n';
          } else {
            strev += line !== '' ? 'h.push( "' + line.replace( /"/g, '\\"' ) + '" );\n' : '';
          }
          return add;
        };
    while( !!( match = re1.exec( html ) ) ) {
      add( html.slice( cursor, match.index ) )( match[1], true );
      cursor = match.index + match[0].length;
    }
    add( html.substr( cursor, html.length - cursor ) );
    strev += 'return h.join( "" );';
    var htmlResult = ( new Function( strev.replace( /[\r\t\n]/g, '' ).replace( /[\s\s]/g, ' ' ) ).apply( params ) );
    callback( htmlResult );
    return htmlResult;
  };
  TplEng.prototype.applyTplIntoDOM = function( objArgs ) {
    var domID = objArgs.domid || null,
        html = objArgs.html || "<!-- ARG HTML EMPTY -->",
        params = objArgs.params || {},
        nocache = objArgs.nocache || false,
        callback = objArgs.callback || function(){},
        _this = this;
      this.applyHTMLTpl( { html:html, params:params, callback: function( result ){
          var doc = document.getElementById( domID );
          if ( doc !== null ) {
            doc.innerHTML = result; 
            _this.searchTpl( { html:result, domid:domID, nocache:nocache } );
            callback();
          } else {
            if ( _this.debug ) { console.error( "domid " + domID + " no encontrado" ); }
          }
        }
      });
  };
  TplEng.prototype.loadTpl = function( objArgs ) { 
    if ( typeof objArgs.tplname != "undefined" && typeof objArgs.domid != "undefined" ) {
      //document.getElementById( objArgs.domid ).innerHTML = "<style type='text/css'>@keyframes rotateSpinnerPopup { 0% { transform: perspective(120px) rotateX(0deg) rotateY(0deg); } 50% { transform: perspective(120px) rotateX(-180deg) rotateY(0deg); } 100% { transform: perspective(120px) rotateX(-180deg) rotateY(-180deg); } } @keyframes backgroundSpinnerPopup { 0% { background-color: #F60; } 50% { background-color: #000; } 100% { background-color: #FFF; } }</style><div>Cargando...</div><div style='text-align: center; margin: 10px auto; width: 60px; height: 60px; animation: rotateSpinnerPopup 1.4s infinite ease-in-out, backgroundSpinnerPopup 1.4s infinite ease-in-out alternate;'></div>";
      var layer = ( objArgs.domid !== null)?document.getElementById( objArgs.domid ):null;
      if ( layer !== null ) { layer.innerHTML = "Cargando..."; }
      var tplname = objArgs.tplname,
          domid = objArgs.domid,
          params = objArgs.params || {},
          nocache = objArgs.nocache || false,
          callback = objArgs.callback || function(){},
          _this = this, 
          includeCallback2 = function(){ 
            //var sc =$(document.createElement('script')).attr("type","text/javascript").text( js ),
            var layer = ( domid !== null )?document.getElementById( domid ):null;
            callback();
            if ( layer !== null ) { 
              //$( "#"+domid ).append( sc ); 
              layer.style.display = 'block'; 
            }
          },
          includeCallback = function( html ){
            _this.applyTplIntoDOM( { domid: domid, html:html, params:params } );  
            _this.include( _this.pathjs + tplname+'.js?'+nocacheStr, includeCallback2 );
          };
      nocacheStr = ( nocache === true )?"?"+new Date().getTime():"";
      //document.getElementById( domid ).style.display = 'none';
      this.include( this.pathtpl + tplname+'.html'+nocacheStr, includeCallback );
    } else {
      if ( console ) { console.error( "Error in loadTpl arguments" ); }
    }
  };
  TplEng.prototype.searchTpl = function( objArgs ) {
    var html = objArgs.html,
        domid = objArgs.domid,
        nocache = objArgs.nocache,
        nocacheStr = ( nocache === true )?"?"+new Date().getTime():"",
        regexp = /\{\{\!(\w*)\}\}/g, match, s, n, t,
        _this=this,
        includeCallback = function( h ) {
          t = document.getElementById( domid ).innerHTML;
          document.getElementById( domid ).innerHTML = t.replace( s, h );
          include( _this.pathjs + n + '.js'+nocacheStr );
        };
    while( !!( match = regexp.exec( html ) ) ) {
      s = match[0]; n = match[1];
      this.include( _this.pathtpl + n + '.html'+nocacheStr, includeCallback );
    }
  };
  TplEng.prototype.include = function( path, callback ) {
    callback = callback || function() { };
    var url = document.location.protocol+"//"+document.location.host+path,
        request,
        type = ( !!~url.split( "?" )[0].split( "#" )[0].search(/.js$/) )?"script":"text";
    if ( path.length > 0 ) {    
      request = $.ajax({
        dataType: type,
        url: url,
        data:{}
      }).complete(function ( data ) {
        var resp = data.responseText;
        callback( resp, type );
      });
    } else {
      return { code:1, msg:"<h3>ERROR LOADING INCLUDE<h3>" };
    }
    return { code:0,msg:"PROCESSING" };
  };

  return TplEng;

})();
