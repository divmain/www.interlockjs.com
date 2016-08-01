(function () {
  var ANIMATION_DURATION = 1000; // In milliseconds.
  var EASING_POWER = 3; // Acceleration to and from midpoint of animation.
  var MIDPOINT = 0.6; // Point at which to begin deceleration, between 0 and 1.

  var i = 0;
  function scrollTo (targetSelector, duration, cb) {
    return function (ev) {
      if (ev) { ev.preventDefault(); }

      var scrollIdx = ++i;
      var target = document.querySelector(targetSelector);
      var start = Date.now();
      var end = start + duration;

      var startPos = document.body.scrollTop;
      var endPos = target.offsetTop;
      console.log("end position of", endPos, "for", target);
      var difference = endPos - startPos;

      window.requestAnimationFrame(function step () {
        // Protect against multiple concurrent scroll attempts.
        if (scrollIdx !== i) { return; }

        var newPos = startPos + difference * ease(start, end, Date.now());
        console.log("setting document.body.scrollTop to", newPos);
        console.log("but the target offset is", target.offsetTop);
        document.body.scrollTop = document.documentElement.scrollTop = newPos;
        if (newPos !== endPos) {
          window.requestAnimationFrame(step);
        } else {
          cb && cb();
        }
      });
    };
  }

  var midpointCoefficientL = MIDPOINT / Math.pow(MIDPOINT, EASING_POWER)
  var midpointCoefficientR = (1 - MIDPOINT) / Math.pow(1 - MIDPOINT, EASING_POWER);
  function ease (min, max, val) {
    if (val <= min) { return 0; }
    if (val >= max) { return 1; }

    var progress = (val - min)/(max - min);
    return (progress < MIDPOINT) ?
      (midpointCoefficientL * Math.pow(progress, EASING_POWER)) :
      (1 - midpointCoefficientR * Math.pow(1 - progress, EASING_POWER));
  }

  // Setup scrolling for all in-page links.
  var links = document.querySelectorAll("a");
  Array.prototype.forEach.call(links, function (el) {
    if (el.baseURI === document.location.href && el.hash) {
      el.addEventListener("click", scrollTo(el.hash, ANIMATION_DURATION));
    }
  });

  // Scroll to the correct position on page load.
  if (document.location.hash) {
    window.addEventListener(
      "load",
      setTimeout(function () {
        scrollTo(document.location.hash, ANIMATION_DURATION)();
      }, 0),
      false
    );
  }
})();
