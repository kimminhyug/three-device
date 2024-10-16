"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import {
  Gltf,
  MapControls,
  MeshReflectorMaterial,
  PerformanceMonitor,
  Text,
  useCursor
} from "@react-three/drei";
import { easing } from "maath";
const GOLDENRATIO = 1.61803398875;
const defaultX= 4;
const defaultYgap=0.5;
const defaultZ=1;
const defaultZgap=4;
const getLeftDataSet = (count,zIndex=0)=>{
  return new Array(count).fill(undefined).map((_,idx)=>{
    return { position: [-1*defaultX, defaultYgap*idx, defaultZ*defaultZgap*zIndex], rotation: [0, Math.PI / 2, 0], url: "/cisco2/scene.gltf" }
  })
}
const getRightDataSet = (count,zIndex=0)=>{
  return new Array(count).fill(undefined).map((_,idx)=>{
    return { position: [defaultX, defaultYgap*idx, defaultZ*defaultZgap*zIndex], rotation: [0, Math.PI / 2, 0], url: "/cisco2/scene.gltf" }
  })
}
const leftData = 
  [...getLeftDataSet(8),
...getLeftDataSet(8,1),
...getLeftDataSet(8,2),]
const leftK3Models = getLeftDataSet(8);
const leftK4Models = getLeftDataSet(8,1);
const leftK5Models = getLeftDataSet(8,2);
const leftNXModels = getLeftDataSet(8,3);
const rightData = 
  [...getRightDataSet(8),
    ...getRightDataSet(8,1),
    ...getRightDataSet(8,2),]

const dataSet =[
  
// Back
// { position: [-2, 0, -0.6], rotation: [0, 0, 0], url: "/cisco2/scene.gltf" },
// { position: [4, 0, -0.6], rotation: [0, 0, 0], url: "/cisco2/scene.gltf" },
// // 좌
// { position: [-1*defaultX, 0, 1], rotation: [0, Math.PI / 2, 0], url: "/cisco2/scene.gltf" },
// { position: [-1*defaultX, 0.5, 1], rotation: [0, Math.PI / 2, 0], url: "/cisco2/scene.gltf" },
// { position: [-1*defaultX, 1, 1], rotation: [0, Math.PI / 2, 0], url: "/cisco2/scene.gltf" },
// // 우
// { position: [defaultX, 0, 1], rotation: [0, -Math.PI / 2, 0], url: "/cisco2/scene.gltf" },
// { position: [defaultX, 0.5, 1], rotation: [0, -Math.PI / 2, 0], url: "/cisco2/scene.gltf" },
// { position: [defaultX, 1, 1], rotation: [0, -Math.PI / 2, 0], url: "/cisco2/scene.gltf" }
...leftData,
...rightData,


]
console.log(dataSet)
const getFirstObjectData = (data,index,property="position"):number|number[]=>{
  if(index!== 0 && !index) return data[0][property] as number[]
  return data[0][property][index] as number
}
const getLastObjectData = (data,index,property="position"):number|number[]=>{
  if(index!== 0&&!index) return data[data.length-1][property] as number[]
  return data[data.length-1][property][index] as number
}
export default function Home() {
  const scene = new THREE.Scene();
  const [dpr, setDpr] = useState(1.5)
const leftCenter = (getFirstObjectData(leftData,2)+getLastObjectData(leftData,2))/defaultZgap+0.5
const rightCenter = (getFirstObjectData(rightData,2)+getLastObjectData(rightData,2))/defaultZgap+0.5
const leftTitlePosition = [getFirstObjectData(leftData,0),getLastObjectData(leftData,2)/GOLDENRATIO,leftCenter]
const rightTitlePosition = [getFirstObjectData(rightData,0),getLastObjectData(rightData,2)/GOLDENRATIO,rightCenter]
const [cameraPosition, setCameraPosition] = useState([0, 20, -10]);
  // return <primitive object={gltf.scene} />
  return (
    // dpr pixel 비율
    <Canvas dpr={dpr} camera={{ fov: 60, position: [0, 20, -10] }}>
            <PerformanceMonitor onIncline={() => setDpr(2)} onDecline={() => setDpr(1)} />
      {/* <OrbitControls zoomSpeed={1} screenSpacePanning /> */}
      <MapControls enableZoom />
      <color attach="background" args={["#191920"]} />
      {/* <fog attach="fog" args={["#191920", 0, 15]} /> */}
      <group position={[0, -0.5, 0]}>
        <ambientLight intensity={Math.PI / 2} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          decay={0}
          intensity={Math.PI}
        />
        <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />


      
        <Frames title={"K2 Model"}images={leftK3Models}/>
        <Frames title={"K3 Model"}images={leftK4Models} />
        <Frames title={"K5 Model"}images={leftK5Models} />
        {/* <Frames title={"NX"}images={leftNXModels} /> */}
        
        
        
        
        
        {/* <Box
          position={[0, 0, 0]}
          onClick={(event) => {
            console.log(event);
          }}
        /> */}
        {/* { position: [-0.8, 0, -0.6], rotation: [0, 0, 0], url: "/cisco2/scene.gltf" }, */}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[50, 50]} />
          <MeshReflectorMaterial
            blur={[300, 100]}
            resolution={2048}
            mixBlur={1}
            mixStrength={80}
            roughness={1}
            depthScale={1.2}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.4}
            color="#050505"
            metalness={0.5}
            mirror={0}
          />
        </mesh>
        {/* <Box position={[-1.2, 0, 0]} />
        <Box position={[0, 2, 15]} /> */}
      </group>
    </Canvas>
  );
}
const Frames = ({
  title="",
  images,
  q = new THREE.Quaternion(),
  p = new THREE.Vector3(),
}) => {
  const ref = useRef<any>();
  const clicked = useRef<any>();
  const leftCenter = (getFirstObjectData(images,2)+getLastObjectData(images,2))/defaultZgap+0.5;
const leftTitlePosition = [getFirstObjectData(images,0),getLastObjectData(images,2)/GOLDENRATIO,leftCenter];



  // const [, params] = useRoute("/item/:id");
  // const [_, setLocation] = useLocation();
  useEffect(() => {
    clicked.current = ref.current.getObjectByName("ID1");
    if (clicked.current) {
      clicked.current.parent.updateWorldMatrix(true, true);
      clicked.current.parent.localToWorld(p.set(0, GOLDENRATIO / 2, 1.25));
      clicked.current.parent.getWorldQuaternion(q);
    } else {
      p.set(0, 0, 5.5);
      q.identity();
    }
  });
  //fix 시키는놈
  // useFrame((state, dt) => {
  //   easing.damp3(state.camera.position, p, 0.4, dt);
  //   easing.dampQ(state.camera.quaternion, q, 0.4, dt);
  // });
  return (
    <group
      ref={ref}
      onClick={(e) => e.stopPropagation()}
      // onPointerMissed={() => setLocation("/")}
    >
      
         
      
      {/* <Model2 /> */}
      {/* <Box position={[-1.2, 0, 0]} /> */}
      {/* <primitive object={gltf.scene} scale={1} group={ref} /> */}
      <Gltf isGroup={true}   raycast={() => null} scale={[5,3,3]}
          // position={images[0].position}
          rotation={getFirstObjectData(images,null,'rotation').map((d)=>{return d*135})}
          position={[getFirstObjectData(images,0)+0.1, 0, getFirstObjectData(images,2)]}
          src={"/server_rack/scene.gltf"}/>
                    <Text
        
        // anchorX="right"
        // anchorY="bottom"
        rotation={getFirstObjectData(images,null,'rotation')}
        position={[getFirstObjectData(images,0)+0.1, getLastObjectData(images,1)+4, getFirstObjectData(images,2)]}
        fontSize={1}
        maxWidth={0.1}
      >
        {title}
        
      </Text>
      {
        images.map(
          (props,id) => (
          <>
          {/* <Gltf isGroup={true}   raycast={() => null} scale={[5,3,3]}
          position={props.position}
          // rotation={getFirstObjectData(leftData,null,'rotation').map((d)=>{return d*135})}
          // position={[getFirstObjectData(leftData,0)+0.1, 0, getFirstObjectData(leftData,2)]}
          src={"/server_rack/scene.gltf"}/> */}
          <Frame key={id} {...props} />
          </>
           )/* prettier-ignore */
        )
      }
    </group>
  );
};

