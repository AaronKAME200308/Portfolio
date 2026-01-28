import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Slider from "react-slick";

const logos = [
    "/docker.svg",
    "/expo-1.svg",
    "/fastapi-1.svg",
    "/github-icon-1.svg",
    "/nodejs-1.svg",
    "/postgresql-inc.svg",
    "/react-native-1.svg",
    "/react-svgrepo-com.svg",
    "/Symfony.svg",
    "/typescript.svg",
    "/vite.svg",
    "/html-1.svg",
    "/css-3.svg",

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