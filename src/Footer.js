import rectLogo from './logo.svg';
import './Footer.css';


function iconGenerator(img){
  let imgSpipet;

  if(typeof img== "object"){
      imgSpipet=img.map((img=><img src={img}className="App-logo" alt="logo" />));
  }

  if(typeof img=="string") {
      imgSpipet=<img src={img}className="App-logo" alt="logo" />
  }
    return(imgSpipet);
}



export default function Footer() {

 return(
   <footer className="Footer">
     <div className="logo-list">
           {iconGenerator([rectLogo])}
     </div>
     <div className="refference">
       <p>web app experiments by <a href="https://merk.click/">Mehmet Erk</a></p>
     </div>
   </footer>
 );
}
