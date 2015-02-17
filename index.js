module.exports = {
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
      var o0 = (gcs.getPropertyValue("opacity") === 0);
      var v0 = (gcs.getPropertyValue("visibility") === "hidden");
      visible = visible && !o0 && !v0;
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
    document.addEventListener("scroll", this.checkComponentVisibility);
    window.addEventListener("resize", this.checkComponentVisibility);
    if (checkNow) { this.checkComponentVisibility(); }
  },

  /**
   * This can be called to manually turn off visibility handling. This
   * is particularly handy when you're running it on a lot of components
   * and you only really need to do something once, like loading in
   * static assets on first-time-in-view-ness (that's a word, right?).
   */
  disableVisbilityHandling: function() {
    document.removeEventListener("scroll", this.checkComponentVisibility);
    window.removeEventListener("resize", this.checkComponentVisibility);
  }
};