function Frame({ url, c = new THREE.Color(), ...props }) {
  const image = useRef();
  // const frame = useRef();
  // const [, params] = useRoute("/item/:id");
  const [hovered, hover] = useState(false);
  const [rnd] = useState(() => Math.random());
  // const name = getUuid(url);
  // const isActive = params?.id === name;

  useCursor(hovered);
  useFrame((state, dt) => {
    image.current.parent.material.zoom =
      2 + Math.sin(rnd * 10000 + state.clock.elapsedTime / 3) / 2;
    easing.damp3(
      image.current.scale,
      [0.85 * (hovered ? 0.85 : 1), 0.9 * (hovered ? 0.905 : 1), 1],
      0.1,
      dt
    );
    easing.dampC(
      image.current.parent.material.color,
      hovered ? "orange" : "white",
      0.1,
      dt
    );
  });
  return (
    <group {...props}>
        {/* <Gltf isGroup={true}   raycast={() => null}
          // ref={image}
          position={[0, 0, 0.7]}
          src={url}/> */}
                  
      <mesh
        // name={name}
        onPointerOver={(e) => (e.stopPropagation(), hover(true))}
        onPointerOut={() => hover(false)}
        scale={[1, GOLDENRATIO, 1]}
        position={[0, GOLDENRATIO / 2, 0]}
      >
        {/* <boxGeometry /> */}
        {/* <meshStandardMaterial
          color="#151515"
          metalness={0.5}
          roughness={0.5}
          envMapIntensity={2}
        /> */}
        {/* <mesh
          // ref={frame}
          raycast={() => null}
          scale={[0.9, 0.93, 0.9]}
          position={[0, 0, 0.2]}
        >
          <boxGeometry />
          <meshBasicMaterial toneMapped={false} fog={false} />
        </mesh> */}

        <Gltf isGroup={true}   raycast={() => null}
          ref={image}
          position={[0, 0, 0.7]}
          src={url}/>
        
      </mesh>
      <Text
        // maxWidth={0.1}
        anchorX="left"
        anchorY="top"
        
        position={[0.55, GOLDENRATIO, 0]}
        fontSize={0.025}
      >
        SWICH MODEL 1
        {/* {name.split("-").join(" ")} */}
      </Text>
    </group>
  );
}

const Box = (props) => {
  const ref = useRef<THREE.Mesh>(null!);
  const [hovered, hover] = useState(false);
  const [clicked, click] = useState(false);
  // useFrame((state, delta) => (ref.current.rotation.x += delta));
  return (
    <mesh
      {...props}
      ref={ref}
      scale={clicked ? 1.5 : 1}
      onClick={(event) => click(!clicked)}
      onPointerOver={(event) => hover(true)}
      onPointerOut={(event) => hover(false)}
    >
      <boxGeometry args={[2, 3, 0]} />
      {/* 그림자 */}
      {/* <planeGeometry args={[50, 50]} /> */}
      <meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
    </mesh>
  );
};
