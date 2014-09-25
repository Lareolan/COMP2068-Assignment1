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
    contact: "Content/contact.html",
    privacy: "Legal/privacypolicy.html",
    tos: "Legal/termsofuse.html"
};

var BASE_TITLE = "Konstantin's Portfolio Site";

var mouseTimer = null;

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
        
        if ($previous.length === 0) {
            $this.addClass("selected");
            var $page = $this.data("page");
            var $url = CONTENT_PAGES[$page];
            loadPage($url, $panel);
            showPannel($this, $panel, timeout);
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
    
    $("div.legal li").click(function() {
        var $this = $(this);
        var $page = $this.data("page");
        if ($page !== undefined) {
            var $url = CONTENT_PAGES[$page];
            loadPage($url, $panel);
            $("#navigation li").filter(".selected").removeClass("selected");
        }
    });
    
    $("div.social ul.button.closed").click(function() {
        showSocial(1000);
    });
    
    $("div.social ul.button.closed:not(:animated)").mouseenter(function(){
        mouseTimer = setTimeout(function() {
            showSocial(1000);
        }, 300);
    }).mouseleave(function() {
        clearTimeout(mouseTimer);
    });

    $("div.social ul.button.open:not(:animated)").mouseleave(function() {
        mouseTimer = setTimeout(function() {
            hideSocial(1000);
        }, 500);
    }).mouseenter(function() {
        clearTimeout(mouseTimer);
    });

    $("div.legal ul.button.closed").click(function() {
        showLegal(1000);
    });
    
    $("div.legal ul.button.closed:not(:animated)").mouseenter(function(){
        mouseTimer = setTimeout(function() {
            showLegal(1000);
        }, 300);
    }).mouseleave(function() {
        clearTimeout(mouseTimer);
    });

    $("div.legal ul.button.open:not(:animated)").mouseleave(function() {
        mouseTimer = setTimeout(function() {
            hideLegal(1000);
        }, 500);
    }).mouseenter(function() {
        clearTimeout(mouseTimer);
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

        // Initialize bxSlider plugin if a slider is present on the newly loaded page
        $(".bxslider").bxSlider({
            captions: true,
            auto: true,
            autoHover: true,
            pause: 2000
        });
    });
}

function showSocial(duration) {
    var $socialClosed = $("div.social ul.button.closed");
    var $socialOpen = $("div.social ul.button.open");

    // Clear any queued animations
    $socialOpen.stop(true, true);
    $socialClosed.stop(true, true);
    
    var height = $socialClosed.outerHeight();
    var width = $socialClosed.outerWidth();
    $socialOpen.show();
    var newHeight = $socialOpen.outerHeight();
    var delta = newHeight - height;
    
    $socialOpen.css({
        display: "inline-block",
        position: "absolute",
        top: 0,
        left: 0,
        height: height,
        width: width
    });
    $socialClosed.hide();
    
    $socialOpen.animate({
        top: -delta,
        height: newHeight
    }, duration);
}

function hideSocial(duration) {
    var $socialClosed = $("div.social ul.button.closed");
    var $socialOpen = $("div.social ul.button.open");

    // Clear any queued animations
    $socialOpen.stop(true, true);
    $socialClosed.stop(true, true);
    
    $socialClosed.show();
    var newHeight = $socialClosed.outerHeight();
    
    $socialOpen.animate({
        top: 0,
        height: newHeight
    }, {
        duration: duration,
        complete: function() {
            $socialOpen.removeAttr("style");
            $socialClosed.removeAttr("style");
        }
    });
}

function showLegal(duration) {
    var $legalClosed = $("div.legal ul.button.closed");
    var $legalOpen = $("div.legal ul.button.open");

    // Clear any queued animations
    $legalOpen.stop(true, true);
    $legalClosed.stop(true, true);
    
    var height = $legalClosed.outerHeight();
    var width = $legalClosed.outerWidth();
    $legalOpen.show();
    var newHeight = $legalOpen.outerHeight();
    var delta = newHeight - height;
    
    $legalOpen.css({
        display: "inline-block",
        position: "absolute",
        top: 0,
        left: 0,
        height: height,
        width: width
    });
    $legalClosed.hide();
    
    $legalOpen.animate({
        top: -delta,
        height: newHeight
    }, duration);
}

function hideLegal(duration) {
    var $legalClosed = $("div.legal ul.button.closed");
    var $legalOpen = $("div.legal ul.button.open");

    // Clear any queued animations
    $legalOpen.stop(true, true);
    $legalClosed.stop(true, true);
    
    $legalClosed.show();
    var newHeight = $legalClosed.outerHeight();
    
    $legalOpen.animate({
        top: 0,
        height: newHeight
    }, {
        duration: duration,
        complete: function() {
            $legalOpen.removeAttr("style");
            $legalClosed.removeAttr("style");
        }
    });
}

