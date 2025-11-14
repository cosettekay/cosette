/**
 * Typing Animation for Hero Headline
 * Simulates typing effect with a blinking cursor
 * Colors sync with the seasonal tree animation
 */

class TypingAnimation {
  constructor(element) {
    this.element = element;

    // Text segments with their styling
    this.segments = [
      { text: "hi, i'm ", className: null },
      { text: "cosette", className: "accent" },
      { text: ".", className: null }
    ];

    // Season color palettes (gradient colors)
    this.seasonColors = {
      spring: { color1: '#a8ddb5', color2: '#ffb3c6' },    // Pastel green and pastel pink
      summer: { color1: '#7bc043', color2: '#5dade2' },    // Bright grass green and bright sky blue
      fall: { color1: '#ff9837', color2: '#dcdb84' },      // Warm oranges
      winter: { color1: '#7ec4f5', color2: '#c4e4f7' },    // Cool blues
      dormant: { color1: '#a8ddb5', color2: '#ffb3c6' }    // Same as spring for seamless transition
    };

    this.currentSeason = 'spring'; // Default season

    // Timing configuration (in milliseconds)
    this.typingSpeed = 120;      // Speed of typing each character
    this.deletingSpeed = 60;     // Speed of deleting (faster than typing)
    this.pauseAfterTyping = 2000; // Pause when fully typed
    this.pauseBeforeRestart = 500; // Short pause before restarting

    // State
    this.currentSegmentIndex = 0;
    this.currentCharIndex = 0;
    this.isDeleting = false;
    this.isWaiting = false;

    // Get or create cursor element
    this.cursor = this.element.querySelector('.caret') || this.createCursor();

    // Listen for season changes from tree animation
    this.setupSeasonListener();

    // Start the animation
    this.animate();
  }

  setupSeasonListener() {
    window.addEventListener('seasonChange', (event) => {
      this.currentSeason = event.detail.season;
      this.updateSeasonColors();
    });
  }

  updateSeasonColors() {
    const colors = this.seasonColors[this.currentSeason];
    if (colors) {
      // Update CSS custom properties for the accent gradient
      document.documentElement.style.setProperty('--accent-season1', colors.color1);
      document.documentElement.style.setProperty('--accent-season2', colors.color2);
    }
  }

  createCursor() {
    const cursor = document.createElement('span');
    cursor.className = 'caret';
    cursor.textContent = '|';
    this.element.appendChild(cursor);
    return cursor;
  }

  getCurrentText() {
    let html = '';

    for (let i = 0; i <= this.currentSegmentIndex; i++) {
      const segment = this.segments[i];
      const isCurrentSegment = i === this.currentSegmentIndex;

      // Determine how many characters to show from this segment
      const charsToShow = isCurrentSegment
        ? this.currentCharIndex
        : segment.text.length;

      const text = segment.text.substring(0, charsToShow);

      if (text) {
        if (segment.className) {
          html += `<span class="${segment.className}">${text}</span>`;
        } else {
          html += text;
        }
      }
    }

    return html;
  }

  render() {
    // Update the element content (excluding cursor)
    const currentHTML = this.getCurrentText();
    this.element.innerHTML = currentHTML;

    // Re-append cursor
    this.element.appendChild(this.cursor);
  }

  animate() {
    if (this.isWaiting) {
      return;
    }

    const currentSegment = this.segments[this.currentSegmentIndex];

    if (!this.isDeleting) {
      // TYPING MODE
      if (this.currentCharIndex < currentSegment.text.length) {
        // Continue typing current segment
        this.currentCharIndex++;
        this.render();
        setTimeout(() => this.animate(), this.typingSpeed);
      } else if (this.currentSegmentIndex < this.segments.length - 1) {
        // Move to next segment
        this.currentSegmentIndex++;
        this.currentCharIndex = 0;
        setTimeout(() => this.animate(), this.typingSpeed);
      } else {
        // Finished typing everything - pause then start deleting
        this.isWaiting = true;
        setTimeout(() => {
          this.isWaiting = false;
          this.isDeleting = true;
          this.animate();
        }, this.pauseAfterTyping);
      }
    } else {
      // DELETING MODE
      if (this.currentCharIndex > 0) {
        // Continue deleting current segment
        this.currentCharIndex--;
        this.render();
        setTimeout(() => this.animate(), this.deletingSpeed);
      } else if (this.currentSegmentIndex > 0) {
        // Move to previous segment
        this.currentSegmentIndex--;
        this.currentCharIndex = this.segments[this.currentSegmentIndex].text.length;
        setTimeout(() => this.animate(), this.deletingSpeed);
      } else {
        // Finished deleting everything - pause then restart
        this.isWaiting = true;
        setTimeout(() => {
          this.isWaiting = false;
          this.isDeleting = false;
          this.currentSegmentIndex = 0;
          this.currentCharIndex = 0;
          this.animate();
        }, this.pauseBeforeRestart);
      }
    }
  }
}

// Initialize when DOM is ready
export function initTypingAnimation() {
  const headline = document.querySelector('.headline');
  if (headline) {
    // Clear existing content but keep the cursor if it exists
    const existingCursor = headline.querySelector('.caret');
    headline.innerHTML = '';
    if (existingCursor) {
      headline.appendChild(existingCursor);
    }

    // Start the typing animation
    const typingAnim = new TypingAnimation(headline);

    // Set initial season colors (spring is default)
    typingAnim.updateSeasonColors();
  }
}
