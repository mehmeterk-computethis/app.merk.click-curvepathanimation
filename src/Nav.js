import React, {Component, useState } from 'react'; //pull useState functionality from the React library
import './Nav.css';
import App from './App';
import Objects from './Objects';
import Devinfo from './Devinfo';
import DeviceOri from './DeviceOri'
import Oops from './Oops';
import PathGenerator from './PathGenerator'

class Nav extends Component {

    state={data:""}
    changeState = (e) => {
      this.setState({data:e.target.dataset.ref});
    //console.log("Nagigation to: ", e.target.dataset.ref);
         };

         menuGenerator(itemObjects){
           let menuItems;
           if(typeof itemObjects== "object"){
               menuItems=itemObjects.map((itemObjects=><li data-ref={itemObjects.ref} onClick={this.changeState}>{itemObjects.name}<div><p>{itemObjects.info }</p></div></li>));
           }
             return menuItems;
         }

      navStateMachine(){
          const sellection=this.state.data;
          let chosenApp;
          switch(sellection){
              case "exp1":
                chosenApp = <App/>
              break;
              case "exp2":
                  chosenApp = <Objects/>
              break;
              case "exp3":
                  chosenApp = <DeviceOri/>
              break;
              case "exp4":
                  chosenApp = <PathGenerator/>
              break;

              case "devinfo":
                  chosenApp = <Devinfo/>
              break;
              default:
                  chosenApp =  <PathGenerator/>
              break;
          }
          return chosenApp;
        }
    render(){
        return (
          <div className="PageWrapper">
      <div className="Nav" id="Nav">
        <ul>{this.menuGenerator([exp1,exp2,exp4,about])}</ul>
      </div>
          {this.navStateMachine()}

    </div>

        );
    }}
  export default Nav;


//=========/Navigation button details/============//

  const exp1={
    name: "Procedural Generation",
    ref: "exp2",//Must match app name
    info: "Custom animation function for oscilation, looping and linear animation. Combined with grouped 3D objects and procedural instantiation."
  }
  const exp2={
    name: "Path Editor v01",
    ref: "exp1", //Must match app name
    info: "A path editor mechanic built with custom lep function and linear algebra inspired by basic game-engine functions."
  }

  const exp3={
    name: "Gravity Shifter",
    ref: "exp3",//Must match app name
    info: "Gravity shifts according to mouse position/ device orientation axis on mobile"
  }
  const exp4={
    name: "Path Editor v02",
    ref: "exp4", //Must match app name
    info: "Beiziere curve moption path editor with GUI and animation curves"
  }
  const about={
    name: "Dev info",
    ref: "devinfo",//Must match app name
    info: "What am I looing at right now!"
  }
