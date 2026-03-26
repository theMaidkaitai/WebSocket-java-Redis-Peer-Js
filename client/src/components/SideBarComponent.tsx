import React from 'react';
import "../styles/SideBarComponentStyles/sideBarStyle.css"

const SideBarComponent = () => {
    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <h2>Chameleon 1</h2>
            </div>
            <div className="users-list">
                <div className="user-item">USER 1</div>
                <div className="user-item">USER 2</div>
            </div>
            <div className="input-section">
                <input
                    type="text"
                    placeholder="Create A"
                    className="create-input"
                />
            </div>
        </div>
    );
};

export default SideBarComponent;