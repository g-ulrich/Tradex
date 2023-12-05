import './App.css';
import {getHeightFromClass} from './components/util';
import Routing from './components/menu/Routing';

export default function App() {
  document.body.classList.add('bg-discord-darkerGray', 'text-discord-white');
  const titleBarheight = getHeightFromClass("cet-titlebar");
  console.log(titleBarheight);
  return (
    <div className="bg-discord-darkerGray" style={{'height': `calc(100vh - ${titleBarheight}px)`}}>
        <Routing val={titleBarheight}/>
    </div>
  );
}
