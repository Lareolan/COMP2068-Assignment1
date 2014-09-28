/* 
    Filename: main.js
    Author: Konstantin Koton
    Website: Konstantin's Portfolio Site
    Created on : 11-Sep-2014, 8:03:12 PM
    This file contains the primary JavaScript code for the site.
*/

// This JavaScript Object links pageIDs and URLs
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

// This JavaScript Object links pageIDs and breadcrumbs
var BREADCRUMBS = {
    home: "Home",
    bio: "Home/Biography",
    projects: "Home/Projects",
    services: "Home/Services",
    repository: "Home/Repository",
    contact: "Home/Contact",
    privacy: "Home/Privacy Policy",
    tos: "Home/Terms of Use"
};

// This JavaScript Object links breadcrumbs to pageIDs (Used in the getBreadcrumbs() function)
var BREAD_TO_CONTENT = {
    "Home": "home"
};

// Base title for all pages
var BASE_TITLE = "Konstantin's Portfolio Site";

var mouseTimer = null;      // Used for mouseenter/mouseleave timers
var slider = null;          // Holds the bxSlider instance

// This anonymous function gets called by jQuery when the DOM is finished loading and the ready to be manipulated
$(document).ready(function() {
    var $panel = $("main > article");
    loadPage(CONTENT_PAGES.bio, $panel, "home");       // Load the home/welcome page

    // Initialize jScrollPane plugin
    var radius = parseInt($panel.css("border-top-right-radius"));
    $panel.niceScroll({
        cursorwidth: radius*2,
        cursorborderradius: radius*2,
        cursoropacitymax: 0.5,
        cursoropacitymin: 0
    });
    
    // Initialize jQuery placeholder plugin
    $("input, textarea").placeholder();
    
    // Ensure "HOME" link is selected at first load
    $("#navigation li").first().addClass("selected");
    
    // This click handler handles the navigation button clicks
    $("#navigation li").click(function() {
        var $this = $(this);
        var $previous = $this.siblings().filter(".selected");
        var timeout = 1000;

        // If the clicked link is active (selected) or disabled then don't proceed to load the page
        if ($this.is(".disabled") || $this.is(".selected")) {
            return;
        }
        
        // If there is no nav button selected, just load the page, no need to animate hiding the panel
        if ($previous.length === 0) {
            $this.addClass("selected");
            var page = $this.data("page");
            var $url = CONTENT_PAGES[page];
            loadPage($url, $panel, page);
            showPannel($this, $panel, timeout);
            return;
        }

        // Ensure that all the nav links are disabled while animating panel changes
        $this.siblings().addBack().addClass("disabled");
        
        // Hide the panel, then show the panel after a pre-defined amount of time
        hidePanel($previous, $panel, timeout);
        setTimeout(function() {
            $this.addClass("selected");
            $previous.removeClass("selected");
            showPannel($this, $panel, timeout);
        }, timeout*1.1);

        // Pick out the page, determine the URL and load the page as well as change the page's title and animate the panel transition
        var page = $this.data("page");
        var $url = CONTENT_PAGES[page];
        loadPage($url, $panel, page);
        
        // Re-enable the nav buttons once animation finished
        setTimeout(function() {
            $this.siblings().addBack().removeClass("disabled");
        }, timeout*2.1);
    });
    
    // This click handler deals with loading the Legal pages (Terms of Use, and Privacy Policy)
    $("div.legal li").click(function() {
        var $this = $(this);
        var page = $this.data("page");
        if (page !== undefined) {
            var $url = CONTENT_PAGES[page];
            loadPage($url, $panel, page);
            $("#navigation li").filter(".selected").removeClass("selected");
        }
    });
    
    // If user clicks on the "KEEP CONNECTED" button, immediately expand the Social panel
    $("div.social ul.sliding-panel.closed").click(function() {
        showSocial(1000);
    });
    
    // If user's mouse hovers over the "KEEP CONNECTED" button for more than 0.3 seconds, also expand the Social panel.
    // If mouse leaves the button before 0.3 seconds elapsed, just stop the timer.
    $("div.social ul.sliding-panel.closed:not(:animated)").mouseenter(function(){
        mouseTimer = setTimeout(function() {
            showSocial(1000);
        }, 300);
    }).mouseleave(function() {
        clearTimeout(mouseTimer);
    });

    // If user's mouse leaves the expanded Social panel for more than 0.5 seconds, collapse the panel.
    // If mouse re-enters the pannel before 0.5 seconds elapsed, just stop the timer.
    $("div.social ul.sliding-panel.open:not(:animated)").mouseleave(function() {
        mouseTimer = setTimeout(function() {
            hideSocial(1000);
        }, 500);
    }).mouseenter(function() {
        clearTimeout(mouseTimer);
    });

    // If user clicks on the "LEGAL" button, immediately expand the Legal panel
    $("div.legal ul.sliding-panel.closed").click(function() {
        showLegal(1000);
    });
    
    // If user's mouse hovers over the "LEGAL" button for more than 0.3 seconds, also expand the Legal panel.
    // If mouse leaves the button before 0.3 seconds elapsed, just stop the timer.
    $("div.legal ul.sliding-panel.closed:not(:animated)").mouseenter(function(){
        mouseTimer = setTimeout(function() {
            showLegal(1000);
        }, 300);
    }).mouseleave(function() {
        clearTimeout(mouseTimer);
    });

    // If user's mouse leaves the expanded Legal panel for more than 0.5 seconds, collapse the panel.
    // If mouse re-enters the pannel before 0.5 seconds elapsed, just stop the timer.
    $("div.legal ul.sliding-panel.open:not(:animated)").mouseleave(function() {
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
        if (slider) {
            slider.reloadSlider();
        }
    }, timeout);
}

/*
 * This function handles AJAX loading of pages and initializes any jQuery event handlers/plugins for the newly loaded content
 */
function loadPage($url, $container, pageID) {
    $.get($url, function(data) {
        var $data = $(data);
        $container.find(".content").html($data.filter("section").children());
        $(document).find("title").text(BASE_TITLE + " - " + $data.filter("title").text());

        // Initialize bxSlider plugin if a slider is present on the newly loaded page
        var $slider = $container.find(".bxslider");
        if ($slider.length !== 0) {
            slider = $slider.bxSlider({
                captions: true,
                auto: true,
                autoHover: true,
                pause: 2000,
                slideWidth: 500
            });
        }

        // If the page loaded is the contact page, bind the click events for the buttons to reset or send the form data
        var $contactForm = $("form#contact");
        if ($contactForm.length !== 0) {
            $("button#clear").click(function() {
                $contactForm[0].reset();
            });
            $("button#send").click(function(e) {
                e.preventDefault();
                $.post("mail.php", $contactForm.serialize(), function() {
                    $contactForm[0].reset();
                    alert("Your message was successfully sent.");
                });
            });
        }

        // If the page loaded is the welcoming page, bind the click event for the "Call to Action" button
        $("a.call-to-action").click(function(e) {
            e.preventDefault();
            var page = $(this).data("page");
            $("#navigation li").filter("."+page).click();
        });
        
        // Display the breadcrumbs
        $("section.breadcrumbs").html(getBreadcrumbs(pageID));
        
        // Ensure breadcrumbs links work properly
        $("section.breadcrumbs a").click(function(e) {
            e.preventDefault();
            var page = $(this).data("page");
            $("#navigation li").filter("."+page).click();
        });
    });
}

/*
 * This function expands the "KEEP CONNECTED" button into the Social pannel
 */
function showSocial(duration) {
    var $socialClosed = $("div.social ul.sliding-panel.closed");
    var $socialOpen = $("div.social ul.sliding-panel.open");

    // Clear any queued animations
    $socialOpen.stop(true, true);
    $socialClosed.stop(true, true);
    
    var height = $socialClosed.outerHeight();
/*    var width = $socialClosed.outerWidth(); */
    $socialOpen.show();
    var newHeight = $socialOpen.outerHeight();
    var delta = newHeight - height;
    
    $socialOpen.css({
        display: "inline-block",
        position: "absolute",
        top: 0,
        left: 0,
        height: height
/*        width: width */
    });
    $socialClosed.hide();
    
    $socialOpen.animate({
        top: -delta,
        height: newHeight
    }, duration);
}

/*
 * This function collapses the Social pannel into the "KEEP CONNECTED" button
 */
function hideSocial(duration) {
    var $socialClosed = $("div.social ul.sliding-panel.closed");
    var $socialOpen = $("div.social ul.sliding-panel.open");

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

/*
 * This function expands the "LEGAL" button into the Legal pannel
 */
function showLegal(duration) {
    var $legalClosed = $("div.legal ul.sliding-panel.closed");
    var $legalOpen = $("div.legal ul.sliding-panel.open");

    // Clear any queued animations
    $legalOpen.stop(true, true);
    $legalClosed.stop(true, true);
    
    var height = $legalClosed.outerHeight();
/*    var width = $legalClosed.outerWidth(); */
    $legalOpen.show();
    var newHeight = $legalOpen.outerHeight();
    var delta = newHeight - height;
    
    $legalOpen.css({
        display: "inline-block",
        position: "absolute",
        top: 0,
        left: 0,
        height: height
/*        width: width */
    });
    $legalClosed.hide();
    
    $legalOpen.animate({
        top: -delta,
        height: newHeight
    }, duration);
}

/*
 * This function collapses the Social pannel into the "LEGAL" button
 */
function hideLegal(duration) {
    var $legalClosed = $("div.legal ul.sliding-panel.closed");
    var $legalOpen = $("div.legal ul.sliding-panel.open");

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

/*
 * This function parses the breadcrumb data for a page belonging to pageID, creates new DOM elements for the breadcrumb list and returns the new DOM fragment
 */
function getBreadcrumbs(pageID) {
    var $ul, $li, $a;
    var url;
    var crumbs = BREADCRUMBS[pageID].split("/");
    
    $ul = $("<ul />");
    
    for (var i = 0; i < crumbs.length; i++) {
        $li = $("<li />");
        
        if (i !== (crumbs.length-1)) {
            var curPageID = BREAD_TO_CONTENT[crumbs[i]];
            url = CONTENT_PAGES[curPageID];
            $a = $("<a />").attr({ href: url, "data-page": curPageID }).text(crumbs[i]);
            $li.append($a);

            $a = $("<a />").html(" &gt; ");
            $li.append($a);
        } else {
            $li.text(crumbs[i]);
        }
        $ul.append($li);
    }
    return $ul;
}