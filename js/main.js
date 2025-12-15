/* Olio Theme Scripts */

(function($){ "use strict";
             
    $(window).on('load', function() {
        $('body').addClass('loaded');
    });

             
/*=========================================================================
	Sticky Header
=========================================================================*/ 
	$(function() {
		var header = $("#header"),
			yOffset = 0,
			triggerPoint = 80;
		$(window).on( 'scroll', function() {
			yOffset = $(window).scrollTop();

			if (yOffset >= triggerPoint) {
				header.addClass("navbar-fixed-top");
			} else {
				header.removeClass("navbar-fixed-top");
			}

		});
	});

/*=========================================================================
        textrotator
=========================================================================*/
    $(".rotate").textrotator({
      animation: "flipUp", // You can pick the way it animates when rotating through words. Options are dissolve (default), fade, flip, flipUp, flipCube, flipCubeUp and spin.
      separator: ",", // If you don't want commas to be the separator, you can define a new separator (|, &, * etc.) by yourself using this field.
      speed: 2000 // How many milliseconds until the next word show.
    }); 

/*=========================================================================
        Mobile Menu
=========================================================================*/  
    $('.menu-wrap ul.nav').slicknav({
        prependTo: '.header-section .navbar',
        label: '',
        allowParentLinks: true
    });
             
/*=========================================================================
        Active venobox
=========================================================================*/
	$('.img-popup').venobox({
		numeratio: true,
		infinigall: true
	});              
                          
             
/*=========================================================================
	Initialize smoothscroll plugin
=========================================================================*/
	smoothScroll.init({
		offset: 60
	});
	 
/*=========================================================================
	Scroll To Top
=========================================================================*/ 
    $(window).on( 'scroll', function () {
        if ($(this).scrollTop() > 100) {
            $('#scroll-to-top').fadeIn();
        } else {
            $('#scroll-to-top').fadeOut();
        }
    });

/*=========================================================================
	WOW Active
=========================================================================*/
   new WOW().init();

/*=========================================================================
	YouTube Video Background
=========================================================================*/
    if ($("#video-bg").length) {
        $("#video-bg").YTPlayer();
        // Remove placeholder background image after YTPlayer initializes
        setTimeout(function() {
            $('body').css('background-image', 'none');
            $('.mbYTP_wrapper').css('background-image', 'none');
            $('.inline_YTPlayer').css('background-image', 'none');
        }, 100);
    }

/*=========================================================================
    Spotlight Effect
=========================================================================*/
(function() {
    var heroSection = document.getElementById('home');

    if (heroSection) {
        function updateSpotlightSize() {
            var pageWidth = window.innerWidth;
            var circleRadius = pageWidth / 9;  // 1/9 of page width
            var featherRadius = circleRadius * 4;  // 4x the circle radius

            heroSection.style.setProperty('--spotlight-circle', circleRadius + 'px');
            heroSection.style.setProperty('--spotlight-feather', featherRadius + 'px');
        }

        // Set initial size
        updateSpotlightSize();

        // Update on window resize
        window.addEventListener('resize', updateSpotlightSize);

        // Listen on document to capture mouse even when over header
        document.addEventListener('mousemove', function(e) {
            var rect = heroSection.getBoundingClientRect();
            var x = e.clientX - rect.left;
            var y = e.clientY - rect.top;

            // Check if mouse is within hero section bounds
            if (e.clientX >= rect.left && e.clientX <= rect.right &&
                e.clientY >= rect.top && e.clientY <= rect.bottom) {
                // Update CSS custom properties on the hero section
                heroSection.style.setProperty('--mouse-x', x + 'px');
                heroSection.style.setProperty('--mouse-y', y + 'px');
            } else {
                // Move spotlight off-screen when mouse leaves hero bounds
                heroSection.style.setProperty('--mouse-x', '-9999px');
                heroSection.style.setProperty('--mouse-y', '-9999px');
            }
        });
    }
})();

/*=========================================================================
    Google Map Settings
=========================================================================*/
    if (typeof google !== 'undefined' && google.maps) {
        google.maps.event.addDomListener(window, 'load', init);
    }

    function init() {

        var mapOptions = {
            zoom: 11,
            center: new google.maps.LatLng(40.6700, -73.9400), 
            scrollwheel: false,
            navigationControl: false,
            mapTypeControl: false,
            scaleControl: false,
            draggable: false,
            styles: [{"featureType":"administrative","elementType":"all","stylers":[{"saturation":"-100"}]},{"featureType":"administrative.province","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"landscape","elementType":"all","stylers":[{"saturation":-100},{"lightness":65},{"visibility":"on"}]},{"featureType":"poi","elementType":"all","stylers":[{"saturation":-100},{"lightness":"50"},{"visibility":"simplified"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":"-100"}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"all","stylers":[{"lightness":"30"}]},{"featureType":"road.local","elementType":"all","stylers":[{"lightness":"40"}]},{"featureType":"transit","elementType":"all","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"water","elementType":"geometry","stylers":[{"hue":"#ffff00"},{"lightness":-25},{"saturation":-97}]},{"featureType":"water","elementType":"labels","stylers":[{"lightness":-25},{"saturation":-100}]}]
        };

        var mapElement = document.getElementById('google-map');

        var map = new google.maps.Map(mapElement, mapOptions);

        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(40.6700, -73.9400),
            map: map,
            title: 'Location!'
        });
    }     


})(jQuery);
