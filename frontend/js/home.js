/* ============================================================
   AI UNIPOD LAGOS — Home Page JavaScript
   WebGL / Three.js effects + dynamic content loading
   ============================================================ */

'use strict';

// ─── HERO WEBGL (Three.js Particle Field) ────────────────────
function initHeroWebGL() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x040E1E, 1);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 80;

  // ── Particle field
  const PARTICLE_COUNT = 3000;
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const colors = new Float32Array(PARTICLE_COUNT * 3);
  const sizes = new Float32Array(PARTICLE_COUNT);

  const colorPrimary = new THREE.Color(0x0468B1); // UNDP blue
  const colorGold = new THREE.Color(0xC8A84B);    // gold
  const colorWhite = new THREE.Color(0xFFFFFF);

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const i3 = i * 3;
    positions[i3]     = (Math.random() - 0.5) * 200;
    positions[i3 + 1] = (Math.random() - 0.5) * 200;
    positions[i3 + 2] = (Math.random() - 0.5) * 100;

    const r = Math.random();
    let c = r < 0.5 ? colorWhite : (r < 0.8 ? colorPrimary : colorGold);
    colors[i3]     = c.r;
    colors[i3 + 1] = c.g;
    colors[i3 + 2] = c.b;

    sizes[i] = Math.random() * 2 + 0.5;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  const material = new THREE.PointsMaterial({
    size: 0.8,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    sizeAttenuation: true,
  });

  const particles = new THREE.Points(geometry, material);
  scene.add(particles);

  // ── Floating geometric rings
  const ringGroup = new THREE.Group();
  scene.add(ringGroup);

  function addRing(radius, tube, color, tilt) {
    const geo = new THREE.TorusGeometry(radius, tube, 16, 100);
    const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.15, wireframe: false });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.x = tilt;
    mesh.rotation.y = Math.random() * Math.PI;
    ringGroup.add(mesh);
    return mesh;
  }

  const ring1 = addRing(30, 0.15, 0x0468B1, 0.8);
  const ring2 = addRing(20, 0.1, 0xC8A84B, 1.2);
  const ring3 = addRing(45, 0.08, 0xFFFFFF, 0.4);

  // ── Mouse parallax
  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', e => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  // ── Animate
  let frame = 0;
  function animate() {
    frame++;
    requestAnimationFrame(animate);

    particles.rotation.y += 0.0003;
    particles.rotation.x += 0.00015;

    ring1.rotation.z += 0.003;
    ring2.rotation.z -= 0.002;
    ring3.rotation.y += 0.001;

    ringGroup.rotation.y += mouseX * 0.001;
    ringGroup.rotation.x += mouseY * 0.001;
    camera.position.x += (mouseX * 8 - camera.position.x) * 0.02;
    camera.position.y += (-mouseY * 4 - camera.position.y) * 0.02;

    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

// ─── ORB WebGL (Facility Section) ────────────────────────────
// ─── INTERACTIVE FACILITY VISUALIZATION (Facility Section) ───────
function initOrbWebGL() {
  const canvas = document.getElementById('orbCanvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 500);
  camera.position.z = 120;

  // Central hub representing the UniPod
  const hubGeo = new THREE.IcosahedronGeometry(25, 3);
  const hubMat = new THREE.MeshBasicMaterial({
    color: 0x1E84C2,
    wireframe: true,
    transparent: true,
    opacity: 0.6,
  });
  const hub = new THREE.Mesh(hubGeo, hubMat);
  scene.add(hub);

  // 6 facility nodes orbiting the center
  const facilities = [
    { name: 'AI Lab', color: 0x1E84C2, angle: 0 },
    { name: 'Maker Space', color: 0xFFDE59, angle: Math.PI / 3 },
    { name: 'Design Lab', color: 0x1E84C2, angle: (Math.PI / 3) * 2 },
    { name: 'Pitch Garage', color: 0xFFDE59, angle: Math.PI },
    { name: 'Collaboration', color: 0x1E84C2, angle: (Math.PI / 3) * 4 },
    { name: 'Exhibition', color: 0xFFDE59, angle: (Math.PI / 3) * 5 }
  ];

  const nodes = [];
  const connections = [];
  const radius = 55;

  facilities.forEach((facility, i) => {
    // Create node
    const nodeGeo = new THREE.SphereGeometry(4, 16, 16);
    const nodeMat = new THREE.MeshBasicMaterial({
      color: facility.color,
      transparent: true,
      opacity: 0.8
    });
    const node = new THREE.Mesh(nodeGeo, nodeMat);
    
    const x = Math.cos(facility.angle) * radius;
    const y = Math.sin(facility.angle) * radius;
    node.position.set(x, y, 0);
    
    scene.add(node);
    nodes.push({ mesh: node, facility, baseScale: 1, targetScale: 1 });

    // Create connection line to hub
    const points = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(x, y, 0)
    ];
    const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
    const lineMat = new THREE.LineBasicMaterial({
      color: facility.color,
      transparent: true,
      opacity: 0.3
    });
    const line = new THREE.Line(lineGeo, lineMat);
    scene.add(line);
    connections.push({ line, facility });
  });

  // Create inter-connections between adjacent nodes
  const interConnections = [];
  for (let i = 0; i < nodes.length; i++) {
    const next = (i + 1) % nodes.length;
    const points = [
      nodes[i].mesh.position.clone(),
      nodes[next].mesh.position.clone()
    ];
    const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x1E84C2,
      transparent: true,
      opacity: 0.15
    });
    const line = new THREE.Line(lineGeo, lineMat);
    scene.add(line);
    interConnections.push(line);
  }

  let hoveredIndex = -1;
  let autoRotateAngle = 0;

  // Mouse interaction
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    
    // Simple distance check for hover
    let closestIndex = -1;
    let minDist = 0.3;
    
    nodes.forEach((node, i) => {
      const screenPos = node.mesh.position.clone().project(camera);
      const dist = Math.sqrt(Math.pow(screenPos.x - x, 2) + Math.pow(screenPos.y - y, 2));
      if (dist < minDist) {
        minDist = dist;
        closestIndex = i;
      }
    });
    
    hoveredIndex = closestIndex;
  });

  canvas.addEventListener('mouseleave', () => {
    hoveredIndex = -1;
  });

  // Click to highlight facility
  let selectedIndex = -1;
  canvas.addEventListener('click', () => {
    if (hoveredIndex !== -1) {
      selectedIndex = selectedIndex === hoveredIndex ? -1 : hoveredIndex;
      
      // Highlight corresponding card
      const cards = document.querySelectorAll('.facility-card');
      cards.forEach((card, i) => {
        if (i === selectedIndex) {
          card.style.background = 'var(--unipods-blue)';
          card.style.transform = 'translateY(-4px)';
          card.querySelectorAll('.facility-card__icon, .facility-card__title, .facility-card__desc')
            .forEach(el => el.style.color = 'white');
        } else {
          card.style.background = '';
          card.style.transform = '';
          card.querySelectorAll('.facility-card__icon, .facility-card__title, .facility-card__desc')
            .forEach(el => el.style.color = '');
        }
      });
    }
  });

  function resizeOrb() {
    const parent = canvas.parentElement;
    if (!parent) return;
    const w = parent.clientWidth;
    const h = parent.clientHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resizeOrb();
  window.addEventListener('resize', resizeOrb);

  function animate() {
    requestAnimationFrame(animate);
    
    // Gentle auto-rotation
    autoRotateAngle += 0.002;
    hub.rotation.y = autoRotateAngle;
    hub.rotation.x = Math.sin(autoRotateAngle * 0.5) * 0.2;
    
    // Animate nodes
    nodes.forEach((node, i) => {
      const isHovered = i === hoveredIndex;
      const isSelected = i === selectedIndex;
      
      // Scale animation
      node.targetScale = (isHovered || isSelected) ? 1.5 : 1;
      node.baseScale += (node.targetScale - node.baseScale) * 0.1;
      node.mesh.scale.setScalar(node.baseScale);
      
      // Opacity animation
      const targetOpacity = (isHovered || isSelected) ? 1 : 0.8;
      node.mesh.material.opacity += (targetOpacity - node.mesh.material.opacity) * 0.1;
      
      // Pulse effect
      const pulse = Math.sin(Date.now() * 0.003 + i) * 0.1 + 1;
      node.mesh.material.emissiveIntensity = pulse;
    });
    
    // Animate connections
    connections.forEach((conn, i) => {
      const isActive = i === hoveredIndex || i === selectedIndex;
      const targetOpacity = isActive ? 0.8 : 0.3;
      conn.line.material.opacity += (targetOpacity - conn.line.material.opacity) * 0.1;
    });
    
    renderer.render(scene, camera);
  }
  animate();
}

