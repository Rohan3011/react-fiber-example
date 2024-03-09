import * as THREE from "three";
import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { applyProps, useFrame } from "@react-three/fiber";
import { useGLTF, useScroll } from "@react-three/drei";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(useGSAP);

export function Lamborghini(props) {
  const { scene, nodes, materials } = useGLTF("/models/lambo.glb");

  const myRef = useRef();
  const tl = useRef();

  const scroll = useScroll();

  useFrame(() => {
    tl.current.seek(scroll.offset * tl.current.duration());
  });

  useLayoutEffect(() => {
    tl.current = gsap.timeline();

    tl.current.to(myRef.current.position, {
      duration: 5,
      x: 5,
      z: 2,
    });
  }, []);

  useMemo(() => {
    // ⬇⬇⬇ All this is probably better fixed in Blender ...
    Object.values(nodes).forEach((node) => {
      if (node.isMesh) {
        // Fix glass, normals look messed up in the original, most likely deformed meshes bc of compression :/
        if (node.name.startsWith("glass")) node.geometry.computeVertexNormals();

        // Fix logo, too dark
        if (node.name === "silver_001_BreakDiscs_0")
          node.material = applyProps(materials.BreakDiscs.clone(), {
            color: "#ddd",
          });
      }
    });
    // Fix windows, they have to be inset some more
    nodes["glass_003"].scale.setScalar(2.7);
    // Fix inner frame, too light
    applyProps(materials.FrameBlack, {
      metalness: 0.75,
      roughness: 0,
      color: "black",
    });
    // Wheels, change color from chrome to black matte
    applyProps(materials.Chrome, { metalness: 1, roughness: 0, color: "#333" });
    applyProps(materials.BreakDiscs, {
      metalness: 0.2,
      roughness: 0.2,
      color: "#555",
    });
    applyProps(materials.TiresGum, {
      metalness: 0,
      roughness: 0.4,
      color: "#181818",
    });
    applyProps(materials.GreyElements, { metalness: 0, color: "#292929" });
    // Make front and tail LEDs emit light
    applyProps(materials.emitbrake, {
      emissiveIntensity: 3,
      toneMapped: false,
    });
    applyProps(materials.LightsFrontLed, {
      emissiveIntensity: 3,
      toneMapped: false,
    });
    // Paint, from yellow to black
    nodes.yellow_WhiteCar_0.material = new THREE.MeshPhysicalMaterial({
      roughness: 0.3,
      metalness: 0.05,
      color: props.carColor,
      envMapIntensity: 0.75,
      clearcoatRoughness: 0,
      clearcoat: 1,
    });
  }, [nodes, materials, props]);
  return <primitive ref={myRef} object={scene} {...props} />;
}
