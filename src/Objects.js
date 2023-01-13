import './App.css';
import React, {useRef, useState} from 'react'
import {Canvas, useFrame} from '@react-three/fiber';
import {PerspectiveCamera,PresentationControls} from '@react-three/drei'
import {cicularPosition, angleCalc, lerp} from './cFunctions.js';
import {Perf} from "r3f-perf";




//====================================//
function BaseMesh(props){
  const mesh= useRef(); //give access to the THREE.Mesh object
///  console.log("BaseMesh",Math.sin(props.i)*5);
  var t=1; //All object must have their own t value, usefull for lerping

    useFrame((state,delta)=>(
    //  console.log("BaseMesh",startpos.y),
    t++,//storing time allows us to keep track of loops within the lerp func
    mesh.current.position.x=lerp(t,props.pos[0]-(Math.sin(props.i)*0.25),props.pos[0]+(Math.sin(props.i)*0.25),1.5,"osc-inv"),
    mesh.current.position.y=lerp(t,props.pos[1]-(Math.sin(props.i)*0.25),props.pos[1]+(Math.sin(props.i)*0.25),1.5,"osc"),
    mesh.current.rotation.x=lerp(t,-2.5,2.5,1,"osc"),
    mesh.current.rotation.z=lerp(t,-2.5,2.5,1,"osc-inv"),
    mesh.current.children[1].position.y=lerp(t,-0.5,0.5,Math.sin(props.i),"osc"),
    mesh.current.children[2].position.y=lerp(t,0.5,-0.5,Math.sin(props.i),"osc"),
    mesh.current.children[3].position.x=lerp(t,-0.5,0.5,Math.cos(props.i),"osc-inv"),
    mesh.current.children[4].position.x=lerp(t,0.5,-0.5,Math.cos(props.i),"osc-inv"),
    mesh.current.children[5].position.z=lerp(t,-0.5,0.5,Math.sin(props.i),"osc-inv"),
    mesh.current.children[6].position.z=lerp(t,0.5,-0.5,Math.sin(props.i),"osc-inv")
    ));


    return (
  <group
  ref={mesh}
  scale={[1,1,1]}
  position={props.pos}
  >
      <mesh>
        <boxGeometry attach="geometry"/>
        <meshStandardMaterial  attach="material" color="red" />
      </mesh>
      <mesh scale={[0.5,0.5,0.5]}>
          <sphereGeometry attach="geometry"/>
          <meshStandardMaterial  attach="material" color="orange" />
      </mesh>
      <mesh scale={[0.5,0.5,0.5]}>
          <sphereGeometry attach="geometry"/>
          <meshStandardMaterial  attach="material" color="orange" />
      </mesh>
      <mesh scale={[0.5,0.5,0.5]}>
          <sphereGeometry attach="geometry"/>
          <meshStandardMaterial  attach="material" color="orange" />
      </mesh>
      <mesh scale={[0.5,0.5,0.5]}>
          <sphereGeometry attach="geometry"/>
          <meshStandardMaterial  attach="material" color="orange" />
      </mesh>
      <mesh scale={[0.5,0.5,0.5]}>
          <sphereGeometry attach="geometry"/>
          <meshStandardMaterial  attach="material" color="orange" />
      </mesh>
      <mesh scale={[0.5,0.5,0.5]}>
          <sphereGeometry attach="geometry"/>
          <meshStandardMaterial  attach="material" color="orange" />
      </mesh>
  </group>
    );
}


//====================================//
export default function Objects() {
const locs=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18]; //18 total
const rLimits=[8,14,18]


  //const thing1= new Entity("thing_1",mesh);
//  console.log("Outside",BaseMesh);
  //  {thing1.output()}
  console.log(cicularPosition(5,1));
  console.log("angleCalc",angleCalc(locs.length));
  return (
    <div className="Objects App">
    <Canvas>
    <ambientLight intensity={0.125}/>
       <pointLight intensity={0.5} position={[0, 0, 0]} />
      <PerspectiveCamera makeDefault position={[0,0,35]}/>
      <PresentationControls
        enabled={true} // the controls can be disabled by setting this to false
        global={false} // Spin globally or by dragging the model
        cursor={true} // Whether to toggle cursor style on drag
        snap={false} // Snap-back to center (can also be a spring config)
        speed={1} // Speed factor
        zoom={1.5} // Zoom factor when half the polar-max is reached
        rotation={[0, 0, 0]} // Default rotation
        polar={[0, Math.PI/1.5]} // Vertical limits
        azimuth={[-Infinity, Infinity]} // Horizontal limits
        config={{ mass: 1, tension: 170, friction: 26 }} // Spring config
      >
{locs.slice(0, rLimits[0]).map((loc,index) => (
     <BaseMesh i={index} pos={[cicularPosition(4,angleCalc(rLimits[0])*index).x,9,cicularPosition(4,angleCalc(rLimits[0])*index).y]}/>
   ))}
{locs.slice(0, rLimits[1]).map((loc,index) => (
     <BaseMesh i={index} pos={[cicularPosition(8,angleCalc(rLimits[1])*index).x,6,cicularPosition(8,angleCalc(rLimits[1])*index).y]}/>
   ))}
   {locs.slice(0, rLimits[2]).map((loc,index) => (
        <BaseMesh i={index} pos={[cicularPosition(10,angleCalc(rLimits[2])*index).x,3,cicularPosition(10,angleCalc(rLimits[2])*index).y]}/>
      ))}
      {locs.map((loc,index) => (
           <BaseMesh i={index} pos={[cicularPosition(11,angleCalc(locs.length)*index).x,0,cicularPosition(11,angleCalc(locs.length)*index).y]}/>
         ))}
         {locs.slice(0, rLimits[2]).map((loc,index) => (
              <BaseMesh i={index} pos={[cicularPosition(10,angleCalc(rLimits[2])*index).x,-3,cicularPosition(10,angleCalc(rLimits[2])*index).y]}/>
            ))}
            {locs.slice(0, rLimits[1]).map((loc,index) => (
                 <BaseMesh i={index} pos={[cicularPosition(8,angleCalc(rLimits[1])*index).x,-6,cicularPosition(8,angleCalc(rLimits[1])*index).y]}/>
               ))}
               {locs.slice(0, rLimits[0]).map((loc,index) => (
                    <BaseMesh i={index} pos={[cicularPosition(4,angleCalc(rLimits[0])*index).x,-9,cicularPosition(4,angleCalc(rLimits[0])*index).y]}/>
                  ))}
                        </PresentationControls>
                        <Perf position='top-left'/>
       </Canvas>
     </div>
  );
}


//=================================================//
/*
React components cannot be customised to blend with three.js object classes
React does not allow the parsing of "useRef" to store Three.Object(aka mesh)


*/