// ─── NETWORK CANVAS (Timbuktoo Section) ──────────────────────
function initNetworkCanvas() {
  const canvas = document.getElementById('networkCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let w, h;

  // Africa node positions (approximate lat/lng mapped to canvas)
  const nodes = [
    { name: 'Lagos', x: 0.35, y: 0.52, highlight: true },
    { name: 'Addis Ababa', x: 0.62, y: 0.48 },
    { name: 'Nairobi', x: 0.65, y: 0.55 },
    { name: 'Cape Town', x: 0.52, y: 0.82 },
    { name: 'Cairo', x: 0.57, y: 0.22 },
    { name: 'Dakar', x: 0.18, y: 0.38 },
    { name: 'Accra', x: 0.32, y: 0.50 },
    { name: 'Lusaka', x: 0.58, y: 0.65 },
    { name: 'Kampala', x: 0.63, y: 0.52 },
    { name: 'Abidjan', x: 0.30, y: 0.48 },
    { name: 'Kigali', x: 0.62, y: 0.54 },
    { name: 'Lilongwe', x: 0.61, y: 0.67 },
    { name: 'Maseru', x: 0.55, y: 0.78 },
  ];

  const connections = [
    [0,1],[0,2],[0,6],[0,9],[0,7],[0,3],
    [1,2],[2,3],[3,7],[7,11],[7,12],[2,8],[8,10],
    [4,5],[5,6],[4,1],[9,6],[11,12],[10,11]
  ];

  let frame = 0;
  let animOffset = 0;

  function resize() {
    w = canvas.parentElement.clientWidth;
    h = canvas.parentElement.clientHeight;
    canvas.width = w;
    canvas.height = h;
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    animOffset = (animOffset + 0.008) % 1;

    // Draw connections
    connections.forEach(([a, b]) => {
      const na = nodes[a];
      const nb = nodes[b];
      const x1 = na.x * w, y1 = na.y * h;
      const x2 = nb.x * w, y2 = nb.y * h;

      ctx.beginPath();
      ctx.strokeStyle = 'rgba(4,104,177,0.2)';
      ctx.lineWidth = 1;
      ctx.setLineDash([]);
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      // Animated pulse along line
      const t = (animOffset + (a + b) * 0.07) % 1;
      const px = x1 + (x2 - x1) * t;
      const py = y1 + (y2 - y1) * t;
      ctx.beginPath();
      ctx.arc(px, py, 2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(200,168,75,0.9)';
      ctx.fill();
    });

    // Draw nodes
    nodes.forEach((n, i) => {
      const x = n.x * w, y = n.y * h;
      const isHighlight = n.highlight;

      // Pulse ring
      const pulse = (Math.sin(frame * 0.05 + i * 0.7) + 1) / 2;
      ctx.beginPath();
      ctx.arc(x, y, (isHighlight ? 10 : 6) + pulse * 6, 0, Math.PI * 2);
      ctx.strokeStyle = isHighlight ? `rgba(200,168,75,${0.3 - pulse * 0.2})` : `rgba(4,104,177,${0.2 - pulse * 0.1})`;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Node circle
      ctx.beginPath();
      ctx.arc(x, y, isHighlight ? 6 : 4, 0, Math.PI * 2);
      ctx.fillStyle = isHighlight ? '#C8A84B' : '#0468B1';
      ctx.fill();

      // Label
      if (isHighlight) {
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.font = 'bold 11px "Space Grotesk", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('LAGOS ★', x, y - 14);
      }
    });

    frame++;
    requestAnimationFrame(draw);
  }

  resize();
  draw();
  window.addEventListener('resize', resize);
}

// ─── LOAD GALLERY STRIP WITH AUTO-SCROLL ─────────────────────
async function loadGalleryStrip() {
  const strip = document.getElementById('photoStrip');
  if (!strip) return;

  try {
    const data = await API.get('gallery', { limit: 32 });
    const items = data.data.filter(i => i.published);
    if (!items.length) return;

    // Create image elements with optimized loading
    const fragment = document.createDocumentFragment();
    items.forEach(item => {
      const div = document.createElement('div');
      div.className = 'photo-strip-item h-scroll-item';
      
      const img = document.createElement('img');
      img.src = item.image_url;
      img.alt = item.title;
      img.loading = 'lazy';
      img.decoding = 'async';
      
      div.appendChild(img);
      fragment.appendChild(div);
    });
    
    strip.appendChild(fragment);
    
    // Wait a bit for images to start loading, then initialize auto-scroll
    setTimeout(() => {
      initGalleryAutoScroll();
    }, 100);
  } catch (e) {
    console.error('Gallery load error:', e);
  }
}

// ─── AUTO-SCROLL GALLERY ──────────────────────────────────────
function initGalleryAutoScroll() {
  const wrapper = document.querySelector('.h-scroll-wrap');
  if (!wrapper) {
    console.log('Gallery wrapper not found');
    return;
  }
  
  let isHovering = false;
  let animationId = null;
  const scrollSpeed = 0.5; // pixels per frame
  
  // Auto-scroll function
  function autoScroll() {
    if (!isHovering && wrapper.scrollWidth > wrapper.clientWidth) {
      // Increment scroll position
      wrapper.scrollLeft += scrollSpeed;
      
      // Reset to start when reaching end
      if (wrapper.scrollLeft >= wrapper.scrollWidth - wrapper.clientWidth - 1) {
        wrapper.scrollLeft = 0;
      }
    }
    
    animationId = requestAnimationFrame(autoScroll);
  }
  
  // Pause on hover
  wrapper.addEventListener('mouseenter', () => {
    isHovering = true;
  });
  
  wrapper.addEventListener('mouseleave', () => {
    isHovering = false;
  });
  
  // Start auto-scroll
  autoScroll();
  
  console.log('Gallery auto-scroll initialized');
}

// ─── LOAD PROGRAMS ────────────────────────────────────────────
async function loadPrograms() {
  const grid = document.getElementById('programsGrid');
  if (!grid) return;

  try {
    const data = await API.get('programs', { limit: 6 });
    const items = data.data.filter(i => i.published);
    if (!items.length) {
      grid.innerHTML = '<p class="text-gray text-center" style="padding:80px; grid-column:1/-1">No programs available.</p>';
      return;
    }

    grid.innerHTML = items.map(item => `
      <a href="programs.html" class="program-card card reveal">
        <div class="program-card__img-wrap">
          <img class="program-card__img" src="${item.cover_image || 'https://placehold.co/600x400/0468B1/white?text=Program'}" alt="${item.title}" loading="lazy">
          <div class="program-card__badge program-card__badge--${(item.status||'active').toLowerCase()}">${item.status || 'Active'}</div>
        </div>
        <div class="program-card__body">
          <div class="program-card__meta">
            <span class="program-card__category">${item.category || 'Program'}</span>
            ${item.duration ? `<span class="program-card__duration">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="7" cy="7" r="6" stroke="currentColor" stroke-width="1.5"/>
                <path d="M7 3.5V7L9.5 9.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
              ${item.duration}
            </span>` : ''}
          </div>
          <h3 class="program-card__title">${item.title}</h3>
          <p class="program-card__subtitle">${item.subtitle || ''}</p>
          ${item.tags && item.tags.length ? `
            <div class="program-card__tags">
              ${item.tags.slice(0, 3).map(tag => `<span class="program-tag">${tag}</span>`).join('')}
            </div>
          ` : ''}
          <div class="program-card__footer">
            ${item.level ? `<span class="program-card__level">${item.level}</span>` : ''}
            <span class="program-card__arrow">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 4L13 10L7 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
          </div>
        </div>
      </a>
    `).join('');

    // Re-init reveal for newly added elements
    setTimeout(() => {
      document.querySelectorAll('#programsGrid .reveal').forEach(el => {
        const observer = new IntersectionObserver(entries => {
          entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
        }, { threshold: 0.1 });
        observer.observe(el);
      });
    }, 100);
  } catch (e) {
    console.error('Programs load error:', e);
    grid.innerHTML = '<p class="text-gray text-center" style="padding:80px; grid-column:1/-1">Unable to load programs.</p>';
  }
}

// ─── LOAD NEWS ────────────────────────────────────────────────
async function loadNews() {
  const container = document.getElementById('newsFeatured');
  if (!container) return;

  try {
    const data = await API.get('news', { limit: 4, sort: '-published_date' });
    const items = data.data.filter(i => i.published);
    if (!items.length) return;

    const [first, ...rest] = items;

    const formatDate = (d) => {
      if (!d) return '';
      return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    container.innerHTML = `
      <div class="news-featured">
        <a href="news.html#${first.slug || first.id}" class="news-item news-item--hero">
          <img class="news-item__img" src="${first.cover_image || 'https://placehold.co/800x400/0468B1/white?text=News'}" alt="${first.title}" loading="lazy">
          <div class="news-item__body">
            <div class="news-item__date">${formatDate(first.published_date)} — <span class="tag tag--blue">${first.category || 'News'}</span></div>
            <h3 class="news-item__title">${first.title}</h3>
            <p class="news-item__excerpt">${first.excerpt || ''}</p>
            <span class="btn--ghost">Read more</span>
          </div>
        </a>
        <div class="news-secondary">
          ${rest.map(item => `
            <a href="news.html#${item.slug || item.id}" class="news-item news-item--small">
              <div class="news-item__date">${formatDate(item.published_date)} — <span class="tag tag--blue">${item.category || 'News'}</span></div>
              <h3 class="news-item__title">${item.title}</h3>
              <p class="news-item__excerpt">${item.excerpt || ''}</p>
              <span class="btn--ghost">Read more</span>
            </a>
          `).join('')}
        </div>
      </div>
    `;
  } catch (e) {
    console.error('News load error:', e);
  }
}

// ─── LOAD EVENTS ──────────────────────────────────────────────
async function loadEvents() {
  const container = document.getElementById('eventsGrid');
  if (!container) return;

  try {
    const data = await API.get('events', { limit: 4, sort: 'event_date' });
    const now = new Date();
    const items = data.data.filter(i => i.published && new Date(i.event_date) >= now).slice(0, 4);

    if (!items.length) {
      // Show recent past events
      const all = data.data.filter(i => i.published).slice(0, 4);
      if (all.length) {
        renderEvents(container, all);
      } else {
        container.innerHTML = `
          <div style="padding: 60px 40px; text-align: center; background: var(--white); border-radius: 4px;">
            <p style="color: var(--gray); font-size: 1rem; margin-bottom: 24px;">No events scheduled yet. Check back soon!</p>
            <a href="events.html" class="btn btn--outline">View Events Page</a>
          </div>
        `;
      }
      return;
    }
    renderEvents(container, items);
  } catch (e) {
    console.error('Events load error:', e);
    container.innerHTML = `
      <div style="padding: 60px 40px; text-align: center; background: var(--white); border-radius: 4px;">
        <p style="color: var(--gray); font-size: 1rem; margin-bottom: 24px;">Unable to load events. Please try again later.</p>
        <a href="events.html" class="btn btn--outline">View Events Page</a>
      </div>
    `;
  }
}

function renderEvents(container, items) {
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  container.innerHTML = items.map(item => {
    const d = item.event_date ? new Date(item.event_date) : null;
    const month = d ? months[d.getMonth()] : '';
    const day = d ? d.getDate() : '';

    return `
      <a href="events.html" class="event-row reveal">
        <div class="event-date-block">
          <div class="event-date-block__month">${month}</div>
          <div class="event-date-block__day">${day}</div>
        </div>
        <div>
          <div class="event-row__title">${item.title}</div>
          <div class="event-row__meta">
            <span>${item.category || 'Event'}</span>
            <span>${item.location || 'Lagos'}</span>
          </div>
        </div>
        <span class="event-row__cta">Register →</span>
      </a>
    `;
  }).join('');
}

// ─── LOAD PARTNERS ────────────────────────────────────────────
async function loadPartners() {
  const container = document.getElementById('partnersStrip');
  if (!container) return;

  try {
    const data = await API.get('partners', { limit: 20 });
    const items = data.data.filter(i => i.published).sort((a,b) => (a.order||99) - (b.order||99));

    container.innerHTML = items.map(item => `
      <a href="${item.website || '#'}" target="_blank" rel="noopener" class="partner-logo-item">
        ${item.logo_url
          ? `<img src="${item.logo_url}" alt="${item.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
             <span class="partner-name-fallback" style="display:none">${item.name}</span>`
          : `<span class="partner-name-fallback">${item.name}</span>`
        }
      </a>
    `).join('');
  } catch (e) {
    console.error('Partners load error:', e);
  }
}

// ─── INIT ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // WebGL
  initHeroWebGL();
  initOrbWebGL();
  initNetworkCanvas();

  // Data
  loadGalleryStrip();
  loadPrograms();
  loadNews();
  loadEvents();
  loadPartners();

  // Counter animation for stats
  const statNums = document.querySelectorAll('.stat-num[data-count]');
  const countObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const duration = 1800;
      const start = performance.now();
      function update(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.floor(eased * target);
        el.textContent = value >= 1000 ? value.toLocaleString() + suffix : value + suffix;
        if (progress < 1) requestAnimationFrame(update);
      }
      requestAnimationFrame(update);
      countObs.unobserve(el);
    });
  }, { threshold: 0.5 });
  statNums.forEach(n => countObs.observe(n));

  // Timbuktoo stats
  const tStats = document.querySelectorAll('.timbuktoo-stat__num[data-count]');
  tStats.forEach(n => countObs.observe(n));
});


