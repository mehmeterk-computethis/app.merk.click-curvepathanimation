import * as THREE from 'three'  //
import * as MathUtils from 'three/src/math/MathUtils'
import { useControls,folder ,button} from 'leva'
import React, {useEffect,useState,useRef,ReactNode, ReactElement } from 'react'
import {TransformControls,useCursor} from '@react-three/drei'
import { Canvas, useThree,useFrame} from '@react-three/fiber'
import { bezier } from '@leva-ui/plugin-bezier'

const calRelative= (a,b)=>(new THREE.Vector3(b.x,b.y,b.z).sub(new THREE.Vector3(a.x,a.y,a.z)));

export default function Animation(props){
  const anim =useRef();
  var geometry= new THREE.BufferGeometry();

  var relative=calRelative(props.position,props.targetPos);

  var curve3 = new THREE.CubicBezierCurve3(
    new THREE.Vector3(0, 0,0),//By default should be 0,0,0! Local Transformations are in action
      new THREE.Vector3(props.cpnt1!=undefined?props.cpnt1.x:0, props.cpnt1!=undefined?props.cpnt1.y:0,props.cpnt1!=undefined?props.cpnt1.z:0),
        new THREE.Vector3(props.cpnt1!=undefined?props.cpnt2.x:0, props.cpnt1!=undefined?props.cpnt2.y:0,props.cpnt1!=undefined?props.cpnt2.z:0),
          new THREE.Vector3(relative.x, relative.y,relative.z)
  );


//NOTE: if using props.position and props.targetPos why create two sets of data objects?
  anim.name=props.name;
  anim.props={ //LOCAL ANIMATION DATA
    time: 0,
    duration:props.duration!=undefined?props.duration:1,
    timingFunction:undefined,
    startPos:{ //Is this obsolete?!
      x:props.position!=undefined?props.position.x:0, //update according to three object
      y:props.position!=undefined?props.position.y:0, //update according to three object
      z:props.position!=undefined?props.position.z:0 //update according to three object
    },
    targetPos:{ //Is this obsolete?!
      x:props.targetPos!=undefined?props.targetPos.x:0,
      y:props.targetPos!=undefined?props.targetPos.y:0,
      z:props.targetPos!=undefined?props.targetPos.z:0
    },
    targetRot:{
      x:props.targetRot!=undefined?props.targetRot.x:0,
      y:props.targetRot!=undefined?props.targetRot.y:0,
      z:props.targetRot!=undefined?props.targetRot.z:0
    },
    cpnt1:{
      x:props.cpnt1!=undefined?props.cpnt1.x:0,
      y:props.cpnt1!=undefined?props.cpnt1.y:0,
      z:props.cpnt1!=undefined?props.cpnt1.z:0
    },
    cpnt2:{
      x:props.cpnt2!=undefined?props.cpnt2.x:0,
      y:props.cpnt2!=undefined?props.cpnt2.y:0,
      z:props.cpnt2!=undefined?props.cpnt2.z:0
    },
    detail:props.detail!=undefined?props.detail:10,
    curve:curve3,
    curveGeometry: geometry.setFromPoints(curve3.getPoints(props.detail)),
    state:undefined
  }
  anim.activePoint=false;
//  anim.position.set(anim.props.startPos.x,anim.props.startPos.y,anim.props.startPos.z);

  console.log(props.name,"PROPS_SAMPLE",anim)
  //\\//\\//\\//\\//\\LEVA DEBUG TOOLS//\\//\\//\\//\\//\\//\\


  //==============// Debug GUI Element //==============//
function updateCurve(){
  if(props.debug){//console logs & functions dependent on LEVA GUI
      anim.props.relativetarget=calRelative(props.position,anim.current.targetPos)

      curve3= new THREE.CubicBezierCurve3(
        new THREE.Vector3(0,0,0), //By default should be 0,0,0! Local Params!
          new THREE.Vector3(anim.props.cpnt1.x, anim.props.cpnt1.y,anim.props.cpnt1.z),
            new THREE.Vector3(anim.props.cpnt2.x, anim.props.cpnt2.y,anim.props.cpnt2.z),
              new THREE.Vector3(anim.props.relativetarget.x, anim.props.relativetarget.y,anim.props.relativetarget.z)
      );
      anim.props.curve=curve3
      anim.props.curveGeometry= geometry.setFromPoints(curve3.getPoints(anim.props.detail))

     anim.current.children[0].position.set(anim.props.relativetarget.x,anim.props.relativetarget.y,anim.props.relativetarget.z)
    console.log(props.name,"CurveTest",anim,curve3)
  }
}
    const gui = useControls(props.name,props.debug?{
        targetPos:{
          value:{x:anim.props.targetPos.x,y:anim.props.targetPos.y,z:anim.props.targetPos.z},
          onChange: (v) => {
            anim.props.targetPos=v //BUG: NOT UPDATING VIA ON CHANGE only current is working below
            anim.current.targetPos=v
         }
       },
        cpnt1:{
          value:{x:anim.props.cpnt1.x,y:anim.props.cpnt1.y,z:anim.props.cpnt1.z},
          onChange: (v) => {
            anim.props.cpnt1=v //BUG: NOT UPDATING VIA ON CHANGE only current is working below
            anim.current.cpnt1=v
           console.log(props.name,"change here",anim.props)
         }
       },
       cpnt2:{
         value:{x:anim.props.cpnt2.x,y:anim.props.cpnt2.y,z:anim.props.cpnt2.z},
         onChange: (v) => {
           anim.props.cpnt2=v //BUG: NOT UPDATING VIA ON CHANGE only current is working below
           anim.current.cpnt2=v
          console.log(props.name,"change here",anim.props)
        }
      },
      detail:{
        value:anim.props.detail,
        onChange: (v) => {
          anim.props.detail=v //BUG: NOT UPDATING VIA ON CHANGE only current is working below
          anim.current.detail=v
         console.log(props.name,"change here",anim.props)
       }
     },
     "UpdateCurve":button(() =>updateCurve()),
      }:{});//object={scene.getObjectByName(snap.current)}
    //\\//\\//\\//\\//\\EndOf LEVA DEBUG TOOLS

      useFrame((state,delta)=>(
       anim.props.startPos=anim.current.startPos,
       anim.current.children[1].geometry=anim.props.curveGeometry,/*Set the curve geometry*/
       anim.current.outPosition=anim.current.lerpTime!=undefined?anim.props.curve.getPointAt(anim.current.lerpTime):null
      ));

  return ( //position={[props.targetPos.x,props.targetPos.y,props.targetPos.z]}
    <group ref={anim} position={[props.position.x,props.position.y,props.position.z]}>
    {console.log("InRender",props)}
    {props.debug &&
       <mesh scale={0.1} name="Point" >
        <sphereGeometry attach="geometry"/>
        <meshStandardMaterial  attach="material" color="red"/>
      </mesh>
    }
    {props.debug &&
      <line name={"l"+0} key={0} >
        <lineBasicMaterial color="hotpink"  attach="material"/>
        </line>
      }
    </group>
  );
}
