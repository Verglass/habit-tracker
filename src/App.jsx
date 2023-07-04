import Habits from './Habits';
import Nav from './Nav';


function App() {
  return (
    <div>
      <>
        <Nav />
        <div className='d-flex justify-content-center'>
          <Habits />
        </div>
      </>
    </div>
  )
}

export default App;
