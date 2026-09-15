import { useEffect, useRef } from 'react';
import { createMagicRings } from './MagicRings.js';
import './MagicRings.css';

export default function MagicRings({
  color = '#fc42ff',
  colorTwo = '#42fcff',
  speed = 1,
  ringCount = 6,
  attenuation = 10,
  lineThickness = 2,
  baseRadius = 0.35,
  radiusStep = 0.1,
  scaleRate = 0.1,
  opacity = 1,
  blur = 0,
  noiseAmount = 0,
  rotation = 0,
  ringGap = 1.5,
  fadeIn = 0.7,
  fadeOut = 0.5,
  followMouse = false,
  mouseInfluence = 0.2,
  hoverScale = 1.0,
  parallax = 0.05,
  clickBurst = false,
  alphaMode = 'luminance',
}) {
  const mountRef = useRef(null);
  const controllerRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    controllerRef.current = createMagicRings(mountRef.current, {
      color,
      colorTwo,
      speed,
      ringCount,
      attenuation,
      lineThickness,
      baseRadius,
      radiusStep,
      scaleRate,
      opacity,
      blur,
      noiseAmount,
      rotation,
      ringGap,
      fadeIn,
      fadeOut,
      followMouse,
      mouseInfluence,
      hoverScale,
      parallax,
      clickBurst,
      alphaMode,
    });

    return () => {
      if (controllerRef.current) {
        controllerRef.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (controllerRef.current) {
      controllerRef.current.updateProps({
        color,
        colorTwo,
        speed,
        ringCount,
        attenuation,
        lineThickness,
        baseRadius,
        radiusStep,
        scaleRate,
        opacity,
        blur,
        noiseAmount,
        rotation,
        ringGap,
        fadeIn,
        fadeOut,
        followMouse,
        mouseInfluence,
        hoverScale,
        parallax,
        clickBurst,
        alphaMode,
      });
    }
  }, [
    color, colorTwo, speed, ringCount, attenuation, lineThickness,
    baseRadius, radiusStep, scaleRate, opacity, blur, noiseAmount,
    rotation, ringGap, fadeIn, fadeOut, followMouse, mouseInfluence,
    hoverScale, parallax, clickBurst, alphaMode,
  ]);

  return (
    <div
      ref={mountRef}
      className="magic-rings-container"
      style={blur > 0 ? { filter: `blur(${blur}px)` } : undefined}
    />
  );
}
