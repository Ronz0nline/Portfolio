import * as THREE from 'three';

/**
 * Metamorphic 3D Sculpture System
 * Builds a transforming physical sculpture that evolves across 13 narrative chapters.
 */

export class MetamorphicSculpture {
  constructor(scene) {
    this.scene = scene;
    this.currentChapter = 0;
    this.targetChapter = 0;
    this.morphProgress = 0;

    // Master Group for transformation
    this.masterGroup = new THREE.Group();
    this.scene.add(this.masterGroup);

    this.initMaterials();
    this.initGeometry();
    this.initArchitecturalElements();
    this.initDustSystem();
    this.initDisciplineClusters();

    // Default to Chapter 00 state
    this.applyChapterState(0, 1.0);
  }

  initMaterials() {
    // 1. Matte Terracotta / Clay
    this.clayMat = new THREE.MeshStandardMaterial({
      color: 0xb76545,
      roughness: 0.88,
      metalness: 0.08,
      flatShading: true
    });

    // 2. Dark Warm Graphite
    this.graphiteMat = new THREE.MeshStandardMaterial({
      color: 0x24221e,
      roughness: 0.95,
      metalness: 0.05,
      flatShading: true
    });

    // 3. Dark Terracotta / Burnt Earth
    this.terracottaMat = new THREE.MeshStandardMaterial({
      color: 0x7f4636,
      roughness: 0.86,
      metalness: 0.06,
      flatShading: true
    });

    // 4. Muted Stone Wireframe Shell
    this.wireframeMat = new THREE.MeshBasicMaterial({
      color: 0x8d887e,
      wireframe: true,
      transparent: true,
      opacity: 0.18
    });

    // 5. Pale Warm Ivory Wireframe
    this.ivoryWireMat = new THREE.MeshBasicMaterial({
      color: 0xe8e3d9,
      wireframe: true,
      transparent: true,
      opacity: 0.28
    });
  }

  initGeometry() {
    // Asymmetrical faceted icosahedron mineral form
    this.baseGeometry = new THREE.IcosahedronGeometry(2.4, 3);
    const posAttr = this.baseGeometry.attributes.position;
    this.vertexCount = posAttr.count;

    this.origPositions = new Float32Array(this.vertexCount * 3);
    this.facetedPositions = new Float32Array(this.vertexCount * 3);
    this.flattenedPositions = new Float32Array(this.vertexCount * 3);

    for (let i = 0; i < this.vertexCount; i++) {
      const i3 = i * 3;
      const x = posAttr.getX(i);
      const y = posAttr.getY(i);
      const z = posAttr.getZ(i);

      this.origPositions[i3] = x;
      this.origPositions[i3 + 1] = y;
      this.origPositions[i3 + 2] = z;

      // Natural mineral asymmetry
      const noise = Math.sin(x * 1.8) * Math.cos(y * 1.8) * Math.sin(z * 1.8) * 0.42;
      this.facetedPositions[i3] = x * (1.0 + noise);
      this.facetedPositions[i3 + 1] = y * (1.0 + noise * 0.85);
      this.facetedPositions[i3 + 2] = z * (1.0 + noise * 1.15);

      // Architectural flattened plane morph
      this.flattenedPositions[i3] = x * 1.4;
      this.flattenedPositions[i3 + 1] = y * 0.35 + Math.sin(x * 2) * 0.2;
      this.flattenedPositions[i3 + 2] = z * 1.4;
    }

    this.primaryMesh = new THREE.Mesh(this.baseGeometry.clone(), this.clayMat);
    this.masterGroup.add(this.primaryMesh);

    this.wireShellMesh = new THREE.Mesh(this.baseGeometry.clone(), this.wireframeMat);
    this.wireShellMesh.scale.set(1.08, 1.08, 1.08);
    this.masterGroup.add(this.wireShellMesh);
  }

