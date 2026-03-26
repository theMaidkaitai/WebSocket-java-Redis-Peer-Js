import './App.css'
import SideBarComponent from "./components/SideBarComponent.tsx";
import VoidComponent from "./components/VoidComponent.tsx";

function App() {

  return (
      <div style={{ position: 'relative', minHeight: '100vh' }}>
          <SideBarComponent/>
          <VoidComponent/>
      </div>

  )
}

export default App
