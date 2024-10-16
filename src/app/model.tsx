"use client";
import { Gltf } from '@react-three/drei';
import { useRef } from 'react';


export default function Model(props) {
  const groupRef = useRef();
  
  
  //   console.log(materials);
  //   const keys = Object.keys(materials);
  return (
    <group   dispose={null}>
      <Gltf {...props} isGroup={true} src={props.url} />
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

// useGLTF.preload(url);
