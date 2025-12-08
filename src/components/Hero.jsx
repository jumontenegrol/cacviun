// javascript
// archivo: `src/components/Hero.jsx`
import React from "react";
import Logo from "../components/Logo";
import colorImg from "../assets/color.png";

function Hero() {
    return (
        <div className="hero">
            <div className="hero-row">
                <div className="hero-logo">
                    <Logo variant="black" />
                </div>

                <div className="hero-info">
                    <img src={colorImg} alt="Logo" className="hero-icon" />
                    <span className="hero-text">
                        This color represents our commitment to ending all forms of violence.
                    </span>
                </div>
            </div>
        </div>
    );
}

export default Hero;