  initArchitecturalElements() {
    // Orbital horizon rings
    this.ringGroup = new THREE.Group();
    this.masterGroup.add(this.ringGroup);

    const ringMat = new THREE.MeshBasicMaterial({ color: 0x8d887e, transparent: true, opacity: 0.3 });
    this.ring1 = new THREE.Mesh(new THREE.TorusGeometry(4.2, 0.02, 16, 120), ringMat);
    this.ring1.rotation.x = Math.PI / 2.8;
    this.ringGroup.add(this.ring1);

    this.ring2 = new THREE.Mesh(new THREE.TorusGeometry(5.4, 0.015, 16, 120), ringMat);
    this.ring2.rotation.x = -Math.PI / 3.2;
    this.ring2.rotation.y = Math.PI / 6;
    this.ringGroup.add(this.ring2);

    // Architectural Coordinate Bounding Frame
    this.frameGroup = new THREE.Group();
    const boxGeo = new THREE.BoxGeometry(6.4, 4.6, 3.2);
    const boxEdges = new THREE.EdgesGeometry(boxGeo);
    const boxMat = new THREE.LineBasicMaterial({ color: 0x8d887e, transparent: true, opacity: 0.24 });
    this.archFrame = new THREE.LineSegments(boxEdges, boxMat);
    this.frameGroup.add(this.archFrame);
    this.masterGroup.add(this.frameGroup);

    // Coordinate telemetry markers (subtle small corner crosses)
    const crossMat = new THREE.LineBasicMaterial({ color: 0xb76545, transparent: true, opacity: 0.45 });
    const crossGeo = new THREE.BufferGeometry();
    const crossPts = new Float32Array([
      -0.2, 0, 0,  0.2, 0, 0,
      0, -0.2, 0,  0, 0.2, 0
    ]);
    crossGeo.setAttribute('position', new THREE.BufferAttribute(crossPts, 3));
    
    [-3.2, 3.2].forEach(x => {
      [-2.3, 2.3].forEach(y => {
        const marker = new THREE.LineSegments(crossGeo, crossMat);
        marker.position.set(x, y, 0);
        this.frameGroup.add(marker);
      });
    });
  }

  initDustSystem() {
    // Physical mineral dust flecks (reduced count for quiet negative space)
    const isMobile = window.innerWidth < 768;
    this.dustCount = isMobile ? 180 : 380;
    
    this.dustGeo = new THREE.BufferGeometry();
    this.dustPositions = new Float32Array(this.dustCount * 3);
    this.dustInitPositions = new Float32Array(this.dustCount * 3);

    for (let i = 0; i < this.dustCount; i++) {
      const i3 = i * 3;
      const x = (Math.random() - 0.5) * 18;
      const y = (Math.random() - 0.5) * 16;
      const z = (Math.random() - 0.5) * 12;

      this.dustPositions[i3] = x;
      this.dustPositions[i3 + 1] = y;
      this.dustPositions[i3 + 2] = z;

      this.dustInitPositions[i3] = x;
      this.dustInitPositions[i3 + 1] = y;
      this.dustInitPositions[i3 + 2] = z;
    }

    this.dustGeo.setAttribute('position', new THREE.BufferAttribute(this.dustPositions, 3));
    this.dustMat = new THREE.PointsMaterial({
      color: 0xe8e3d9,
      size: 0.08,
      transparent: true,
      opacity: 0.45,
      sizeAttenuation: true
    });

    this.dustSystem = new THREE.Points(this.dustGeo, this.dustMat);
    this.scene.add(this.dustSystem);
  }

  initDisciplineClusters() {
    // 6 spatial discipline satellites that branch out in Chapter 05
    this.disciplinesGroup = new THREE.Group();
    this.masterGroup.add(this.disciplinesGroup);

    this.satellites = [];
    const sphereGeo = new THREE.DodecahedronGeometry(0.35, 1);

    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const radius = 3.6;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius * 0.65;
      const z = Math.sin(angle * 2) * 0.8;

      const mat = (i % 2 === 0) ? this.clayMat : this.graphiteMat;
      const mesh = new THREE.Mesh(sphereGeo, mat);
      mesh.position.set(x, y, z);
      mesh.userData = { id: i, homeX: x, homeY: y, homeZ: z };
      this.disciplinesGroup.add(mesh);
      this.satellites.push(mesh);
    }

