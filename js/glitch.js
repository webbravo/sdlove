/**
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2018, Codrops
 * http://www.codrops.com
 */
;(function ($, window, document, undefined) {
  'use strict';
{
  class Slide {
    constructor(el) {
      this.DOM = {el: el};
      this.DOM.slideImg = this.DOM.el.querySelector('.slide__img');
      this.bgImage = this.DOM.slideImg.style.backgroundImage;
      this.layout();
    }
    layout() {
      this.DOM.slideImg.innerHTML = `<div class='glitch__img' style='background-image: ${this.DOM.slideImg.style.backgroundImage};'></div>`.repeat(5);
      this.DOM.glitchImgs = Array.from(this.DOM.slideImg.querySelectorAll('.glitch__img'));
    }
    changeBGImage(bgimage, pos = 0, delay = 0) {
      setTimeout(() => this.DOM.glitchImgs[pos].style.backgroundImage = bgimage, delay);
    }
  }

  class GlitchSlideshow {
    constructor(el) {
      this.DOM = {el: el};
      this.DOM.slides = Array.from(this.DOM.el.querySelectorAll('.slide'));
      this.slidesTotal = this.DOM.slides.length;
      this.slides = [];
      this.DOM.slides.forEach(slide => this.slides.push(new Slide(slide)));
      this.current = 0;
      this.glitchTime = 1200;
      this.totalGlitchSlices = 5;
    }
    glitch(slideFrom, slideTo) {
      return new Promise((resolve, reject) => {
          slideFrom.DOM.slideImg.classList.add('glitch--animate');

      const slideFromBGImage = slideFrom.bgImage;
      const slideToBGImage = slideTo.bgImage;

      for (let i = this.totalGlitchSlices-1; i >= 0; --i) {
        slideFrom.changeBGImage(slideToBGImage, i, this.glitchTime/(this.totalGlitchSlices+1)*(this.totalGlitchSlices-i-1) + this.glitchTime/(this.totalGlitchSlices+1));
      }

      setTimeout(() => {
        slideFrom.DOM.slideImg.classList.remove('glitch--animate');

      // reset bgimages.
      for (let i = this.totalGlitchSlices-1; i >= 0; --i) {
        slideFrom.changeBGImage(slideFromBGImage, i, 0);
      }

      resolve();
    }, this.glitchTime);
    });
    }
    navigate(pos) {
      if ( !this.isReady(pos) ) return;
      this.isAnimating = true;

      const newCurrent =  pos;

      this.glitch(this.slides[this.current], this.slides[newCurrent]).then(() => {
        this.DOM.slides[this.current].classList.remove('slide--current');
      this.current = newCurrent;
      this.DOM.slides[this.current].classList.add('slide--current');
      this.isAnimating = false;
    });
    }
    isReady(pos) {
      return !(this.isAnimating || pos === this.current);
    }
  }

  // Preload all the images in the page..
  imagesLoaded(document.querySelectorAll('.slide__img'), {background: true}, () => {
    document.body.classList.remove('loading');
  const slideshow = new GlitchSlideshow(document.querySelector('.slides--fullscreen'));
  Array.from(document.querySelectorAll('.sub-thumb-slider--vertical .thumb-slider-bg')).forEach((link, pos) =>
    link.addEventListener('click', (ev) => {
      ev.preventDefault();
      if ( !slideshow.isReady(pos) ) return;
      slideshow.navigate(pos);
    })
  );
});
}
})(jQuery, window, document);