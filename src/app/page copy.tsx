"use client";
import Image from "next/image";

// import { useFrame, useThree } from "@react-three/fiber";
import Aframe from "../../node_modules/aframe/dist/aframe-v1.6.0";
import * as THREE from "three";
import * as THREEx from "../../node_modules/@ar-js-org/ar.js/three.js/build/ar-threex-location-only";

import { useEffect, useRef, useState } from "react";
export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isInitCanvas, setIsInitCanvas] = useState(false);
  function main() {
    // if (!canvasRef?.current) return;
    // if (isInitCanvas) return;
    const canvas = document.querySelector("#canvas1");
    // const canvas = canvasRef.current as HTMLCanvasElement;
    const scene = new THREE.Scene();
    // fov(수직시야) aspect(종횡비), near(근처 평면) ,far(카메라 프리스텀 먼 평면)
    const camera = new THREE.PerspectiveCamera(60, 1.33, 0.1, 100000);

    const renderer = new THREE.WebGLRenderer({ canvas: canvas });
    const cam = new THREEx.WebcamRenderer(renderer);
    const arjs = new THREEx.LocationBased(scene, camera);

    // const cam = new THREEx.WebcamRenderer(renderer, "#video1");
    const geom = new THREE.BoxGeometry(20, 20, 20);
    const mtl = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const box = new THREE.Mesh(geom, mtl);

    const deviceOrientationControls = new THREEx.DeviceOrientationControls(
      camera
    );

    arjs.add(box, 126.877696, 37.4931456);

    // arjs.fakeGps(126.877696 - 0.72, 37.4931456);
    arjs.startGps();

    function render() {
      renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
      const aspect = canvas.clientWidth / canvas.clientHeight;
      camera.aspect = aspect;
      camera.updateProjectionMatrix();

      console.log(cam.cameraWebcam);

      deviceOrientationControls.update();

      cam.update();

      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
    deviceOrientationControls.update();

    renderer.render(scene, camera);

    setIsInitCanvas(true);

    //마우스회전
    // const degToRad = (v: number) => Math.PI / v;
    // const rotationStep = degToRad(2);

    // let mousedown = false,
    //   lastX = 0;

    // window.addEventListener("mousedown", (e) => {
    //   mousedown = true;
    // });

    // window.addEventListener("mouseup", (e) => {
    //   mousedown = false;
    // });

    // window.addEventListener("mousemove", (e) => {
    //   if (!mousedown) return;
    //   if (e.clientX < lastX) {
    //     camera.rotation.y -= rotationStep;
    //     if (camera.rotation.y < 0) {
    //       camera.rotation.y += 2 * Math.PI;
    //     }
    //   } else if (e.clientX > lastX) {
    //     camera.rotation.y += rotationStep;
    //     if (camera.rotation.y > 2 * Math.PI) {
    //       camera.rotation.y -= 2 * Math.PI;
    //     }
    //   }
    //   lastX = e.clientX;
    // });
  }
  // }, [canvasRef]);
  useEffect(() => {
    main();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {/* <div style={{ width: "100%", height: "100%" }}> */}
      {/* <canvas ref={canvasRef} id="canvas1" /> */}
      <canvas
        id="canvas1"
        ref={canvasRef}
        onClick={main}
        width={"100%"}
        height={"100%"}
        style={{ backgroundColor: "black", width: "100%", height: "100%" }}
      ></canvas>

      {/* <video id="video1" /> */}
      {/* </div> */}
    </main>
  );
}
