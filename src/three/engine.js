import * as THREE from 'three';
import { MetamorphicSculpture } from './sculpture.js';
import { VectorSpaceVisualizer } from './vectorSpace.js';
import { onSmoothScroll } from '../ui/smoothScroll.js';

export class ThreeEngine {
  constructor(containerId = 'webgl-canvas-container') {
    this.container = document.getElementById(containerId) || document.body;
    this.mouseX = 0;
    this.mouseY = 0;
    this.targetMouseX = 0;
    this.targetMouseY = 0;

    this.scrollVelocity = 0;
    this.targetScrollVelocity = 0;

    this.initScene();
    this.initLights();
    this.initObjects();
    this.initEvents();

    this.clock = new THREE.Clock();
    this.animate = this.animate.bind(this);
    this.animate();
  }

  initScene() {
    this.scene = new THREE.Scene();
    // Deep charcoal atmospheric fog
    this.scene.fog = new THREE.FogExp2(0x11110f, 0.026);

    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.camera.position.set(0, 0, 18);
    this.baseCameraZ = 18;

    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });

    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;

    this.container.appendChild(this.renderer.domElement);
  }

  initLights() {
    // Warm graphite ambient base
    this.ambientLight = new THREE.AmbientLight(0x24221e, 2.6);
    this.scene.add(this.ambientLight);

    // Warm mineral key light (museum/gallery focal angle)
    this.keyLight = new THREE.DirectionalLight(0xe8e3d9, 2.2);
    this.keyLight.position.set(8, 12, 10);
    this.scene.add(this.keyLight);

    // Subtle clay fill point light
    this.clayFillLight = new THREE.PointLight(0xb76545, 2.8, 38);
    this.clayFillLight.position.set(-6, -4, 6);
    this.scene.add(this.clayFillLight);

    // Dark terracotta rim back light
    this.rimLight = new THREE.DirectionalLight(0x7f4636, 1.4);
    this.rimLight.position.set(-5, 8, -8);
    this.scene.add(this.rimLight);
  }

  initObjects() {
    this.sculpture = new MetamorphicSculpture(this.scene);
    this.vectorSpace = new VectorSpaceVisualizer(this.scene);
  }

  initEvents() {
    window.addEventListener('pointermove', (e) => {
      this.targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      this.targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    // Subtle 3D camera parallax response to smooth scrolling velocity
    onSmoothScroll(({ velocity }) => {
      this.targetScrollVelocity = Math.max(-10, Math.min(10, velocity || 0));
    });

    window.addEventListener('resize', () => {
      const w = this.container.clientWidth || window.innerWidth;
      const h = this.container.clientHeight || window.innerHeight;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

      // Refresh mobile state
      if (this.sculpture) {
        this.sculpture.applyChapterState(this.sculpture.currentChapter);
      }
    });
  }

  setChapter(idx) {
    if (this.sculpture) {
      this.sculpture.applyChapterState(idx);
    }
    if (this.vectorSpace) {
      // Reveal vector space particularly in Chapter 08
      this.vectorSpace.setVisible(idx === 8);
    }
  }

  highlightDiscipline(id) {
    if (this.sculpture) {
      this.sculpture.highlightDiscipline(id);
    }
  }

  resetDisciplineHighlight() {
    if (this.sculpture) {
      this.sculpture.resetDisciplineHighlight();
    }
  }

  triggerVectorPulse() {
    if (this.vectorSpace) {
      this.vectorSpace.triggerQueryPulse();
    }
  }

  animate() {
    requestAnimationFrame(this.animate);
    const delta = this.clock.getDelta();
    const time = this.clock.getElapsedTime();

    // Mouse parallax interpolation
    this.mouseX += (this.targetMouseX - this.mouseX) * 0.04;
    this.mouseY += (this.targetMouseY - this.mouseY) * 0.04;

    // Scroll velocity interpolation with smooth decay
    this.scrollVelocity += (this.targetScrollVelocity - this.scrollVelocity) * 0.08;
    this.targetScrollVelocity *= 0.90;

    const isMobile = window.innerWidth < 768;
    const parallaxIntensity = isMobile ? 0.25 : 0.6;
    const scrollInertia = isMobile ? 0.015 : 0.03;

    this.camera.position.x = this.mouseX * parallaxIntensity;
    this.camera.position.y = -this.mouseY * parallaxIntensity - (this.scrollVelocity * scrollInertia);
    this.camera.rotation.x = -(this.scrollVelocity * 0.002);
    this.camera.lookAt(0, 0, 0);

    // Update subcomponents
    if (this.sculpture) {
      this.sculpture.update(time, delta);
    }
    if (this.vectorSpace) {
      this.vectorSpace.update(time);
    }

    this.renderer.render(this.scene, this.camera);
  }
}
