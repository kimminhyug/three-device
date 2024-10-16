"use client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import * as THREE from "three";
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { Player } from "@/player";
import {
  Gltf,
  Hud,
  KeyboardControls,
  KeyboardControlsEntry,
  MapControlsProps,
  MeshReflectorMaterial,
  OrthographicCamera,
  PerformanceMonitor,
  PerspectiveCamera,
  PointerLockControls,
  RenderTexture,
  SpotLight,
  Svg,
  Text,
  useCursor,
  useTexture
} from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { useLocation, useRoute } from "wouter";
import { Ground } from "./Ground";
import { useKeyboardControl } from "./useKeyboradControl";
// const GOLDENRATIO = 1.61803398875;
const GOLDENRATIO = 1;
const defaultX = 4;
const defaultYgap = 0.5;
const defaultZ = 1;
const defaultZgap = 2.5;
const k3200 = {id:'PAS K3-3200',size:'428 x 458 x 44 mm',memory:'16 GB',ssd:'120GB','throughput':'2Gbps / 6Gbps',concurrentSessions:'16,000,000',cps:'520,000'};
const k5200={
  id:'PAS K5-5200',size:'428 x 508 x 44 mm'
  ,memory:'16 GB',ssd:'120GB'
  ,throughput:'16 Gbps / 12 Gbps'
  ,concurrentSessions:'18,000,000'
  ,cps:'700,000'
}
const k4300={
  id:'PAS K4-4300',size:'428 x 458 x 44 mm'
    ,memory:'16 GB',ssd:'120GB'
    ,throughput:'18 Gbps / 16 Gbps'
    ,concurrentSessions:'16,000,000'
    ,cps:'800,000'
}

const getLeftDataSet = (count, x = 1, zIndex = 0, rotateY = 2, title = "") => {
  return new Array(count).fill(undefined).map((_, idx) => {
    const userdata = title === "PAS K4-4300"?
    k4300
    :title==="PAS K3-3200"?k3200:k5200

    
    return {
      position: [
        -1 * defaultX * x,
        defaultYgap * idx,
        defaultZ * defaultZgap * zIndex,
      ],
      rotation: [0, Math.PI / rotateY, 0],
      url: "/cisco2/scene.gltf",
      id: title,
      userdata:userdata
      //  `Switch Model ${idx}`,
    };
  });
};
const getRightDataSet = (count, x = 1, zIndex = 0, rotateY = 2) => {
  return new Array(count).fill(undefined).map((_, idx) => {
    return {
      position: [
        defaultX * x,
        defaultYgap * idx,
        defaultZ * defaultZgap * zIndex,
      ],
      rotation: [0, Math.PI / rotateY, 0],
      url: "/cisco2/scene.gltf",
      id: `Switch Model ${idx}`,
      userdata:""
    };
  });
};
const leftData = [
  ...getLeftDataSet(8),
  ...getLeftDataSet(8, 1, 2.5),
  ...getLeftDataSet(8, 2, 3),
];

const leftK3Models = getLeftDataSet(1, 1, 1.1, 2, "PAS K3-3200");
const leftK4Models = getLeftDataSet(1, 1, 0, 2, "PAS K4-4300");
const leftK5Models = getLeftDataSet(1, 1, 2.2, 2, "PAS K5-5200");

const rightData = [
  ...getRightDataSet(8),
  ...getRightDataSet(8, 1),
  ...getRightDataSet(8, 2),
];

const dataSet = [
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
];

