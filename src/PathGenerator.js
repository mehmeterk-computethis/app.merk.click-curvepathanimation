import React, {Component,useRef, useState,useHotkeys,useEffect} from 'react'
import { useControls,folder } from 'leva'
import {Canvas, useFrame, scene} from '@react-three/fiber';
import {PerspectiveCamera,GizmoHelper,GizmoViewport,TransformControls,OrbitControls} from '@react-three/drei'
import * as THREE from 'three'
import {Perf} from "r3f-perf";
import Animator from '../src/components/atoms/pages/pathgenerator/animator.js';
import Animation from '../src/components/atoms/pages/pathgenerator/animation.js';


function Follower(props){ //Object of choice to follow path
  const mesh= useRef(); //give access to the THREE.Mesh object
    mesh.name="Follower" //Name not compulsory
  return (
    <group ref={mesh}>
    <mesh scale={1}>
    <boxGeometry args={[1,1,1]}/>
    <meshStandardMaterial color={'skyblue'}/>
    </mesh>
    </group>
  );
}

export default function PathGenerator(){ //Final App, used in navigation component
  return (
    <div className="PathGenerator App">
    <Canvas>
    <PerspectiveCamera makeDefault position={[0,0,20]}/>
    <GizmoHelper
     alignment="top-left"
     margin={[80, 80]}
    >
    <GizmoViewport axisColors={['red', 'green', 'blue']} labelColor="white" />
    </GizmoHelper>
        <Animator debug={true} startPos={{x:0,y:0,z:0}}>
            <Follower  key={0} target={true}/>
            <Animation
              key={1}
              name="Start Sequence"
              targetPos={{x:5,y:5,z:0}}
              curve={[0,0,10,0]}
              cpnt1={{x:-5,y:15,z:-10}}
              cpnt2={{x:20,y:15,z:10}}
              detail={30}
              duration={1} /**/
              playing={false}/>
              <Animation
                key={2}
                name="Second Sequence"
                targetPos={{x:5,y:0,z:0}}
                curve={[0,0,10,0]}
                cpnt1={{x:-5,y:15,z:-15}}
                cpnt2={{x:20,y:15,z:10}}
                detail={30}
                duration={2}/**/
                playing={false}/>
                <Animation
                  key={3}
                  name="Third Sequence"
                  targetPos={{x:10,y:-5,z:0}}
                  curve={[0,0,10,0]}
                  cpnt1={{x:-5,y:15,z:-15}}
                  cpnt2={{x:20,y:15,z:10}}
                  detail={30}
                  duration={2}/**/
                  playing={false}/>
         </Animator>

         <ambientLight intensity={0.1} />
         <directionalLight />
          <OrbitControls makeDefault />
          <Perf position='bottom-left'/>
       </Canvas>
     </div>
  );
}
