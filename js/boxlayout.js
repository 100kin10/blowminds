/**
 * boxlayout.js v1.0.0
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Copyright 2013, Codrops
 * http://www.codrops.com
 */



var Boxlayout = (function() {

	var $el = $( '#bl-main' ),
		$sections = $el.children( 'section' ),
		// works section
		$sectionWork = $( '#bl-work-section' ),
		// work items
		$workItems = $( '#bl-work-items > li' ),
		// work panels
		$workPanelsContainer = $( '#bl-panel-work-items' ),
		$workPanels = $workPanelsContainer.children( 'div' ),
		totalWorkPanels = $workPanels.length,
		// navigating the work panels
		$nextWorkItem = $workPanelsContainer.find( 'nav > span.bl-next-work' ),
		// if currently navigating the work items
		isAnimating = false,
		// close work panel trigger
		$closeWorkItem = $workPanelsContainer.find( 'nav > span.bl-icon-close' ),
		transEndEventNames = {
			'WebkitTransition' : 'webkitTransitionEnd',
			'MozTransition' : 'transitionend',
			'OTransition' : 'oTransitionEnd',
			'msTransition' : 'MSTransitionEnd',
			'transition' : 'transitionend'
		},
		// transition end event name
		transEndEventName = transEndEventNames[ Modernizr.prefixed( 'transition' ) ],
		// support css transitions
		supportTransitions = Modernizr.csstransitions;

	function init() {
		initEvents();	
		fixPlaceholders();	
	}
	
	
	// detect if it is mobile
	if (navigator.userAgent.match(/(iPhone|iPod|Android|BlackBerry)/)) {
		$isMobile = true;
		$('html').addClass('mobile-device');
	} else {
		$isMobile = false;
		$('html').addClass('not-mobile-device');
	};

	// cross browser alternative to console.log
	function debug(text) {
	    if ((typeof(Debug) !== 'undefined') && Debug.writeln) {
	        Debug.writeln(text);
	    }
	    if (window.console && window.console.log) {
	        window.console.log(text);
	    }
	    if (window.opera) {
	        window.opera.postError(text);
	    }
	    if (window.debugService) {
	        window.debugService.trace(text);
	    }
	}
	
	function fixPlaceholders() {
		
		$('#mce-EMAIL').val('Your Email Here');

	    $('#mce-EMAIL').focus(function() {
	        if (!$(this).data('originalValue')) {
	            $(this).data('originalValue', $(this).val());
	        }
	        if ($(this).val() == $(this).data('originalValue')) {
	            $(this).val('');
	        }
	    }).blur(function(){
	        if ($(this).val() == '') {
	            $(this).val($(this).data('originalValue'));
	        }
	    });
	}
	

	function initEvents() {
		heightControl();
		$sections.each( function() {
			
			var $section = $( this );

			// expand the clicked section and scale down the others
			$section.on( 'click', function() {

				if( !$section.data( 'open' ) ) {
					$section.data( 'open', true ).addClass( 'bl-expand bl-expand-top' );
					$el.addClass( 'bl-expand-item' );	
				}
				
				$('body').addClass('sectionOpen');

			} ).find( 'span.bl-icon-close' ).on( 'click', function() {
				
				// close the expanded section and scale up the others
				$section.data( 'open', false ).removeClass( 'bl-expand' ).on( transEndEventName, function( event ) {
					if( !$( event.target ).is( 'section' ) ) return false;
					$( this ).off( transEndEventName ).removeClass( 'bl-expand-top' );
		
				} );

				if( !supportTransitions ) {
					$section.removeClass( 'bl-expand-top' );
				}

				$el.removeClass( 'bl-expand-item' );
				$('body').removeClass('sectionOpen');
				
				return false;

			} );

		} );

		// clicking on a work item: the current section scales down and the respective work panel slides up
		$workItems.on( 'click', function( event ) {
			$('body').addClass('workOpen');
			// scale down main section
			$sectionWork.addClass( 'bl-scale-down' );

			// show panel for this work item
			$workPanelsContainer.addClass( 'bl-panel-items-show' );

			var $panel = $workPanelsContainer.find("[data-panel='" + $( this ).data( 'panel' ) + "']");
			currentWorkPanel = $panel.index();
			$panel.addClass( 'bl-show-work' );

			return false;

		} );

		// navigating the work items: current work panel scales down and the next work panel slides up
		$nextWorkItem.on( 'click', function( event ) {
			navigate('next');
		} );

		// clicking the work panels close button: the current work panel slides down and the section scales up again
		$closeWorkItem.on( 'click', function( event ) {

			// scale up main section
			$sectionWork.removeClass( 'bl-scale-down' );
			$workPanelsContainer.removeClass( 'bl-panel-items-show' );
			$workPanels.eq( currentWorkPanel ).removeClass( 'bl-show-work' );
			$('body').removeClass('workOpen');
			
			return false;

		} );
		
		// clicking the work panels close button: the current work panel slides down and the section scales up again
		$('.intro-close-icon').on( 'click', function( event ) {

			$('#intro-panel').removeClass('bl-show-work');
			$('body').removeClass('introOpen');
			$('#intro-panel').delay(400).fadeOut(400); 
			
			return false;

		} );
		
		$('.outro-close-icon').on( 'click', function( event ) {
			$('#outro-panel').removeClass('outroOpen');
			return false;
		} );
		
		$('.boo-close-icon').on( 'click', function( event ) {
			$('#boo-panel').removeClass('booOpen');
			return false;
		} );
		
		$('.boo-trigger').on( 'click', function( event ) {
			$('#boo-panel').addClass('booOpen');
			return false;
		} );
		
		
		$('#intro-panel').on('click', function(event) {
			$('#intro-panel').removeClass('bl-show-work');
			$('body').removeClass('introOpen');
			return false;
		});
		
		$('#boo-panel').on('click', function(event) {
			$('#boo-panel').removeClass('booOpen');
			return false;
		});
		
		
		
		$(document).keyup(function(e) {
			
		  if (e.keyCode == 27) { 
				
				
				if ($('body').hasClass('introOpen')) {
					
					$('#intro-panel').removeClass('bl-show-work');
					$('body').removeClass('introOpen');
					
				} else if ($('body').hasClass('workOpen')) {
					// scale up main section
					$sectionWork.removeClass( 'bl-scale-down' );
					$workPanelsContainer.removeClass( 'bl-panel-items-show' );
					$workPanels.eq( currentWorkPanel ).removeClass( 'bl-show-work' );
					$('body').removeClass('workOpen');
				} else if ($('body').hasClass('sectionOpen')){
					$section = $('section.bl-expand-top');
					// close the expanded section and scale up the others
					$section.data( 'open', false ).removeClass( 'bl-expand' ).on( transEndEventName, function( event ) {
						if( !$( event.target ).is( 'section' ) ) return false;
						$( this ).off( transEndEventName ).removeClass( 'bl-expand-top' );
					} );

					if( !supportTransitions ) {
						$section.removeClass( 'bl-expand-top' );
					}

					$el.removeClass( 'bl-expand-item' );
					$('body').removeClass('sectionOpen');
				} 
				
				window.event.returnValue = false; 
				window.event.cancelBubble = true;
			
				//	$('.bl-icon-close').click();
			} else if (e.keyCode == 39) {
				navigate('next');
				
			} else if (e.keyCode == 37) {
				navigate('prev');
			} else if (e.keyCode == 32) {
				if ($('#outro-panel').hasClass('outroOpen')) {
						$('#outro-panel').removeClass('outroOpen');
				} else {
						$('#outro-panel').addClass('outroOpen');
				}
				
			}
		});

	}
	
	$(window).resize(function(event) {
		heightControl();
	});
	
	function heightControl() {
		var quarterHeight = $('.bl-box').height() *.75;
		$('.bl-box img').css('max-height', quarterHeight);		
	}
	
	
	
	function navigate(dir) {
		if ($('body').hasClass('workOpen')) {
			
			if( isAnimating ) {
				return false;
			}
			isAnimating = true;			

			var $currentPanel = $workPanels.eq( currentWorkPanel );
			if (dir = 'prev') {
			currentWorkPanel = currentWorkPanel > 0 ? currentWorkPanel - 1 : totalWorkPanels - 1;	
			} else if (dir = 'next'){
				currentWorkPanel = currentWorkPanel < totalWorkPanels - 1 ? currentWorkPanel + 1 : 0;
			}
			
			var $nextPanel = $workPanels.eq( currentWorkPanel );

			$currentPanel.removeClass( 'bl-show-work' ).addClass( 'bl-hide-current-work' ).on( transEndEventName, function( event ) {
				if( !$( event.target ).is( 'div' ) ) return false;
				$( this ).off( transEndEventName ).removeClass( 'bl-hide-current-work' );
				isAnimating = false;
			} );

			if( !supportTransitions ) {
				$currentPanel.removeClass( 'bl-hide-current-work' );
				isAnimating = false;
			}
	
			$nextPanel.addClass( 'bl-show-work' );

			return false;
			
		} 
		
	
	}
	

	

	return { init : init };

})();