import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Slider from "react-slick";

const logos = [
    "../public/docker.svg",
    "../public/expo-1.svg",
    "../public/fastapi-1.svg",
    "../public/github-icon-1.svg",
    "../public/nodejs-1.svg",
    "../public/postgresql-inc.svg",
    "../public/react-native-1.svg",
    "../public/react-svgrepo-com.svg",
    "../public/Symfony.svg",
    "../public/typescript.svg",
    "../public/vite.svg",
    "../public/html-1.svg",
    "../public/css-3.svg",

];

export default function LogoSlider() {
    const settings = {
  infinite: true,
  slidesToShow: 3,
  slidesToScroll: 1,
  centerMode: true,
  centerPadding: "10px",
  speed: 500,
  autoplay: true,
  autoplaySpeed: 2000,
  cssEase: "ease-in-out",
  arrows: true,

  responsive: [
    {
      breakpoint: 768, // Mobile / tablette
      settings: {
        slidesToShow: 3,      // 1 logo visible
        centerPadding: "10px", // PLUS d’espace sur les côtés
        arrows: false,        // ❌ enlève les flèches
      },
    },
  ],
};


    return (
        <div className="slider-container w-full h-full">
            <Slider {...settings}>
                {logos.map((logo, index) => (
                    <div key={index} className="logo-slide">
                        <img src={logo} alt={`logo-${index}`} />
                    </div>
                ))}
            </Slider>
        </div>
    );
}