// SideNavBar.js
import React, { useState } from "react";
import "rsuite/dist/rsuite.min.css";
import { Nav, Sidenav } from "rsuite/";
import HomeIcon from "@rsuite/icons/legacy/Home";
import FolderFillIcon from '@rsuite/icons/FolderFill';
import OffRoundIcon from '@rsuite/icons/OffRound';
import './SideNavBar.css';
import { FaHome } from "react-icons/fa";
import icon from '../images/icon.png'
import iconSmall from '../images/icon-small.png'
import { useNavigate } from 'react-router-dom'; // Import the Link component

const SideNavBar = () => {
  const [expand, setExpand] = useState(true);
  const [activeKey, setActiveKey] = useState("1");
  const navigate = useNavigate(); // Create a history object to go to another page


  const handleHomeClick = () => {
    navigate('/Home');
  };

  const handlePracticeClick = () => {
    navigate('/');
  };

  const handleLibraryClick = () => {
    navigate('/Library');
  };

  return (
    <nav className={`side-nav-bar ${expand ? 'expanded' : 'collapsed'}`}>
      {/* Logo section */}
      <div className="logo-container">
        <img src={expand ? icon: iconSmall} alt="Logo" className={`logo ${expand ? 'expanded-logo' : 'collapsed-logo'}`} />
      </div>
      <Sidenav expanded={expand} defaultOpenKeys={["3", "4"]} appearance="subtle">
        <Sidenav.Body>
          <Sidenav.Toggle
            onToggle={(expanded) => setExpand(expanded)}
          />
          <Nav activeKey={activeKey} onSelect={setActiveKey}>
            <Nav.Item eventKey="1" icon={<HomeIcon style={{ color: '#f58ea8'}}/>} style={{ color: '#f58ea8', fontSize: '1.2rem' }} onClick={handleHomeClick}>
              Home
            </Nav.Item>
            <Nav.Item eventKey="2" icon={<OffRoundIcon style={{ color: '#f58ea8'}}/>} style={{ color: '#f58ea8', fontSize: '1.2rem' }} onClick={handlePracticeClick}>
              Practice
            </Nav.Item>
            <Nav.Item eventKey="3" icon={<FolderFillIcon style={{ color: '#f58ea8'}}/>} style={{ color: '#f58ea8', fontSize: '1.2rem' }} onClick={handleLibraryClick}>
              Library
            </Nav.Item>
          </Nav>
        </Sidenav.Body>
      </Sidenav>
    </nav>
  );
};

export default SideNavBar;
