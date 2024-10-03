import logo from './logo.png';
import './App.css';

  function App() {
    return (
      <header>
        <div className="header-bg">
          <img src={logo} className="logo" alt="logo" width="10%" height="auto"/>
          <div className="button-group">
            <input type="text" className="nav-btn" placeholder="Search.."/>
            <button className="nav-btn">Search</button>
            <button className="nav-btn">Login</button>
            <button className="nav-btn">My Account</button>
          </div>
        </div>
      </header>
    );
  }

export default App;