const getFirstObjectData = (
  data,
  index,
  property = "position"
): number | number[] => {
  if (index !== 0 && !index) return data[0][property] as number[];
  return data[0][property][index] as number;
};
const getLastObjectData = (
  data,
  index,
  property = "position"
): number | number[] => {
  if (index !== 0 && !index) return data[data.length - 1][property] as number[];
  return data[data.length - 1][property][index] as number;
};
export default function HomeWorld() {
  const mapControlRef = useRef<MapControlsProps>({});
  const scene = new THREE.Scene();
  const [item, setItem] = useState();
  const [dpr, setDpr] = useState(1.5);
  const [camPosition, setCamPosition] = useState([]);
  const leftCenter =
    (getFirstObjectData(leftData, 2) + getLastObjectData(leftData, 2)) /
      defaultZgap +
    0.5;
  const rightCenter =
    (getFirstObjectData(rightData, 2) + getLastObjectData(rightData, 2)) /
      defaultZgap +
    0.5;
  const { forward, backward, left, right, jump } = useKeyboardControl();
  const getCameraPosition = () => {
    if (!mapControlRef?.current) {
      return { x: null, y: null, z: null };
    }
    const position = mapControlRef.current.target;

    return position;
  };
  const setCameraPosition = (x, y, z) => {
    if (!mapControlRef?.current) {
      return { x: null, y: null, z: null };
    }
    const position = mapControlRef.current.target as THREE.Vector3;

    //  position.set(position.x,position.y,position.z)
  };
  const map = useMemo<KeyboardControlsEntry<any>[]>(
    () => [
      { name: "forward", keys: ["ArrowUp", "KeyW"] },
      { name: "backward", keys: ["ArrowDown", "KeyS"] },
      { name: "left", keys: ["ArrowLeft", "KeyA"] },
      { name: "right", keys: ["ArrowRight", "KeyD"] },
      { name: "jump", keys: ["Space"] },
    ],
    []
  );

  return (
    // dpr pixel 비율
    <KeyboardControls
      map={[
        { name: "forward", keys: ["ArrowUp", "w", "W"] },
        { name: "backward", keys: ["ArrowDown", "s", "S"] },
        { name: "left", keys: ["ArrowLeft", "a", "A"] },
        { name: "right", keys: ["ArrowRight", "d", "D"] },
        { name: "jump", keys: ["Space"] },
      ]}
    >
      <Canvas dpr={[1, 2]}>
        <PointerLockControls />
        {/* <pointLight castShadow intensity={0.8} position={[0, 0, 0]} /> */}
        <Physics gravity={[0, -30, 0]}>
          <ViewHud
          item={item}
            getCameraPosition={getCameraPosition}
            setCameraPosition={setCameraPosition}
          />
          <PerformanceMonitor
            onIncline={() => setDpr(2)}
            onDecline={() => setDpr(1)}
          />
          <Ground />
          <Player />

          {/* <OrbitControls zoomSpeed={1} screenSpacePanning /> */}
          <color attach="background" args={["#191920"]} />
          {/* <fog attach="fog" args={["#191920", 0, 15]} /> */}

          {/* <ambientLight intensity={Math.PI / 2} /> */}
          <group position={[0, -0.5, 0]}>
            <Frames setItem={setItem} title={"K2 Model"} images={leftK4Models} />
            <Frames setItem={setItem} title={"K3 Model"} images={leftK3Models} />
            <Frames setItem={setItem} title={"K5 Model"} images={leftK5Models} />
 
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
          </group>
        </Physics>
      </Canvas>
    </KeyboardControls>
  );
}
const Frames = ({
  title = "",setItem,
  images,
  q = new THREE.Quaternion(),
  p = new THREE.Vector3(),
  
}) => {
  const ref = useRef<any>();
  const clicked = useRef<any>();
  const [, params] = useRoute("/item/:id");
  const [, setLocation] = useLocation();
  const leftCenter =
    (getFirstObjectData(images, 2) + getLastObjectData(images, 2)) /
      defaultZgap +
    0.5;
  const leftTitlePosition = [
    getFirstObjectData(images, 0),
    getLastObjectData(images, 2) / GOLDENRATIO,
    leftCenter,
  ];
  const [hovered, hover] = useState(false);
  useCursor(hovered);
  useEffect(()=>{
    hovered&&setItem(images[0].userdata)
  },[hovered])
  
  // const [, params] = useRoute("/item/:id");
  // const [_, setLocation] = useLocation();
  // useEffect(() => {
  //   // clicked.current = ref.current.getObjectByName("ID1");
  //   if (clicked.current) {
  //     clicked.current.parent.updateWorldMatrix(true, true);
  //     clicked.current.parent.localToWorld(p.set(0, GOLDENRATIO / 2, 1.25));
  //     clicked.current.parent.getWorldQuaternion(q);
  //   } else {
  //     p.set(0, 0, 5.5);
  //     q.identity();
  //   }
  // });

  //fix 시키는놈
  // useFrame((state, dt) => {
  //   easing.damp3(state.camera.position, p, 0.4, dt);
  //   easing.dampQ(state.camera.quaternion, q, 0.4, dt);
  // });
  return (
    <>
      {images.map(
        (props,id) => (
          <mesh onPointerOver={(e) => (e.stopPropagation(), hover(true))}
          onPointerOut={() => hover(false)} >  
     
        
          {/* <Gltf isGroup={true}   raycast={() => null} scale={[5,3,3]}
          position={props.position}
          // rotation={getFirstObjectData(leftData,null,'rotation').map((d)=>{return d*135})}
          // position={[getFirstObjectData(leftData,0)+0.1, 0, getFirstObjectData(leftData,2)]}
          src={"/server_rack/scene.gltf"}/> */}
          <Frame id={props.id} key={id} {...props} />
      
          </mesh>
           ) /* prettier-ignore */
      )}
    </>
  );
};
const Stage = () => {
  const geometry = new THREE.CylinderGeometry(6, 12, 7, 32);
  const material = new THREE.MeshBasicMaterial({ color: 0xfffcf0 });

  // const props = useTexture(
  //   "/texture/Poliigon_StoneQuartzite_8060_BaseColor.jpg"
  // );
  const props = useTexture({
    map: "/texture/Poliigon_StoneQuartzite_8060_Roughness.jpg",
  });
  console.log(props);

  return (
    <>
      <mesh
        name="cylinder"
        scale={[0.1, 0.1, 0.1]}
        position={[0, 0.3, 0]}
        // scale={[0.1, 0.1, 0.1]}
        // position={[0, 0.3, 0]}
        // geometry={geometry}
        // material={material}
      >
        <cylinderGeometry args={[5, 12, 9]} />
        {/* <sphereBufferGeometry args={[1, 100, 100]} /> */}
        <meshStandardMaterial
          metalness={1}
          roughness={1}
          map={props.map}
          // normalMap={armNormalMap}
          // roughnessMap={armRoughnessMap}
          // metalnessMap={armMetalnessMap}
        />
        {/* <meshStandardMaterial {...props}  /> */}
      </mesh>
    </>
  );
};
function Frame({ id, url, c = new THREE.Color(), ...props }) {
  const image = useRef();
  const ref = useRef();

  // const frame = useRef();
  const lightRef = useRef();
  const [target] = useState(() => new THREE.Object3D());
  // const [, params] = useRoute("/item/:id");
  const [hovered, hover] = useState(false);
  const [rnd] = useState(() => Math.random());
  const clicked = useRef<any>();
  const [params, setParams] = useState({ id: "" });
  // const name = getUuid(url);
  // const isActive = params?.id === name;
  const geometry = new THREE.CylinderGeometry(6, 12, 7, 32);
  const material = new THREE.MeshBasicMaterial({ color: 0xfffcf0 });
  let p = new THREE.Vector3();
  let q = new THREE.Quaternion();
  useEffect(() => {
    clicked.current = ref.current.getObjectByName("test1");
    if (clicked.current) {
      clicked.current.parent.updateWorldMatrix(true, true);
      clicked.current.parent.localToWorld(p.set(0, GOLDENRATIO / 2, 1.25));
      clicked.current.parent.getWorldQuaternion(q);
    } else {
      p.set(0, 0, 5.5);
      q.identity();
    }
  });

  // fix 시키는놈
  // useFrame((state, dt) => {
  //   easing.damp3(state.camera.position, p, 0.4, dt);
  //   easing.dampQ(state.camera.quaternion, q, 0.4, dt);
  // });

  useCursor(hovered);
  // useFrame((state, dt) => {
  //   image.current.parent.material.zoom =
  //     2 + Math.sin(rnd * 10000 + state.clock.elapsedTime / 3) / 2;
  //   easing.damp3(
  //     image.current.scale,
  //     [0.85 * (hovered ? 0.85 : 1), 0.9 * (hovered ? 0.905 : 1), 1],
  //     0.1,
  //     dt
  //   );
  //   easing.dampC(
  //     image.current.parent.material.color,
  //     hovered ? "orange" : "white",
  //     0.1,
  //     dt
  //   );
  // });

  return (
    <>
      {/* <spotLight position={[3, 20,3]} isSpotLight target={image.current} angle={0.15} penumbra={1} decay={1} intensity={Math.PI} /> */}
      <group ref={ref} name="frame" {...props}>
        <SpotLight
          target={image.current}
          ref={lightRef}
          position={[0, 3, 3]}
          distance={35}
          angle={2}
          intensity={Math.PI}
          // attenuation={10}
          anglePower={5} // Diffuse-cone anglePower (default: 5)
        ></SpotLight>
        <Stage />
 
        <mesh
          name="test1"
          // name={name}
          isMesh
          castShadow
          userData={{id:id,size :'40 * 40 * 12'}}
          onClick={(e) => (
            e.stopPropagation(),
            setParams({
              id: clicked.current === e.object ? "/" : "/item/" + e.object.name,
            })
          )}
          onPointerOver={(e) => (e.stopPropagation(), hover(true))}
          onPointerOut={() => hover(false)}
          // scale={[1, 1, 1]}
          position={[0, 1, 0]}
        >
          <Gltf
            raycast={() => null}
            ref={image}
            position={[0, 0, 0]}
            name="test2"
            src={url}
          ></Gltf>
        </mesh>
        <Text
          // maxWidth={0.1}
          anchorX="center"
          anchorY="top"
          position={[0, 2, 0]}
          fontSize={0.3}
        >
          {id}
        </Text>
      
          
      </group>
    </>
  );
}