// ─── MATERIAL DESIGN STAT CARDS ─────────────────────────────
function initMaterialStats() {
  const cards = document.querySelectorAll('.material-card');
  if (!cards.length) return;

  cards.forEach(card => {
    card.addEventListener('click', function(e) {
      // Create ripple effect
      const ripple = this.querySelector('.material-card-ripple');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      
      this.classList.remove('rippling');
      void this.offsetWidth; // Trigger reflow
      this.classList.add('rippling');
      
      setTimeout(() => this.classList.remove('rippling'), 600);
    });
  });
}

// ─── AFRICA MAP INTERACTIONS ─────────────────────────────────
function initAfricaMap() {
  const nodes = document.querySelectorAll('.map-node');
  if (!nodes.length) return;

  nodes.forEach((node, index) => {
    node.addEventListener('click', function() {
      // Create pulse effect
      const svg = this.closest('svg');
      const pulse = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      const cx = this.getAttribute('cx');
      const cy = this.getAttribute('cy');
      
      pulse.setAttribute('cx', cx);
      pulse.setAttribute('cy', cy);
      pulse.setAttribute('r', '10');
      pulse.setAttribute('fill', 'none');
      pulse.setAttribute('stroke', '#FFDE59');
      pulse.setAttribute('stroke-width', '2');
      pulse.style.opacity = '1';
      
      svg.appendChild(pulse);
      
      // Animate pulse
      let radius = 10;
      let opacity = 1;
      const animate = () => {
        radius += 2;
        opacity -= 0.02;
        pulse.setAttribute('r', radius);
        pulse.style.opacity = opacity;
        
        if (opacity > 0) {
          requestAnimationFrame(animate);
        } else {
          pulse.remove();
        }
      };
      animate();
    });
    
    // Hover effect
    node.addEventListener('mouseenter', function() {
      this.style.transform = 'scale(1.3)';
      this.style.transformOrigin = 'center';
    });
    
    node.addEventListener('mouseleave', function() {
      this.style.transform = 'scale(1)';
    });
  });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  initMaterialStats();
  initAfricaMap();
});
