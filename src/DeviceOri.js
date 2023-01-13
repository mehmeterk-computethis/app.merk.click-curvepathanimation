
import React, {useRef, useEffect,useState,useContext,CanvasContext} from 'react'
import PropTypes from 'prop-types';
import './DeviceOri.css';
import {Canvas, useFrame} from '@react-three/fiber';
import {PerspectiveCamera,OrbitControls,GizmoHelper,GizmoViewport,PivotControls,meshBounds} from '@react-three/drei'
import {Physics, usePlane, useBox, useSphere} from '@react-three/cannon'
import {InstancedMesh, Mesh} from 'three/src/Three'
import {degtorad,map,cicularPosition} from './cFunctions.js';
import * as CANNON from 'cannon-es';
import {Perf} from "r3f-perf";

const dbug=true; //NOT USED

function BauBal(props){
  const grav: Triplet=[0,-10,0];
  const [ref] = useSphere(() => ({ mass: 10, position:props.pos,gravity:grav, ...props }))
  return (
    <mesh ref={ref}>
      <sphereGeometry />
    </mesh>
  )
}


function Boundary(props){ //Args and scale have to match
  const boxSize = [4, 4];

  let rotation={x:degtorad(props.rot[0]),y:degtorad(props.rot[1]),z:degtorad(props.rot[2])};
  const [ref,refApi] = usePlane(() => ({rotation:[rotation.x,rotation.y,rotation.z],position:props.pos,args:boxSize, ...props }),useRef<Mesh>(null))

  return (
    <mesh ref={ref}  name="plane" pos={props.pos} rot={props.rot} name={props.name}>
        <planeBufferGeometry args={[30,30,30]} />
        <meshStandardMaterial color={props.col} opacity={0.1} transparent/>
    </mesh>
  )
}

function windowResize(){
  let wRatio={
    lft:-14,
    rght:14,
    tp:8,
    btm:-1,
    frnt:0, //notused
    bck:0//notused
  };

  window.addEventListener('resize',  (e) => {
    wRatio.lft=map(window.innerWidth,360,1745,-3,-14);
    wRatio.rght=map(window.innerWidth,360,1745,3,14);
    wRatio.tp=map(window.innerWidth,360,1745,-3,-14); //VALUES NEED ADJUSTING
    wRatio.btm=map(window.innerWidth,360,1745,3,14); //VALUES NEED ADJUSTING
  });
  return wRatio;
}

function useWindowSize() {
  const [ratio,setRatio] = useState({
    lft:-14,
    rght:14,
    tp:8,
    btm:-1,
    frnt:0, //notused
    bck:0//notused
  });
  useEffect(() => {
    function handleResize(e) {
      setRatio({
        lft:map(window.innerWidth,360,1745,-3,-14),
        rght:map(window.innerWidth,360,1745,3,14),
        tp:8,
        btm:-1,
        frnt:0, //notused
        bck:0//notused
      });
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return ratio;
}

function BoundaryGroup(props){
   //world.gravity.set(0, -9.82, 0)
  const mesh= useRef();
  const screenSize = useWindowSize();
  let rotation={x:0,y:0,z:0};
  let ratio={
    lft:-14,
    rght:14,
    tp:8,
    btm:-1,
    frnt:0,
    bck:0//notused//notused
  }

 console.log("BoundaryGroup",screenSize);

  return (  //Screensize Not updating!
      <group ref={mesh}>
        <Boundary name="bottom" rot={[-90,0,0]} pos={[0,screenSize.btm,0]} col="red"/>
        <Boundary name="top" rot={[90,0,0]} pos={[0,screenSize.tp,0]} col="red"/>
        <Boundary name="left" rot={[0,90,0]} pos={[screenSize.lft,0,0]} col="blue"/>
        <Boundary name="right" rot={[0,-90,0]} pos={[screenSize.rght,0,0]} col="blue"/>
        <Boundary name="back" rot={[0,0,0]} pos={[0,10,-3]} col="green"/>
        <Boundary name="front" rot={[0,180,0]} pos={[0,0,5]} col="green"/>

      </group>
  )
}

export default class DeviceOri extends React.Component {

  static propTypes = {
    children: PropTypes.func,
  };

  static defaultProps = {
    children: () => null,
  };

  state = {
    absolute: true,
    alpha: 0,
    beta: 0,
    gamma: 0,
    gravity:[0,0,0]
  };

  handleOrientation = event => {
    const { absolute, alpha, beta, gamma, gravity} = event;
    this.setState({ absolute, alpha, beta, gamma,gravity});
    console.log("handleOrientation:",event);
  };

  accelerometer() {
    window.addEventListener('deviceorientation', (e) => {
    let direction= [map(e.gamma,-90,90,-10,10).toFixed(2), map(e.beta,-90,90,10,-10).toFixed(2),0]
    this.setState({gravity:direction});
    }, true);
  }

  mouseposition(){
    document.addEventListener('mousemove', (e) => {
        let direction=[map(e.clientX,0,window.innerWidth,-10,10).toFixed(2),map(e.clientY,0,window.innerHeight,10,-10).toFixed(2),0]
     //// NOTE: is toFixed() heavy?
        this.setState({gravity:direction});
    });
  }

  deviceState(){
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    this.accelerometer();
    // console.log("Mobile",navigator.userAgent);
  }else{
    this.mouseposition();
  //  console.log("Desktop",navigator.userAgent);
    }
  }

  render() {
    return (
      <div className="DeviceOri">
      {this.deviceState()}
      <p class="debug">Gravity Changer:{this.state.gravity[0]},{this.state.gravity[1]},{this.state.gravity[2]} </p>
      <Canvas>
          <PerspectiveCamera makeDefault position={[0,5,22]}/>
          <GizmoHelper alignment="top-left" margin={[80, 80]}>
          <GizmoViewport axisColors={['red', 'green', 'blue']} labelColor="white" />
</GizmoHelper>
        <Physics gravity={this.state.gravity}>

        <BoundaryGroup/>

        <BauBal pos={[0,5,0]}/>
          <BauBal pos={[3,5,0]}/>
            <BauBal pos={[-3,5,0]}/>
                <BauBal pos={[5,2,1]}/>
                    <BauBal pos={[-3,0,-1]}/>
                        <BauBal pos={[5,-2,0]}/>
        </Physics>

        <ambientLight intensity={0.1} />
    <directionalLight />
      <OrbitControls makeDefault />
        <Perf position='bottom-left'/>
      </Canvas>
      </div>
    );
  }
}