function ViewHud({ item={},getCameraPosition, setCameraPosition, renderPriority = 1 }) {
  const mesh = useRef(null);
  const { camera, viewport } = useThree();
  const [hovered, hover] = useState(null);
  const dataTextRef = useRef();
  useFrame((e, d) => {
    // Spin mesh to the inverse of the default cameras matrix
    // matrix.copy(camera.matrix).invert()
    // mesh.current.quaternion.setFromRotationMatrix(matrix)
  });

  const keys= Object.keys(item||{});
  const getRowPostionH=(top=4.5,index,fontSize=0.2)=>{
    return top-index*fontSize
  }
  // const tta=  camPosition?JSON.stringify(camPosition)?.trim()??"-":"-"
console.log(item,keys)
  return (
    <Hud renderPriority={renderPriority}>
      {/* <ambientLight intensity={Math.PI / 2} /> */}

      {/* <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} /> */}
      <PerspectiveCamera makeDefault position={[0, 0, 10]} />

      <Svg
        fillMaterial={{
          wireframe: false,
        }}
        // position={[viewport.width / 2 + 0.1, -viewport.height / 2 - 0.3, 0]}
        position={[7.8, -4, 0]}
        scale={0.004}
        src="/PIOLINK_CI_light.svg"
        strokeMaterial={{
          wireframe: false,
        }}
      />

      <Text anchorX={'left'} position={[7.2, getRowPostionH(4.5,0), 0]} fontSize={0.2} >Id</Text> 
      <Text anchorX={'left'} position={[7.5,getRowPostionH(4.5,0), 0]} fontSize={0.2}>{item["id"]}</Text> 

      <Text anchorX={'left'} position={[7, getRowPostionH(4.5,1), 0]} fontSize={0.2} >Size</Text> 
      <Text anchorX={'left'} position={[7.5, getRowPostionH(4.5,1), 0]} fontSize={0.2}>{item["size"]}</Text> 

      <Text anchorX={'left'} position={[6.1,getRowPostionH(4.5,2), 0]} fontSize={0.2} >Memory (RAM)</Text> 
      <Text anchorX={'left'} position={[7.5,getRowPostionH(4.5,2), 0]} fontSize={0.2}>{item["memory"]}</Text> 

      <Text anchorX={'left'} position={[7,  getRowPostionH(4.5,3), 0]} fontSize={0.2} >SSD</Text> 
      <Text anchorX={'left'} position={[7.5,getRowPostionH(4.5,3), 0]} fontSize={0.2}>{item["ssd"]}</Text> 

      <Text anchorX={'left'} position={[5.7, getRowPostionH(4.5,4), 0]} fontSize={0.2} >Throughput (L4/L7)</Text> 
      <Text anchorX={'left'} position={[7.5, getRowPostionH(4.5,4), 0]} fontSize={0.2}>{item["throughput"]}</Text> 

      <Text anchorX={'left'} position={[5.5,getRowPostionH(4.5,5), 0]} fontSize={0.2} >Concurrent Sessions</Text> 
      <Text anchorX={'left'} position={[7.5,getRowPostionH(4.5,5), 0]} fontSize={0.2}>{item["concurrentSessions"]}</Text> 

      <Text anchorX={'left'} position={[6.2, getRowPostionH(4.5,6), 0]} fontSize={0.2} >L4 CPS (max)</Text> 
      <Text anchorX={'left'} position={[7.5, getRowPostionH(4.5,6), 0]} fontSize={0.2}>{item["cps"]}</Text> 
      

    </Hud>
  );
}
function FaceMaterial({ children, index, ...props }) {
  const hovered = useContext(context);
  return (
    <meshStandardMaterial
      attach={`material-${index}`}
      color={hovered === index ? "hotpink" : "orange"}
      {...props}
    >
      <RenderTexture frames={6} attach="map" anisotropy={16}>
        <color attach="background" args={["white"]} />
        <OrthographicCamera
          makeDefault
          left={-1}
          right={1}
          top={1}
          bottom={-1}
          position={[0, 0, 10]}
          zoom={0.5}
        />
        <Text font="ubuntu" color="black">
          {children}
        </Text>
      </RenderTexture>
    </meshStandardMaterial>
  );
}
const context = createContext();
