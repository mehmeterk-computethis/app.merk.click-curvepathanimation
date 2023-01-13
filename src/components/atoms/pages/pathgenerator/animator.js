import * as THREE from 'three'  //
import * as MathUtils from 'three/src/math/MathUtils'
import { useControls,folder,button} from 'leva'
import React, {Children,Suspense,useState,useRef,ReactNode, ReactElement } from 'react'
import Animation from "./animation";
import {TransformControls,useCursor} from '@react-three/drei'
import { Canvas, useThree,useFrame} from '@react-three/fiber'


export default function Animator(props){

const anim =useRef();
const scene = useThree((state) => state.scene)
const [animList,setAnimList]=useState([...props.children]); //Purely for rendering
const totalDuration=(list)=>(list.map((a,i)=>(a.props.duration)).splice(1,list.length).reduce(function(x, y){return x + y;},0)) //Not including first element
const durationList=(list)=>(list.map((a,i)=>(a.props.duration)).splice(1,list.length)); //Not including first element

function timeLooper(ct,tt,durList,keyList){
  for(let i=0;i<keyList.length;i++){
    if(i>0){ //Not including the first item
      let startTime=durList.slice(0,i-1).reduce(function(x, y){return x + y;},0) //Sum of allthe duration untill i
      let endTime=startTime+keyList[i].props.duration
      let active=ct>startTime && ct<endTime?true:false;//is current time between start and end time of the keyframe
      var time=0; //lerping time mapped 0 to 1 for the duration of each keyframe
      if(active){
          time=((ct-startTime)%(endTime))/keyList[i].props.duration; //NOTE:
        //  console.log("Animator_timeLooper"+i,ct,"__",time,endTime)
         return {keyCount:i,keyTime:time}
      }
    }
  }
}


anim.name="Animator"
anim.props={
  currTime:0,
  tDuration:totalDuration(animList),
  durationList:durationList(animList),
  lerpManager:undefined,
  targetObject:props.children[0], //by Default is the first child
  startPos:{
    x:props.startPos!=undefined?props.startPos.x:0,
    y:props.startPos!=undefined?props.startPos.y:0,
    z:props.startPos!=undefined?props.startPos.z:0
  },
  startRot:{
    x:props.startRot!=undefined?props.startRot.x:0,
    y:props.startRot!=undefined?props.startRot.y:0,
    z:props.startRot!=undefined?props.startRot.z:0
  },
  animationList:undefined,
  currAnimation:undefined,
  state:undefined
}

//\\//\\//\\//\\//\\LEVA DEBUG TOOLS//\\//\\//\\//\\//\\//\\
{
  //==============// Debug GUI Element //==============//
  //NOT IMPLEMENTED
  /*const onAddAnimationt=(e)=>(
    setAnimList(animList => animList.concat(<Animation name={"Animation "+animList.length} key={animList.length} debug={props.debug} targetPos={{x:0,y:0,z:0}} duration={1} playing={false}/>))//position={[5,0,0]}
  );*/

  //==============// Debug GUI Element //==============//
  const {timeline,timingFunction } = useControls(anim.name,
  props.debug?{
  "Target Object":{
    value:anim.props.targetObject.type.name
  },
  "Start Position":{
    value:{x:anim.props.startPos.x,y:anim.props.startPos.y,z:anim.props.startPos.z},
    onChange: (v) => {
      anim.props.startPos.x=v.x
        anim.props.startPos.y=v.y
          anim.props.startPos.z=v.z
    }
  },
    Timeline: {
     value: 0,
      min: 0.01,
      max: anim.props.tDuration-0.01,
      step: 0.01,
      onChange: (v) => {
        anim.props.tDuration=totalDuration(animList)
       anim.props.durationList=durationList(animList)
       anim.props.currTime=v
       anim.props.lerpManager= timeLooper(anim.props.currTime,anim.props.tDuration,anim.props.durationList,animList)
    //  console.log("TimeLine",anim.props.lerpManager!=undefined?animList[anim.props.lerpManager.keyCount]:null);
      }
    }
  }:{});

}
//EndOf LEVA DEBUG TOOLS

console.log("Animator",anim,totalDuration(animList));
var targetLocation=anim.props.startPos; //Location of the lerping object to track, initiall start location
  useFrame((state,delta)=>(
    anim.current.children[1].startPos=anim.props.startPos,
     anim.current.children.map((child,index)=>{
       if(index>1){ //excluding the first child aka target animation object
         child.startPos=anim.current.children[index-1].targetPos
       }
     })
     ,anim.props.lerpManager!=undefined?anim.current.children[anim.props.lerpManager.keyCount].lerpTime=anim.props.lerpManager.keyTime:null
     ,targetLocation=anim.props.lerpManager!=undefined?anim.current.children[anim.props.lerpManager.keyCount].outPosition:anim.props.startPos
    ,anim.current.children[0].position.set(anim.current.children[anim.props.lerpManager.keyCount].position.x+targetLocation.x,anim.current.children[anim.props.lerpManager.keyCount].position.y+targetLocation.y,anim.current.children[anim.props.lerpManager.keyCount].position.z+targetLocation.z)
  //  ,console.log(anim.current.children[anim.props.lerpManager.keyCount].position)
  ));

  return (
    <group ref={anim} name="animator" >
    <Suspense fallback={null}>
    {
          React.Children.map(animList, (child,i) => {
            if(i>1){
              return React.cloneElement(child,{
                debug: props.debug,
                position:{x:animList[i-1].props.targetPos.x,y:animList[i-1].props.targetPos.y,z:animList[i-1].props.targetPos.z}
              })
            }else{
              if(i==0){
                return React.cloneElement(child)
              }else{
                return React.cloneElement(child,{
                  debug: props.debug,
                  position:{x:props.startPos.x,y:props.startPos.y,z:props.startPos.z}
                })
              }
            }
          })
        }
      </Suspense>
    </group>
  );

}
