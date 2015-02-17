(function() {

  var RATE_LIMIT = 25;

  var ComponentVisibilityMixin = {

    setComponentVisbilityRateLimit: function(milliseconds) {
      RATE_LIMIT = milliseconds;
    },

    getInitialState: function() {
      return { visible: false };
    },

    componentDidMount: function() {
      this.enableVisbilityHandling(true);
    },

    componentWillUnmount: function() {
      this.disableVisbilityHandling();
    },

    /**
     * Check whether a component is in view based on its DOM node,
     * checking for both vertical and horizontal in-view-ness, as
     * well as whether or not it's invisible due to CSS rules based
     * on opacity:0 or visibility:hidden.
     */
    checkComponentVisibility: function() {
      var domnode = this.getDOMNode(),
          gcs = getComputedStyle(domnode, false),
          dims = domnode.getBoundingClientRect(),
          h = window.innerHeight,
          w = window.innerWidth,
          // are we vertically visible?
          topVisible = 0 < dims.top && dims.top < h,
          bottomVisible = 0 < dims.bottom && dims.bottom < h,
          verticallyVisible = topVisible || bottomVisible,
          // also, are we horizontally visible?
          leftVisible = 0 < dims.left && dims.left < w,
          rightVisible = 0 < dims.right && dims.right < w,
          horizontallyVisible = leftVisible || rightVisible,
          // we're only visible if both of those are true.
          visible = horizontallyVisible && verticallyVisible;

      // but let's be fair: if we're opacity: 0 or
      // visibility: hidden, we're not visible at all.
      if(visible) {
        var d0 = (gcs.getPropertyValue("display") === "none");
        var o0 = (gcs.getPropertyValue("opacity") === 0);
        var v0 = (gcs.getPropertyValue("visibility") === "hidden");
        visible = visible && !d0 && !o0 && !v0;
      }

      // at this point, if our visibility is not what we expected,
      // update our state so that we can trigger whatever needs to
      // happen.
      if(visible !== this.state.visible) {
        // set State first:
        this.setState({ visible: visible },
        // then notify the component the value was changed:
        function() {
          if (this.componentVisibilityChanged) {
            this.componentVisibilityChanged();
          }
        });
      }
    },

    /**
     * This can be called to manually turn on visibility handling, if at
     * some point it got turned off. Call this without arguments to turn
     * listening on, or with argument "true" to turn listening on and
     * immediately check whether this element is already visible or not.
     */
    enableVisbilityHandling: function(checkNow) {
      this._rcv_fn = function() {
        if(this._rcv_lock) {
          this._rcv_schedule = true;
          return;
        }
        this._rcv_lock = true;
        this.checkComponentVisibility();
        setTimeout(function() {
          this._rcv_lock = false;
          if (this._rcv_schedule) {
            this._rcv_schedule = false;
            this.checkComponentVisibility();
          }
        }.bind(this), RATE_LIMIT);
      }.bind(this);
      document.addEventListener("scroll", this._rcv_fn);
      window.addEventListener("resize", this._rcv_fn);
      if (checkNow) { this._rcv_fn(); }
    },

    /**
     * This can be called to manually turn off visibility handling. This
     * is particularly handy when you're running it on a lot of components
     * and you only really need to do something once, like loading in
     * static assets on first-time-in-view-ness (that's a word, right?).
     */
    disableVisbilityHandling: function() {
      if (this._rcv_fn) {
        document.removeEventListener("scroll", this._rcv_fn);
        window.removeEventListener("resize", this._rcv_fn);
        this._rcv_fn = false;
      }
    }
  };

  if(typeof module !== "undefined") {
    module.exports = ComponentVisibilityMixin;
  }

  else if (typeof define !== "undefined") {
    define(function() {
      return ComponentVisibilityMixin;
    });
  }

  else if (typeof window !== "undefined") {
    window.ComponentVisibilityMixin = ComponentVisibilityMixin;
  }

}());
