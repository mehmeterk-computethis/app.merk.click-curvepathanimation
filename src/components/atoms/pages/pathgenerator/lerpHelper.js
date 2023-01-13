import * as THREE from 'three'  //
import * as MathUtils from 'three/src/math/MathUtils'
import { useControls,folder } from 'leva'

export class LerpManager{
    constructor(t,d,tools=true){
        this.d=d; //duration
        this.t=t; //time to be set at (THREE)state.clock.getElapsedTime() at UseFrame(state)...
        this.tools=tools;
    }
    

    elapse(time=this.t){
      return time%this.d;
    }

    pingPong(time=this.t){
      return MathUtils.pingpong(time,this.d);
    }

    dampen(dRate,time=this.time,acc=4){ //default accuracy to 4 deciman places
      return MathUtils.damp(0,this.d,dRate,time).toFixed(acc);
    }
}
