/* 
    Created on : 11-Sep-2014, 8:03:12 PM
    Author     : Konstantin Koton
*/


$(document).ready(function() {
    var $panel = $("main article");
    $("#navigation li").first().addClass("selected");
    $("#navigation li").click(function() {
        var $this = $(this);
        var $previous = $this.siblings().filter(".selected");
        var timeout = 2000;
        
        hidePanel($previous, $panel, timeout);
        setTimeout(function() {
            $this.addClass("selected");
            $previous.removeClass("selected");
            showPannel($this, $panel, timeout);
        }, timeout*1.1);
    });
});

function hidePanel($nav, $panel, timeout) {
    var navTop = $nav.offset().top;
    var navBottom = $nav.outerHeight() + navTop;
    var navLeft = $nav.offset().left;
    var navWidth = $nav.outerWidth();
    
    var panelTop = $panel.offset().top;
    var panelBottom = $panel.outerHeight() + panelTop;
    var panelLeft = $panel.offset().left;
    var panelWidth = $panel.outerWidth();
    
//    $panel.css({ position: "absolute" });
    var $animatedPanel = $panel.clone().appendTo("body");
    $animatedPanel.css({
        position: "absolute",
        top: panelTop,
        bottom: panelBottom,
        left: panelLeft,
/*        right: panelRight, */
        width: panelWidth,
        margin: "0",
        "border-radius": "8px"
    });

    $panel.hide();
    
    $animatedPanel.animate({
        top: navTop,
        bottom: navBottom,
        height: (navBottom - navTop)
    }, timeout/2)/*.css("border-radius", "8px")*/.animate({
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

function showPannel($nav, $panel, timeout) {
    var navTop = $nav.offset().top;
    var navBottom = $nav.outerHeight() + navTop;
    var navLeft = $nav.offset().left;
    var navWidth = $nav.outerWidth();
    
    $panel.show();
    var panelTop = $panel.offset().top;
    var panelBottom = $panel.outerHeight() + panelTop;
    var panelLeft = $panel.offset().left;
    var panelWidth = $panel.outerWidth();
    
//    $panel.css({ position: "absolute" });
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
    }, timeout/2)/*.css("border-radius", "16px")*/.animate({
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



