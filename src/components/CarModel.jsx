import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export default function CardModel() {
  const gltf = useLoader(GLTFLoader, "/models/car1/scene.gltf");
  return <primitive object={gltf.scene} />;
}
