import logo from './logo.svg';
import './App.css';

import React, {Component,useRef, useState} from 'react'
import {Canvas, useFrame, scene} from '@react-three/fiber';
import {PerspectiveCamera,GizmoHelper,GizmoViewport,TransformControls,OrbitControls} from '@react-three/drei'
import {cicularPosition, angleCalc, lerp, v3Lerp,map} from './cFunctions.js';
import * as THREE from 'three'
import { useControls,folder } from 'leva'

function Object_A(props){
  const mesh= useRef(); //give access to the THREE.Mesh object
  var path=null; //path object reff
  var pathNodes=null;//array of path nodes which contain the position param
  var transNodes=null;//transform controller nodes
  var lineNodes=null;
  var ni=0;//Node itterator, count up when at target
  var dist=0;//
  var ndist=0;
  var th=0.067; //Variable threshhold to speed ration is necessary to prevent object from zooming large distances
  var thm=0.05;
  var sp=1;//speed

  /*current set up is the best arrangement, cant exceed a distance larger then 7.5
  incorporate this into the game mechabnic

  */

  var t=0;
  var lpos={start:new THREE.Vector3(0,0,0),end:new THREE.Vector3(10,10,0),lerp:0}; //Hard coding the default start
   /*
    0..............................1
    start                         end
   */

  useFrame((state,delta)=>(
    t++,
    path=props.path!=null?mesh.current.parent.getObjectByName("MPG"+props.path):null,
    pathNodes=path.children.filter(function(ch){
      if(ch.name.includes("n")){
          return ch;
      }
    }),
    lineNodes=path.children.filter(function(ch){
      if(ch.name.includes("l")){
          return ch;
      }
    }),
    transNodes=path.children.filter(function(ch){
      if(ch.children!=0){
          return ch;
      }
    }),
    pathNodes.map((path,i) => {
        if(i<pathNodes.length-1 && path.position.distanceTo(pathNodes[i+1].position)>7.5)
        {
          transNodes[i].showX=false;
            transNodes[i].showY=false;
              transNodes[i].showZ=false;
              lineNodes[i].material.color=new THREE.Color("red");
          //console.log("Working",lineNodes[i]);
        }else{
          transNodes[i].showX=true;
            transNodes[i].showY=true;
              transNodes[i].showZ=true;
            if(i<lineNodes.length){
              lineNodes[i].material.color=new THREE.Color("hotpink");
            }
        }
      }),
    ni=ni!=pathNodes.length-2?(dist<th?ni+=1:ni):(dist<th?0:ni),
    lpos.start=pathNodes[ni].position,
    lpos.end=pathNodes[ni+1].position,
    lpos.lerp= v3Lerp(t,lpos.start,lpos.end,sp,"loop"),
    mesh.current.position.set(lpos.lerp.x,lpos.lerp.y,lpos.lerp.z),
    dist=parseFloat(mesh.current.position.distanceTo(lpos.end).toFixed(5)),//5 decimal places for best results
    ndist=pathNodes[ni].position.distanceTo(pathNodes[ni+1].position),
    thm=map(ndist, 0, 10.00, 0.04, 0.09),
    th=thm
    //  ,console.log("v",dist<th?true:dist,pathNodes[ni].position.distanceTo(pathNodes[ni+1].position),"thm",thm)
    //  console.log("ni",ni,"loop",mesh.current.position.distanceTo(lpos.end)<0.05,"st",pathNodes[ni].name,"et",pathNodes[ni+1].name)
    //,console.log("lineNodes",lineNodes,"transNodes",transNodes)
  //  console.log("over",mesh.current.position.distanceTo(lpos.end)>7.5)
  ));

  //console.log("mesh",mesh.current.position);
  return (
    <mesh ref={mesh} scale={1}>
    <boxGeometry args={[1,1,1]}/>
    <meshStandardMaterial color={'skyblue'}/>
      </mesh>
  );
}

function MotionPathGenerator(props){

  const mesh= useRef(); //give access to the THREE.Mesh object

  const[hovered, hover] = useState(false); //give access to the THREE.Mesh object
  const[clicked, click] =useState(false); //will we use these?

  console.log("MPG:",mesh);
  var nodeCount=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30];


    useFrame((state,delta)=>(
        nodeCount=mesh.current.children.filter(function(ch,i){
          if(ch.children==0){
              return ch;
          }
        }),
        nodeCount.map((node,index) => {
            if(nodeCount[index].name.includes("l"))
            {let sIndex= parseFloat(nodeCount[index].name[1])
              nodeCount[index].geometry.setFromPoints(
                [nodeCount[sIndex].position,nodeCount[sIndex+1].position]
              )
            }
          })
    ));
  return (
    <group ref={mesh} name={"MPG"+props.uid}uid>
    {nodeCount.slice(0,props.no).map((node,index) => (
      <TransformControls
      mode="translate"
      key={index}
      name={"n"+index}
      position={[index*2,0,0]}
      size={0.6}
      showX={props.visibile}
      showY={props.visibile}
      showZ={props.visibile}
      >
      </TransformControls>
    ))}/
       {nodeCount.slice(0,props.no-1).map((node,index) => (
         <line name={"l"+index} key={index}>
           <lineBasicMaterial color="hotpink" />
         </line>
       ))}
      </group>
  );
}

export default function App() {

  return (
    <div className="App">
    <Canvas>
    <PerspectiveCamera makeDefault position={[0,0,20]}/>
    <GizmoHelper
     alignment="top-left"
     margin={[80, 80]}
    >
<GizmoViewport axisColors={['red', 'green', 'blue']} labelColor="white" />
</GizmoHelper>
  <MotionPathGenerator uid={"path1"} no={5} pType={"loop"} visibile={true}/>
  <Object_A path={"path1"} speed={1} mType={"once"}/>
         <ambientLight intensity={0.1} />
         <directionalLight />
          <OrbitControls makeDefault />
       </Canvas>
     </div>
  );
}
