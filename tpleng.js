/* Template Engine by @manufosela - 2015 */
/* Methods: 
  applyHTMLTpl( html, params )
  applyTplIntoDOM( domID, tplGroup, otherparams )
  loadTpl( String nameTpl, String domId, Bool nocache )
  searchTpl( String html )
*/

TplEng = (function (){

  TplEng = function ( args ){
    args = args || {};
    this.path = args.path || "./";
    this.popup = new Popup() || false;
    require.config( { 
      paths:{ 
        path: this.path,
        templatePath: this.path 
      } 
    });
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
    while( match = re1.exec( html ) ) {
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
        _this = this;
      this.applyHTMLTpl( { html:html, params:params, callback: function( result ){
          var doc = document.getElementById( domID );
          if ( doc !== null ) {
            doc.innerHTML = result; 
            _this.searchTpl( { html:result, domid:domID, nocache:nocache } );
          } else {
            if ( _this.debug ) { console.error( "domid " + domID + " no encontrado" ); }
          }
        }
      });
  };
  TplEng.prototype.loadTpl = function( objArgs ) { 
    if ( require && typeof objArgs.tplname != "undefined" && typeof objArgs.domid != "undefined" ) {
      //document.getElementById( objArgs.domid ).innerHTML = "<style type='text/css'>@keyframes rotateSpinnerPopup { 0% { transform: perspective(120px) rotateX(0deg) rotateY(0deg); } 50% { transform: perspective(120px) rotateX(-180deg) rotateY(0deg); } 100% { transform: perspective(120px) rotateX(-180deg) rotateY(-180deg); } } @keyframes backgroundSpinnerPopup { 0% { background-color: #F60; } 50% { background-color: #000; } 100% { background-color: #FFF; } }</style><div>Cargando...</div><div style='text-align: center; margin: 10px auto; width: 60px; height: 60px; animation: rotateSpinnerPopup 1.4s infinite ease-in-out, backgroundSpinnerPopup 1.4s infinite ease-in-out alternate;'></div>";
      var layer = ( objArgs.domid !== null)?document.getElementById( objArgs.domid ):null;
      if ( layer !== null ) { layer.innerHTML = "Cargando..."; }
      var tplname = objArgs.tplname,
          domid = objArgs.domid,
          params = objArgs.params || {},
          nocache = objArgs.nocache || false,
          callback = objArgs.callback || function(){},
          _this = this, 
          requireError = function( err ){ console.warn( err ); },
          requireCallback2 = function(){ 
            callback(); 
            var layer = ( domid !== null )?document.getElementById( domid ):null;
            if ( layer !== null ) { layer.style.display = 'block'; }
          },
          requireCallback = function( html ){
            _this.applyTplIntoDOM( { domid: domid, html:html, params:params } );
            require( ['tpljs/'+tplname+'.js?a=1&'+nocacheStr], requireCallback2, requireError );
          };
      nocacheStr = ( nocache === true )?"?"+new Date().getTime():"";
      //document.getElementById( domid ).style.display = 'none';
      require( ['text!templatePath/tpl/'+tplname+'.html'+nocacheStr], requireCallback, requireError );
    } else {
      if ( console ) { console.error( "RequireJS is not loaded" ); }
    }
  };
  TplEng.prototype.searchTpl = function( objArgs ) {
    var html = objArgs.html,
        domid = objArgs.domid,
        nocache = objArgs.nocache,
        nocacheStr = ( nocache === true )?"?"+new Date().getTime():"",
        regexp = /\{\{\!(\w*)\}\}/g, match, s, n, t,
        requireCallback = function( h ) {
          t = document.getElementById( domid ).innerHTML;
          document.getElementById( domid ).innerHTML = t.replace( s, h );
          require( ['./tpljs/'+n+'.js'+nocacheStr] );
        },
        requireError = function( err ){ console.warn( err ); };
    while( match = regexp.exec( html ) ) {
      s = match[0]; n = match[1];
      require( ['text!tpl/'+n+'.html'+nocacheStr], requireCallback, requireError );
    }
  };

  return TplEng;

})();
