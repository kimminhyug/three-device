import React, { useRef } from "react";
import { Gltf, useGLTF } from "@react-three/drei";
const cisco1 = "/cisco1/scene.gltf";
export default function Model(props) {
  const groupRef = useRef();
  const gltf = useGLTF(cisco1);
  console.log(gltf);
  //   console.log(materials);
  //   const keys = Object.keys(materials);
  return (
    <group ref={groupRef} {...props} dispose={null}>
      <Gltf isGroup={true} position={[0, 20, -150]} src={cisco1} />
      {/* {keys.map((key) => {
        return (
          <>
            <mesh
              key={key}
              castShadow
              receiveShadow
              geometry={nodes[key]?.geometry}
              material={materials?.[key]}
            />
          </>
        );
      })} */}
      {/* <mesh
        castShadow
        receiveShadow
        geometry={nodes.switch__0.geometry}
        material={materials["switch__0"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.switch__0.geometry}
        material={materials["switch__0"]}
      /> */}
    </group>
  );
}

useGLTF.preload(cisco1);
