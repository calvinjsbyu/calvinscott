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
			gradientBg = $(".header-gradient-bg"),
			yOffset = 0,
			triggerPoint = 80;
		$(window).on( 'scroll', function() {
			yOffset = $(window).scrollTop();

			if (yOffset >= triggerPoint) {
				header.addClass("navbar-fixed-top");
				gradientBg.addClass("fade-out");
			} else {
				header.removeClass("navbar-fixed-top");
				gradientBg.removeClass("fade-out");
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
    Portfolio Modal
=========================================================================*/
var modalItems = [];
var currentIndex = 0;
var portfolioTriggers = [];
var currentPortfolioIndex = 0;

// Helper function to parse item (supports "path|caption" format)
function parseItem(item) {
    item = item.trim();
    var parts = item.split('|');
    return {
        path: parts[0].trim(),
        caption: parts[1] ? parts[1].trim() : null
    };
}

// Helper function to get media content HTML
function getMediaContent(item) {
    var parsed = parseItem(item);
    var path = parsed.path;
    var caption = parsed.caption;

    if (path.startsWith('youtube:')) {
        var videoId = path.replace('youtube:', '');
        return '<iframe src="https://www.youtube.com/embed/' + videoId + '" frameborder="0" allowfullscreen></iframe>';
    }

    if (path.startsWith('soundcloud:')) {
        var trackPath = path.replace('soundcloud:', '');
        return '<iframe width="100%" height="100%" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/' + trackPath + '&color=%23ff5500&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=true"></iframe>';
    }

    // Regular image with optional caption overlay
    var html = '<img src="' + path + '" alt="Project" onload="positionCaption(this)">';
    if (caption) {
        html += '<div class="image-caption">' + caption + '</div>';
    }
    return html;
}

// Position caption to align with actual image bottom
function positionCaption(img) {
    var $img = $(img);
    var $caption = $img.siblings('.image-caption');
    if (!$caption.length) return;

    var container = $img.parent()[0];
    var containerHeight = container.offsetHeight;
    var containerWidth = container.offsetWidth;

    // Calculate rendered image size (object-fit: contain)
    var imgRatio = img.naturalWidth / img.naturalHeight;
    var containerRatio = containerWidth / containerHeight;

    var renderedHeight, offsetBottom;

    if (imgRatio > containerRatio) {
        // Image is wider - height is constrained
        renderedHeight = containerWidth / imgRatio;
        offsetBottom = (containerHeight - renderedHeight) / 2;
    } else {
        // Image is taller - fills height
        renderedHeight = containerHeight;
        offsetBottom = 0;
    }

    $caption.css('bottom', offsetBottom + 'px');
}

// Reposition caption on window resize
$(window).on('resize', function() {
    var $img = $('.modal-main-image img');
    if ($img.length && $img[0].complete) {
        positionCaption($img[0]);
    }
});

// Update main image display
function updateModalContent() {
    $('.modal-main-image').html(getMediaContent(modalItems[currentIndex]));
}

// Slide to new content with animation
var isAnimating = false;
function slideToContent(direction) {
    if (isAnimating) return;
    isAnimating = true;

    var $mainImage = $('.modal-main-image');
    var slideOutClass = direction === 'next' ? 'slide-out-left' : 'slide-out-right';
    var slideInClass = direction === 'next' ? 'slide-out-right' : 'slide-out-left';

    // Slide out current content
    $mainImage.addClass(slideOutClass);

    // Update index
    if (direction === 'next') {
        currentIndex++;
        if (currentIndex >= modalItems.length) {
            currentIndex = 0;
        }
    } else {
        currentIndex--;
        if (currentIndex < 0) {
            currentIndex = modalItems.length - 1;
        }
    }

    // Swap content partway through the slide-out, so new image slides in while old slides out
    setTimeout(function() {
        $mainImage.html(getMediaContent(modalItems[currentIndex]));
        $mainImage.removeClass(slideOutClass);
        $mainImage.addClass(slideInClass);

        // Force reflow
        $mainImage[0].offsetHeight;

        // Slide in the new content
        $mainImage.removeClass('slide-out-left slide-out-right');

        setTimeout(function() {
            isAnimating = false;
        }, 300);
    }, 50);
}

// Collect all portfolio triggers on page load
$(function() {
    portfolioTriggers = $('.portfolio-trigger').toArray();
});

// Function to load a portfolio item by index
function loadPortfolioItem(index) {
    var $trigger = $(portfolioTriggers[index]);

    modalItems = $trigger.data('images').split(',');
    currentIndex = 0;
    var title = $trigger.data('title') || 'Project Title';
    var category = $trigger.data('category') || 'Category';
    var description = $trigger.data('description') || 'Project description.';

    // Set main content (first item)
    updateModalContent();

    // Set text
    $('.modal-title').text(title);
    $('.modal-category').text(category);
    $('.modal-description').text(description);
}

// Open modal
$('.portfolio-trigger').on('click', function(e) {
    e.preventDefault();

    // Find which portfolio item was clicked
    currentPortfolioIndex = portfolioTriggers.indexOf(this);

    loadPortfolioItem(currentPortfolioIndex);

    // Show modal
    $('#portfolio-modal').addClass('active');
});

// Previous arrow
$(document).on('click', '.modal-prev', function(e) {
    e.stopPropagation();
    slideToContent('prev');
});

// Next arrow
$(document).on('click', '.modal-next', function(e) {
    e.stopPropagation();
    slideToContent('next');
});

// Outer previous arrow - switch to previous portfolio item
$(document).on('click', '.modal-outer-prev', function(e) {
    e.stopPropagation();
    currentPortfolioIndex--;
    if (currentPortfolioIndex < 0) {
        currentPortfolioIndex = portfolioTriggers.length - 1;
    }
    loadPortfolioItem(currentPortfolioIndex);
});

// Outer next arrow - switch to next portfolio item
$(document).on('click', '.modal-outer-next', function(e) {
    e.stopPropagation();
    currentPortfolioIndex++;
    if (currentPortfolioIndex >= portfolioTriggers.length) {
        currentPortfolioIndex = 0;
    }
    loadPortfolioItem(currentPortfolioIndex);
});

// Close modal
$(document).on('click', '.portfolio-modal-close, .portfolio-modal-overlay', function() {
    $('#portfolio-modal').removeClass('active');
    // Stop any playing media
    $('.modal-main-image').html('');
});

// Close on ESC key, arrow keys for navigation
$(document).on('keydown', function(e) {
    if (!$('#portfolio-modal').hasClass('active')) return;

    if (e.key === 'Escape') {
        $('#portfolio-modal').removeClass('active');
        $('.modal-main-image').html('');
    } else if (e.key === 'ArrowLeft') {
        $('.modal-prev').click();
    } else if (e.key === 'ArrowRight') {
        $('.modal-next').click();
    }
});

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
