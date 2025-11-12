// Tree Season Animation - Vanilla JavaScript
const SEASONS = ["spring", "summer", "fall", "winter"];
const SNOWFLAKES = Array.from({ length: 20 }, (_, i) => i + 1);

class TreeAnimation {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.error(`Container with id "${containerId}" not found`);
      return;
    }

    this.seasonIndex = 0;
    this.isDormant = false;
    this.fallLayerRef = null;
    this.backgroundRef = null;
    this.trickleInterval = null;

    this.init();
  }

  init() {
    // Create the tree HTML structure
    this.createTreeStructure();

    // Get references
    this.backgroundRef = this.container.querySelector('.background');
    this.fallLayerRef = this.container.querySelector('.season-fall');

    // Set up staggered pop delays
    this.setupStaggeredPopDelays();

    // Start season cycle
    this.startSeasonCycle();
  }

  createTreeStructure() {
    this.container.innerHTML = `
      <div class="tree-animation-container">
        <div class="season-frame">
          <div class="season-frame__halo"></div>
          <div class="season-frame__ground"></div>

          <div class="background season--spring">
            <div class="slope"></div>

            <!-- Tree markup -->
            <div class="tree">
              <div class="leaf leaf1"></div>
              <div class="leaf leaf2 leaf--fallable"></div>

              <div class="branch left branch1">
                <div class="branch left branch-inner1">
                  <div class="leaf leaf1"></div>
                  <div class="leaf leaf2"></div>
                  <div class="leaf leaf3 leaf--fallable"></div>
                  <div class="heart flower1 blueflower"></div>
                </div>
                <div class="branch left branch-inner2">
                  <div class="leaf leaf1 leaf--fallable"></div>
                  <div class="leaf leaf2"></div>
                  <div class="leaf leaf3"></div>
                  <div class="tulip flower1 redflower">
                    <div class="peak"></div>
                  </div>
                </div>
                <div class="branch left branch-inner3">
                  <div class="leaf leaf1"></div>
                  <div class="leaf leaf2"></div>
                </div>
                <div class="flower petal5 flower1 redflower">
                  ${this.createPetalWrapper()}
                </div>
              </div>

              <div class="branch right branch2">
                <div class="branch left branch-inner1">
                  <div class="leaf leaf1"></div>
                  <div class="leaf leaf2 leaf--fallable"></div>
                  <div class="leaf leaf3"></div>
                  <div class="flower petal5 flower1 blueflower">
                    ${this.createPetalWrapper()}
                  </div>
                </div>
                <div class="branch right branch-inner2">
                  <div class="leaf leaf1 leaf--fallable"></div>
                  <div class="leaf leaf2"></div>
                  <div class="leaf leaf3"></div>
                  <div class="tulip flower1 greenflower">
                    <div class="peak"></div>
                  </div>
                </div>
                <div class="branch right branch-inner3">
                  <div class="leaf leaf1"></div>
                  <div class="leaf leaf2"></div>
                  <div class="leaf leaf3 leaf--fallable"></div>
                  <div class="branch left branch-inner4">
                    <div class="leaf leaf1"></div>
                    <div class="flower petal5 flower1 yellowflower">
                      ${this.createPetalWrapper()}
                    </div>
                  </div>
                  <div class="tulip flower1 purpleflower">
                    <div class="peak"></div>
                  </div>
                </div>
                <div class="flower roundpetal flower1">
                  ${this.createPetalWrapper()}
                </div>
              </div>

              <div class="branch left branch3">
                <div class="branch right branch-inner1">
                  <div class="leaf leaf1"></div>
                  <div class="leaf leaf2"></div>
                  <div class="leaf leaf3 leaf--fallable"></div>
                  <div class="heart flower1"></div>
                </div>
                <div class="branch left branch-inner2">
                  <div class="leaf leaf1"></div>
                  <div class="leaf leaf2"></div>
                  <div class="leaf leaf3"></div>
                  <div class="tulip flower1">
                    <div class="peak"></div>
                  </div>
                </div>
                <div class="leaf leaf1 leaf--fallable"></div>
                <div class="leaf leaf2"></div>
                <div class="flower roundpetal petal5 flower1 purpleflower">
                  ${this.createPetalWrapper()}
                </div>
              </div>

              <div class="branch right branch4">
                <div class="branch left branch-inner1">
                  <div class="leaf leaf1"></div>
                  <div class="leaf leaf2 leaf--fallable"></div>
                  <div class="leaf leaf3"></div>
                  <div class="flower petal5 flower1 yellowflower">
                    ${this.createPetalWrapper()}
                  </div>
                </div>
                <div class="branch right branch-inner2">
                  <div class="leaf leaf1 leaf--fallable"></div>
                  <div class="leaf leaf2"></div>
                  <div class="leaf leaf3"></div>
                  <div class="tulip tulip1 flower1 purpleflower">
                    <div class="peak"></div>
                  </div>
                </div>
                <div class="flower roundpetal flower1">
                  ${this.createPetalWrapper()}
                </div>
              </div>

              <div class="branch left branch5">
                <div class="branch right branch-inner1">
                  <div class="leaf leaf1 leaf--fallable"></div>
                  <div class="leaf leaf2"></div>
                  <div class="leaf leaf3"></div>
                  <div class="heart flower1"></div>
                </div>
                <div class="branch left branch-inner2">
                  <div class="leaf leaf1"></div>
                  <div class="leaf leaf2"></div>
                  <div class="leaf leaf3"></div>
                  <div class="tulip flower1 greenflower">
                    <div class="peak"></div>
                  </div>
                </div>
                <div class="flower roundpetal petal5 flower1 blueflower">
                  ${this.createPetalWrapper()}
                </div>
              </div>
            </div>

            <!-- FALL particles (spawned dynamically) -->
            <div class="season-fall"></div>

            <!-- WINTER particles -->
            <div class="season-snow">
              ${SNOWFLAKES.map(flake =>
                `<span class="season-snow__flake season-snow__flake--${flake}"></span>`
              ).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  createPetalWrapper() {
    return `
      <div class="petal">
        <div class="petal">
          <div class="petal"></div>
        </div>
      </div>
    `;
  }

  setupStaggeredPopDelays() {
    const targets = this.backgroundRef.querySelectorAll(
      '.tree, .tree .branch, .tree .leaf, .tree .flower1, .tree .heart, .tree .tulip'
    );

    const depths = [0, 0, 0];
    targets.forEach((element) => {
      const className = element.className;

      if (className.includes('branch-inner')) {
        depths[1] += 1;
        depths[2] = 0;
      } else if (className.includes('branch')) {
        depths[0] += 1;
        depths[1] = 0;
        depths[2] = 0;
      } else if (className.includes('leaf') || className.includes('flower1')) {
        depths[2] += 1;
      }

      const time = 0.3 + depths[0] * 0.35 + depths[1] * 0.25 + depths[2] * 0.15;
      element.style.setProperty('--pop-delay', `${time}s`);
    });
  }

  startSeasonCycle() {
    const duration = 15000;
    const dormantDuration = 1500;

    const cycle = () => {
      setTimeout(() => {
        if (this.isDormant) {
          this.isDormant = false;
          this.seasonIndex = 0;
        } else if (this.seasonIndex === SEASONS.length - 1) {
          this.isDormant = true;
        } else {
          this.seasonIndex = (this.seasonIndex + 1) % SEASONS.length;
        }

        this.updateSeason();
        cycle();
      }, this.isDormant ? dormantDuration : duration);
    };

    cycle();
    this.updateSeason();
  }

  updateSeason() {
    const currentSeason = this.isDormant ? 'dormant' : SEASONS[this.seasonIndex];

    // Remove all season classes
    this.backgroundRef.classList.remove(
      'season--spring',
      'season--summer',
      'season--fall',
      'season--winter',
      'season--dormant'
    );

    // Add current season class
    this.backgroundRef.classList.add(`season--${currentSeason}`);

    // Dispatch custom event for season change
    const seasonChangeEvent = new CustomEvent('seasonChange', {
      detail: { season: currentSeason }
    });
    window.dispatchEvent(seasonChangeEvent);

    // Handle fall particles
    if (currentSeason === 'fall') {
      this.startFallParticles();
    } else {
      this.stopFallParticles();
    }
  }

  getCurrentSeason() {
    return this.isDormant ? 'dormant' : SEASONS[this.seasonIndex];
  }

  startFallParticles() {
    const bg = this.backgroundRef;
    const layer = this.fallLayerRef;
    if (!bg || !layer) return;

    const bgRect = bg.getBoundingClientRect();
    const sources = bg.querySelectorAll('.leaf.leaf--fallable');

    const spawn = (x, y) => {
      const s = document.createElement('span');
      s.className = 'season-fall__leaf';

      // Slight per-particle variety
      const delay = (Math.random() * 1.5).toFixed(2);
      const dur = (5.5 + Math.random() * 3.5).toFixed(2);
      const size = (12 + Math.random() * 10).toFixed(0);

      s.style.setProperty('--x', `${x}px`);
      s.style.setProperty('--y', `${y}px`);
      s.style.setProperty('--delay', `${delay}s`);
      s.style.setProperty('--dur', `${dur}s`);
      s.style.setProperty('--size', `${size}px`);

      layer.appendChild(s);

      // Cleanup this particle after its animation
      const total = (parseFloat(delay) + parseFloat(dur)) * 1000;
      const timeout = setTimeout(() => s.remove(), total + 150);
      s.__cleanup = () => clearTimeout(timeout);
    };

    // Initial seeding: 1-2 per fallable leaf
    sources.forEach((leaf) => {
      const r = leaf.getBoundingClientRect();
      const x = r.left - bgRect.left + r.width / 2;
      const y = r.top - bgRect.top + r.height / 2;
      spawn(x, y);
      if (Math.random() > 0.5) spawn(x, y + Math.random() * 6);
    });

    // Trickle while in fall
    this.trickleInterval = setInterval(() => {
      if (!sources.length) return;
      const el = sources[Math.floor(Math.random() * sources.length)];
      const r = el.getBoundingClientRect();
      const x = r.left - bgRect.left + r.width / 2;
      const y = r.top - bgRect.top + r.height / 2;
      spawn(x, y);
    }, 900);
  }

  stopFallParticles() {
    if (this.trickleInterval) {
      clearInterval(this.trickleInterval);
      this.trickleInterval = null;
    }

    if (this.fallLayerRef) {
      this.fallLayerRef.replaceChildren();
    }
  }

  destroy() {
    this.stopFallParticles();
  }
}

// Initialize the animation when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new TreeAnimation('tree-container');
  });
} else {
  new TreeAnimation('tree-container');
}
