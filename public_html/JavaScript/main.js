/* 
    Created on : 11-Sep-2014, 8:03:12 PM
    Author     : Konstantin Koton
*/

var CONTENT_PAGES = {
    home: "Content/welcome.html",
    bio: "Content/biography.html",
    projects: "Content/projects.html",
    services: "Content/services.html",
    repository: "Content/repository.html",
    contact: "Content/contact.html"
};

var BASE_TITLE = "Konstantin's Portfolio Site";

$(document).ready(function() {
    var $panel = $("main > article");
//    $($panel).load("Content/welcome.html");
    loadPage(CONTENT_PAGES.home, $panel);

    // Initialize jScrollPane plugin
    var radius = parseInt($panel.css("border-top-right-radius"));
    $panel.niceScroll({
//        railoffset: { left: 0 },
        cursorwidth: radius*2,
//        cursorfixedheight: 24,
        cursorborderradius: radius*2,
        cursoropacitymax: 0.5,
        cursoropacitymin: 0
    });
    

    $("#navigation li").first().addClass("selected");
    $("#navigation li").click(function() {
        var $this = $(this);
        var $previous = $this.siblings().filter(".selected");
        var timeout = 1000;

        // If the clicked link is active (selected) or disabled then don't proceed to load the page
        if ($this.is(".disabled") || $this.is(".selected")) {
            return;
        }

        $this.siblings().addBack().addClass("disabled");
        hidePanel($previous, $panel, timeout);
        setTimeout(function() {
            $this.addClass("selected");
            $previous.removeClass("selected");
            showPannel($this, $panel, timeout);
        }, timeout*1.1);

        // Pick out the page, determine the URL and load the page as well as change the page's title
        var $page = $this.data("page");
        var $url = CONTENT_PAGES[$page];
        loadPage($url, $panel);
        
        setTimeout(function() {
            $this.siblings().addBack().removeClass("disabled");
        }, timeout*2.1);
    });
});

/*
 * Animate the hiding of the main panel
 */
function hidePanel($nav, $panel, timeout) {
    var navTop = $nav.offset().top;
    var navBottom = $nav.innerHeight() + navTop;
    var navLeft = $nav.offset().left;
    var navWidth = $nav.outerWidth();

    var panelTop = $panel.offset().top;
    var panelBottom = $panel.outerHeight() + panelTop;
    var panelLeft = $panel.offset().left;
    var panelWidth = $panel.outerWidth();

    var $animatedPanel = $panel.clone().appendTo("body");
    $animatedPanel.css({
        position: "absolute",
        top: panelTop,
        bottom: panelBottom,
        left: panelLeft,
        width: panelWidth,
        margin: "0",
        "border-radius": "8px"
    });

    $panel.hide();

    $animatedPanel.animate({
        top: navTop,
        bottom: navBottom,
        height: (navBottom - navTop)
    }, timeout/2).animate({
        left: navLeft,
        width: navWidth
    }, timeout/2);

    setTimeout(function() {
        $animatedPanel.empty();
    }, timeout/2);

    setTimeout(function() {
        $animatedPanel.remove();
    }, timeout);
}

/*
 * Animate the showing of the main panel
 */
function showPannel($nav, $panel, timeout) {
    var navTop = $nav.offset().top;
    var navBottom = $nav.innerHeight() + navTop;
    var navLeft = $nav.offset().left;
    var navWidth = $nav.outerWidth();

    $panel.show();
    var panelTop = $panel.offset().top;
    var panelBottom = $panel.outerHeight() + panelTop;
    var panelLeft = $panel.offset().left;
    var panelWidth = $panel.outerWidth();

    var $animatedPanel = $panel.clone().appendTo("body");
    $panel.hide();

    $animatedPanel.css({
        position: "absolute",
        top: navTop,
        bottom: navBottom,
        left: navLeft,
        width: navWidth,
        height: (navBottom - navTop),
        margin: "0",
        "border-radius": "16px"
    });

    $animatedPanel.animate({
        left: panelLeft,
        width: panelWidth
    }, timeout/2).animate({
        top: panelTop,
        bottom: panelBottom,
        height: (panelBottom - panelTop)
    }, timeout/2);

    setTimeout(function() {
        $animatedPanel.empty();
    }, timeout/2);

    setTimeout(function() {
        $animatedPanel.remove();
        $panel.show();
    }, timeout);
}

function loadPage($url, $container) {
    $.get($url, function(data) {
        var $data = $(data);
        $($container).html($data.filter("section"));
        $(document).find("title").text(BASE_TITLE + " - " + $data.filter("title").text());
    });
}

