(function( $ ) {

  // Public: Sweet Checkbox. Plugin for wrapping standard html checkboxes
  // and make them look nice without interfere with the native behavior.
  //
  // v 0.0.1
  //
  // Examples:
  //   Just define an input in your html and then call the sweetCheckbox
  //   function on it. $('#myInput').sweetCheckbox();
  //
  // API:
  //   - init
  //   - destroy
  //
  // Options
  //   - width: Width for the component
  //   - height: Height for the component
  //   - fontSize: Size of the text inside the checkbox
  //   - offText: Text displayed when the component is unchecked
  //   - onText: Text displayed when the component is checked
  //   - wrapperClass: Set a class for the main wrapper of the checkbox
  //   - inputClass: Set a class for the input itself
  //   - size: If provided use one of the defaults sizes [small | medium | large]
  $.fn.sweetCheckbox = function(method) {

     // Method calling logic
    if ( methods[method] ) {
      return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + ' does not exist on jQuery.sweetCheckbox' );
    }
  };

  // Private: List of data attributes used by this plugin.
  var dataHelper = {
    names: {
      namespace: 'sweetCheckbox',
      settings: 'sc-settings',
      originalPosition: 'sc-original-position',
      originalVisibility: 'sc-original-visibility'
    },

    // Private: Extract the settings from the data attr.
    settings: function($input) {
      return $input.data(this.names.namespace)[this.names.settings];
    }
  };

  // Private: Helpers to retrieve the different parts of the component
  // using the input as the starting point.
  var domHelpers = {
    wrapper: function($input) {
      return $input.closest('.sc-wrapper');
    },

    fakeCheckbox: function($input) {
      return $input.siblings('.sc-fake-checkbox');
    },

    ball: function($input) {
      return this.fakeCheckbox($input).find('.sc-ball');
    },

    checkboxText: function($input) {
      return this.fakeCheckbox($input).find('.sc-text');
    }
  };

  // Private: Bootstrap the styles of the checkbox
  function styleCheckbox($input) {
    var settings = dataHelper.settings($input);
    var $checkboxWrapper = domHelpers.wrapper($input);
    var $fakeCheckbox = domHelpers.fakeCheckbox($input);
    var $ball = domHelpers.ball($input);
    var $text = domHelpers.checkboxText($input);

    $checkboxWrapper.css({
      'width': settings.width,
      'height': settings.height,
      'position': 'relative',
      'cursor': 'pointer'
    });
    $checkboxWrapper.addClass(settings.wrapperClass);


    // Just setting some text in order to be able to measure the height
    $text.text(settings.offText);
    $text.css({
      'position': 'absolute',
      'font-size': settings.fontSize,
      'font-family': 'Helvetica, Arial, sans-serif',
      'font-weight': 'bold',
      'color': 'rgba(1,1,1, 0.5)',
    });
    $text.css({
      'top': (settings.height / 2) - ($text.height() / 2)
    });

    $fakeCheckbox.css({
      'width': settings.width,
      'height': settings.height,
      'box-shadow': '1px 1px 3px 1px rgba(1,1,1,.2) inset',
      'border-radius': '39px'
    });

    $ball.css({
      'width': $fakeCheckbox.height() + 4,
      'height': $fakeCheckbox.height() + 4,
      'box-shadow': '-13px -14px 25px -23px rgba(1,1,1,.2) inset,' +
        '-.5px -.5px 2px .5px rgba(111,111,111,.3)',
      'position': 'absolute',
      'background-color': 'white',
      'border-radius': '50%',
      'border': '1px solid rgba(1,1,1,.1)',
      'top': '-3px'
    });

    $input.css({
      'visibility': 'hidden',
      'position': 'absolute'
    });
    $input.addClass(settings.inputClass);

    if ($input.is(':checked'))
      styleAsChecked($input);
    else
      styleAsUnchecked($input);

  };

  // Private: Apply the required styles to make it look as unchecked
  function styleAsUnchecked($input) {
    var settings = dataHelper.settings($input);
    var $fakeCheckbox = domHelpers.fakeCheckbox($input);
    var $ball = domHelpers.ball($input);
    var $text = domHelpers.checkboxText($input);

    var leftPosForBall =  - ($ball.width() / 3.5);

    $text.text(settings.offText);
    $text.css({
      'left': leftPosForBall + $ball.width() + 3
    });

    $fakeCheckbox.animate({'background-color': '#DC7F6D'});
    $ball.animate({'left': leftPosForBall});
  }

  // Private: Apply the required styles to make it look as checked
  function styleAsChecked($input) {
    var settings = dataHelper.settings($input);
    var $fakeCheckbox = domHelpers.fakeCheckbox($input);
    var $ball = domHelpers.ball($input);
    var $text = domHelpers.checkboxText($input);

    var leftPosForBall = $fakeCheckbox.width() - ($ball.width() / 1.5);

    $text.text(settings.onText);
    $text.css({
      'left': leftPosForBall - $text.width() - 3
    });

    $fakeCheckbox.animate({'background-color': '#9EC369'});

    $ball.animate({'left': leftPosForBall + 'px'});
  };

  // Private: Handler for the change event on the input
  function inputChangeHandler(ev) {
    $input = $(ev.target)

    if ($input.is(':checked'))
      styleAsChecked($input);
    else
      styleAsUnchecked($input);
  };

  function bootstrapHTML($input) {
    $input.wrap('<div class="sc-wrapper">');

    var $checkboxWrapper = $input.closest('.sc-wrapper');

    var $fakeCheckbox = $(
      '<div class="sc-fake-checkbox">' +
        '<span class="sc-text"></span>' +
        '<div class="sc-ball">' +
      '</div>'
    );

    $checkboxWrapper.prepend($fakeCheckbox);
  };

  // Private: Bind all the required events to the component
  function bindEvents($input) {
    var $checkboxWrapper = domHelpers.wrapper($input);
    $checkboxWrapper.on('click.sweetCheckbox', function(event) {
      // If the event is bubbling up from the input then stop the propagation.
      if (event.target == $input[0]) {
        return;
      }

      $input.trigger('click');
    });

    $input.on('change.sweetCheckbox', inputChangeHandler);
  };

  // Private: Remove all the events in order to be able to destroy the component
  // without leaving any reference.
  function unbindEvents($input) {
    var $checkboxWrapper = $input.closest('.sc-wrapper');
    $checkboxWrapper.off('.sweetCheckbox');
    $input.off('.sweetCheckbox');
  }

  // Private: Provide the settings for the plugin by merging the defaults and
  // the options provided
  function _settings(options) {
    if (options === undefined || options === null) {
      options = {};
    }

    var sizes = {
      small: {width: 60, height: 22, fontSize: 12},
      medium: {width: 80, height: 30, fontSize: 15},
      large: {width: 120, height: 40, fontSize: 22}
    };

    var width = sizes[options.size] ?
      sizes[options.size].width : sizes.small.width;

    var height = sizes[options.size] ?
      sizes[options.size].height : sizes.small.height;

    var fontSize = sizes[options.size] ?
      sizes[options.size].fontSize : sizes.small.fontSize;

    var defaults = {
      width: width,
      height: height,
      fontSize: fontSize,
      offText: 'OFF',
      onText: 'ON'
    };

    return $.extend(defaults, options);
  }


  // Private: API methods for using the plugin
  var methods = {

    // Public: Initialize the plugin with the provided settings
    // By calling the plugin without options the init will be executed
    // as default.
    init: function(options) {

      var settings = _settings(options);

      // -----------------------
      // Plugin Logic
      // -----------------------
      return this.each(function() {
        var $input = $(this);

        // Do not active the plugin if it's already enabled
        if ($input.data(dataHelper.names.namespace)) {
          return;
        }

        // Initialize the data namespace
        var data = {};
        data[dataHelper.names.originalPosition] = $input.css('position');
        data[dataHelper.names.originalVisibility] = $input.css('visibility');
        data[dataHelper.names.settings] = settings;

        $input.data(dataHelper.names.namespace, data);

        bootstrapHTML($input);

        styleCheckbox($input);

        bindEvents($input);
      });
    },

    // Public: Remove the bootstraped styles and events from the input.
    // Take the input to the same state from before using the plugin.
    destroy: function() {
      var $input = this;

      var $checkboxWrapper = domHelpers.wrapper($input);
      unbindEvents($input);

      // Remove the wrapper and childs by replacing them with the input.
      $checkboxWrapper.replaceWith($input);

      var data = $input.data(dataHelper.names.namespace);

      $input.css({
        visibility: data[dataHelper.names.originalVisibility],
        position: data[dataHelper.names.originalPosition]
      });

      // Remove the data set by this plugin
      $input.removeData(dataHelper.names.namespace);
    }
  };

})( jQuery );