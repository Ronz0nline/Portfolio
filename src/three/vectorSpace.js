import * as THREE from 'three';

/**
 * 3D Vector Space & RAG Topology Visualizer
 * Communicates: "Meaning is proximity"
 */

export class VectorSpaceVisualizer {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.scene.add(this.group);
    this.group.visible = false;

    this.pointsCount = 64;
    this.initPoints();
    this.initConnections();
  }

  initPoints() {
    this.coords = [];
    const pointGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(this.pointsCount * 3);
    const colors = new Float32Array(this.pointsCount * 3);

    const ivory = new THREE.Color(0xe8e3d9);
    const clay = new THREE.Color(0xb76545);
    const stone = new THREE.Color(0x8d887e);

    for (let i = 0; i < this.pointsCount; i++) {
      const i3 = i * 3;
      // Clustered manifold distribution
      const cluster = i % 4;
      const cx = (cluster === 0 || cluster === 1 ? 1 : -1) * 2.2;
      const cy = (cluster === 0 || cluster === 2 ? 1 : -1) * 1.5;
      const cz = (Math.random() - 0.5) * 3;

      const x = cx + (Math.random() - 0.5) * 2.2;
      const y = cy + (Math.random() - 0.5) * 2.0;
      const z = cz + (Math.random() - 0.5) * 2.5;

      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;

      this.coords.push(new THREE.Vector3(x, y, z));

      const col = (i === 18 || i === 24 || i === 42) ? clay : (i % 3 === 0 ? ivory : stone);
      colors[i3] = col.r;
      colors[i3 + 1] = col.g;
      colors[i3 + 2] = col.b;
    }

    pointGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    pointGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const pointMat = new THREE.PointsMaterial({
      size: 0.14,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      sizeAttenuation: true
    });

    this.pointCloud = new THREE.Points(pointGeo, pointMat);
    this.group.add(this.pointCloud);
  }

  initConnections() {
    // Connect proximate points
    const linePositions = [];
    const threshold = 1.9;

    for (let i = 0; i < this.pointsCount; i++) {
      for (let j = i + 1; j < this.pointsCount; j++) {
        const dist = this.coords[i].distanceTo(this.coords[j]);
        if (dist < threshold) {
          linePositions.push(
            this.coords[i].x, this.coords[i].y, this.coords[i].z,
            this.coords[j].x, this.coords[j].y, this.coords[j].z
          );
        }
      }
    }

    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));

    this.lineMat = new THREE.LineBasicMaterial({
      color: 0xb76545,
      transparent: true,
      opacity: 0.22
    });

    this.connections = new THREE.LineSegments(lineGeo, this.lineMat);
    this.group.add(this.connections);
  }

  triggerQueryPulse() {
    if (!this.group.visible) return;
    this.lineMat.opacity = 0.65;
    this.group.scale.set(1.1, 1.1, 1.1);

    setTimeout(() => {
      this.lineMat.opacity = 0.22;
      this.group.scale.set(1, 1, 1);
    }, 450);
  }

  setVisible(val) {
    this.group.visible = val;
  }

  update(time) {
    if (!this.group.visible) return;
    this.group.rotation.y = time * 0.05;
    this.group.rotation.x = Math.sin(time * 0.03) * 0.06;
  }
}
