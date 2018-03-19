$(function(){
  
  // Keep a mapping of url-to-container for caching purposes.
  // var cache = {
  //   // If url is '' (no fragment), display this div's content.
  //   '': $('.bbq-default')
  // };
  var cache = {};
  
  // Bind an event to window.onhashchange that, when the history state changes,
  // gets the url from the hash and displays either our cached content or fetches
  // new content to be displayed.
  $(window).bind( 'hashchange', function(e) {
    
    // Get the hash (fragment) as a string, with any leading # removed. Note that
    // in jQuery 1.4, you should use e.fragment instead of $.param.fragment().
    var url = $.param.fragment();
    
    // Remove .bbq-current class from any previously "current" link(s).
    //$( 'a.bbq-current' ).removeClass( 'bbq-current' );
    
    // Hide any visible ajax content.
    //$( '.bbq-content' ).children( ':visible' ).hide();
    $( '.bbq-content' ).html('');
    
    // Add .bbq-current class to "current" nav link(s), only if url isn't empty.
    //url && $( 'a[href="#' + url + '"]' ).addClass( 'bbq-current' );
    if (url == -'') {location.hash = "home.html"}


    if ( cache[ url ] ) {
      // Since the element is already in the cache, it doesn't need to be
      // created, so instead of creating it again, let's just show it!
      cache[ url ].show();
      
    } else {
      // Show "loading" content while AJAX content loads.
      $( '.bbq-loading' ).show();
      
      // Create container for this url's content and store a reference to it in
      // the cache.
      $( '<div class="bbq-item"/>' )
        
        // Append the content container to the parent container.
        .appendTo( '.bbq-content' )
        
        // Load external content via AJAX. Note that in order to keep this
        // example streamlined, only the content in .infobox is shown. You'll
        // want to change this based on your needs.
        .load( url, function(){
          // Content loaded, hide "loading" content.
          $( '.bbq-loading' ).hide();
        });
    }
  })
  
  // Since the event is only triggered when the hash changes, we need to trigger
  // the event now, to handle the hash the page may have loaded with.
  $(window).trigger( 'hashchange' );


  //Build Main Navigatino Dynamically
  $.get( "menu.json", function(data) {
    buildNavigation(data);
  });
 
  
});

function buildNavigation(menu){
  var navHtml = '<ul class="sidebar-menu tree" data-widget="tree">';

  for (var i = 0; i < menu.length; i++) {
    if (menu[i].children) {
      var item = menu[i];
      navHtml += '<li class="treeview">';
      navHtml += '<a href="' + item.link + '">';
      navHtml += '<i class="fa ' + item.icon + '"></i>';
      navHtml += '<span>' + item.name + '</span>';
      navHtml += '<span class="pull-right-container"><i class="fa fa-angle-left pull-right"></i></span></a>';
      navHtml += '<ul class="treeview-menu">';
      for(var j = 0; j < menu[i].children.length; j++){
        var child = menu[i].children[j];
        if (child.children) {
          navHtml += '<li class="treeview">';
        }else{          
          navHtml += '<li>';
        }
        navHtml += '<a href="' + child.link + '">';
        navHtml += '<i class="fa fa-circle-o"></i>';
        navHtml += child.name;

        if (child.children) {navHtml += '<span class="pull-right-container"><i class="fa fa-angle-left pull-right"></i></span>'; }
        navHtml += '</a>';
        if (child.children) {navHtml = addChildMenuItem(navHtml, child)}
        navHtml += '</li>';
      }
      navHtml += '</ul>'; 

    } else {      
      var item = menu[i];
      navHtml += '<li>';      
      navHtml += '<a href="' + item.link + '">';
      navHtml += '<i class="fa ' + item.icon + '"></i>';
      navHtml += '<span>' + item.name + '</span>';
      navHtml += "</a>";
      navHtml += "</li>";
    }
    navHtml += '</li>'; 
  }  
  navHtml += '</ul>'; 
  $('.sidebar').html(navHtml);

  $('.main-sidebar').on('click', 'a', function () {
    if ($(this).attr('href') !== '#') {
      $('.main-sidebar li').removeClass('active');
      $(this).parent().addClass('active');
    }
  })
}

function addChildMenuItem(navHtml, node)
{

    navHtml += '<ul class="treeview-menu">';
    for (var i = 0; i < node.children.length; i++)
    {
        var item = node.children[i];
        if (item.children)
        {
            navHtml += '<li class="treeview">';
        }
        else
        {
            navHtml += '<li>';
        }
        navHtml += '<a href="' + item.link + '">';
        navHtml += '<i class="fa fa-circle-o"></i>';
        navHtml += item.name;
        if (item.children)
        {
            navHtml += '<span class="pull-right-container"><i class="fa fa-angle-left pull-right"></i></span>';
        }
        navHtml += '</a>';
        if (item.children)
        {
            navHtml = addChildMenuItem(navHtml, item)
        }
        navHtml += '</li>';
    }
    
    navHtml += '</ul>';
    return navHtml;
}