    this.disciplinesGroup.visible = false;
  }

  /**
   * Apply exact chapter parameters
   */
  applyChapterState(idx, alpha = 1.0) {
    this.currentChapter = idx;
    const isMobile = window.innerWidth < 768;

    // Mobile offsets: center objects slightly higher so text doesn't overlap
    const mobileY = isMobile ? 1.2 : 0;
    const mobileScale = isMobile ? 0.72 : 1.0;

    switch(idx) {
      case 0: // Chapter 00 — VOID
        this.masterGroup.position.set(0, mobileY, 0);
        this.masterGroup.scale.set(0.08 * mobileScale, 0.08 * mobileScale, 0.08 * mobileScale);
        this.primaryMesh.material = this.graphiteMat;
        this.wireShellMesh.visible = false;
        this.ringGroup.visible = false;
        this.frameGroup.visible = false;
        this.disciplinesGroup.visible = false;
        this.dustMat.opacity = 0.15;
        break;

      case 1: // Chapter 01 — EMERGENCE
        this.masterGroup.position.set(0, mobileY, 0);
        this.masterGroup.scale.set(0.68 * mobileScale, 0.68 * mobileScale, 0.68 * mobileScale);
        this.primaryMesh.material = this.clayMat;
        this.wireShellMesh.visible = true;
        this.ringGroup.visible = true;
        this.ring1.scale.set(0.6, 0.6, 0.6);
        this.ring2.scale.set(0.5, 0.5, 0.5);
        this.frameGroup.visible = false;
        this.disciplinesGroup.visible = false;
        this.dustMat.opacity = 0.5;
        break;

      case 2: // Chapter 02 — INFORMATION / COORDINATES
        this.masterGroup.position.set(isMobile ? 0 : 2.0, mobileY, -1);
        this.masterGroup.scale.set(0.92 * mobileScale, 0.92 * mobileScale, 0.92 * mobileScale);
        this.primaryMesh.material = this.graphiteMat;
        this.wireShellMesh.visible = true;
        this.ringGroup.visible = true;
        this.ring1.scale.set(1.1, 1.1, 1.1);
        this.frameGroup.visible = true;
        this.disciplinesGroup.visible = false;
        break;

      case 3: // Chapter 03 — INTELLIGENCE
        this.masterGroup.position.set(0, mobileY, -1.5);
        this.masterGroup.scale.set(1.2 * mobileScale, 1.2 * mobileScale, 1.2 * mobileScale);
        this.primaryMesh.material = this.clayMat;
        this.wireShellMesh.visible = true;
        this.wireShellMesh.material = this.ivoryWireMat;
        this.ringGroup.visible = true;
        this.frameGroup.visible = true;
        this.disciplinesGroup.visible = false;
        break;

      case 4: // Chapter 04 — THE MIND / ROHAN
        this.masterGroup.position.set(isMobile ? 0 : 2.5, mobileY, -2.2);
        this.masterGroup.scale.set(1.42 * mobileScale, 1.42 * mobileScale, 1.42 * mobileScale);
        this.primaryMesh.material = this.clayMat;
        this.wireShellMesh.visible = true;
        this.wireShellMesh.material = this.wireframeMat;
        this.ringGroup.visible = true;
        this.frameGroup.visible = false;
        this.disciplinesGroup.visible = false;
        break;

      case 5: // Chapter 05 — DISCIPLINES
        this.masterGroup.position.set(0, mobileY, -2.5);
        this.masterGroup.scale.set(1.05 * mobileScale, 1.05 * mobileScale, 1.05 * mobileScale);
        this.primaryMesh.material = this.graphiteMat;
        this.wireShellMesh.visible = true;
        this.ringGroup.visible = true;
        this.frameGroup.visible = true;
        this.disciplinesGroup.visible = true;
        break;

      case 6: // Chapter 06 — HOW I THINK (METHODOLOGY)
        this.masterGroup.position.set(isMobile ? 0 : -2.4, mobileY, -1.8);
        this.masterGroup.scale.set(0.88 * mobileScale, 0.88 * mobileScale, 0.88 * mobileScale);
        this.primaryMesh.material = this.clayMat;
        this.wireShellMesh.visible = true;
        this.ringGroup.visible = true;
        this.frameGroup.visible = true;
        this.disciplinesGroup.visible = false;
        break;

      case 7: // Chapter 07 — WORK / CASE STUDIES
        this.masterGroup.position.set(isMobile ? 0 : 2.7, isMobile ? 1.0 : -0.4, -2.2);
        this.masterGroup.scale.set(1.15 * mobileScale, 1.15 * mobileScale, 1.15 * mobileScale);
        this.primaryMesh.material = this.graphiteMat;
        this.wireShellMesh.visible = true;
        this.ringGroup.visible = true;
        this.frameGroup.visible = true;
        this.disciplinesGroup.visible = false;
        break;

      case 8: // Chapter 08 — RETRIEVAL & VECTOR SPACE
        this.masterGroup.position.set(0, isMobile ? 1.2 : 0.6, -3.2);
        this.masterGroup.scale.set(1.2 * mobileScale, 1.2 * mobileScale, 1.2 * mobileScale);
        this.primaryMesh.material = this.clayMat;
        this.wireShellMesh.visible = true;
        this.ringGroup.visible = true;
        this.frameGroup.visible = true;
        this.disciplinesGroup.visible = false;
        break;

      case 9: // Chapter 09 — THE FRONTIER
        this.masterGroup.position.set(isMobile ? 0 : -2.6, mobileY, -2.0);
        this.masterGroup.scale.set(1.25 * mobileScale, 1.25 * mobileScale, 1.25 * mobileScale);
        this.primaryMesh.material = this.terracottaMat;
        this.wireShellMesh.visible = true;
        this.ringGroup.visible = true;
        this.frameGroup.visible = false;
        this.disciplinesGroup.visible = false;
        break;

      case 10: // Chapter 10 — TRAJECTORY
        this.masterGroup.position.set(0, isMobile ? 1.0 : -1.0, -1.8);
        this.masterGroup.scale.set(0.95 * mobileScale, 0.95 * mobileScale, 0.95 * mobileScale);
        this.primaryMesh.material = this.graphiteMat;
        this.wireShellMesh.visible = true;
        this.ringGroup.visible = true;
        this.frameGroup.visible = true;
        this.disciplinesGroup.visible = false;
        break;

      case 11: // Chapter 11 — SYNTHESIS (COLLAPSE BACK)
        this.masterGroup.position.set(0, mobileY, 0);
        this.masterGroup.scale.set(0.48 * mobileScale, 0.48 * mobileScale, 0.48 * mobileScale);
        this.primaryMesh.material = this.clayMat;
        this.wireShellMesh.visible = true;
        this.ringGroup.visible = false;
        this.frameGroup.visible = false;
        this.disciplinesGroup.visible = false;
        break;

      case 12: // Chapter 12 — CONNECTION
      default:
        this.masterGroup.position.set(isMobile ? 0 : -2.5, mobileY, -0.5);
        this.masterGroup.scale.set(0.75 * mobileScale, 0.75 * mobileScale, 0.75 * mobileScale);
        this.primaryMesh.material = this.graphiteMat;
        this.wireShellMesh.visible = true;
        this.ringGroup.visible = true;
        this.frameGroup.visible = true;
        this.disciplinesGroup.visible = false;
        break;
    }
  }

  highlightDiscipline(id) {
    if (this.currentChapter !== 5) return;
    this.satellites.forEach((sat) => {
      if (sat.userData.id === id) {
        sat.scale.set(1.8, 1.8, 1.8);
        sat.material = this.clayMat;
      } else {
        sat.scale.set(0.8, 0.8, 0.8);
        sat.material = this.graphiteMat;
      }
    });
  }

  resetDisciplineHighlight() {
    this.satellites.forEach((sat) => {
      sat.scale.set(1, 1, 1);
      sat.material = (sat.userData.id % 2 === 0) ? this.clayMat : this.graphiteMat;
    });
  }

  update(time, delta) {
    // Stately physical rotation (no frantic spinning)
    this.masterGroup.rotation.y = time * 0.045;
    this.masterGroup.rotation.x = Math.sin(time * 0.025) * 0.07;

    if (this.ring1 && this.ring2) {
      this.ring1.rotation.z = time * 0.035;
      this.ring2.rotation.z = -time * 0.028;
    }

    // Gentle floating dust drift
    if (this.dustGeo) {
      const pos = this.dustGeo.attributes.position.array;
      for (let i = 0; i < this.dustCount; i++) {
        const i3 = i * 3;
        pos[i3 + 1] += Math.sin(time + i) * 0.003;
        pos[i3] += Math.cos(time * 0.5 + i) * 0.002;
      }
      this.dustGeo.attributes.position.needsUpdate = true;
    }

    // Satellite rotation in Chapter 05
    if (this.disciplinesGroup && this.disciplinesGroup.visible) {
      this.disciplinesGroup.rotation.z = time * 0.06;
    }
  }
}
