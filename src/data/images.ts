// import img1 from "../images/Anonsbanner.png";
import img1 from "../images/Quosha_Banner-01.png";
import img2 from "../images/Anons_Banner.png";
import img3 from "../images/Turtlez_Banner.png";
import img4 from "../images/Merch3.0_Banner-01.png";
import img11 from "../images/Quosha_Banner_Vertical-01.png";
import img22 from "../images/Anons_Banner_Vertical-01.png";
import img33 from "../images/Turtlez_Banner_Vertical.png";
import img44 from "../images/Merch3.0_Banner_Vertical-01.png";
import anons from "../images/Anons_Banner2-01.png"
import turtlez from "../images/Turtlez_Banner_2.2-01.png"
import quosha from "../images/Quosha_Banner_3.2-01.png"
import merch from "../images/Merch3.0_Banner_2.2-01.png"
import exclusive from "../images/QUOLABS_1_2.png"

export const heroImages = [
  {
    id: 1,
    // path: "https://ik.imagekit.io/zf3aj3qr3x/tr:w-600/hero-1.jpg?updatedAt=1706911112844 400,https://ik.imagekit.io/zf3aj3qr3x/tr:w-800/hero-1.jpg?updatedAt=1706911112844 800w,https://ik.imagekit.io/zf3aj3qr3x/tr:w-1200/hero-1.jpg?updatedAt=1706911112844 1200w",
    path: img1,
    path2: img11,
    link: "/catalog/Men",
  },
  {
    id: 2,
    // path: "https://ik.imagekit.io/zf3aj3qr3x/tr:w-400/hero-3.jpg?updatedAt=1706911111440 400, https://ik.imagekit.io/zf3aj3qr3x/tr:w-800/hero-3.jpg?updatedAt=1706911111440 800w, https://ik.imagekit.io/zf3aj3qr3x/tr:w-1200/hero-3.jpg?updatedAt=1706911111440 1200w",
    path: img2,
    path2: img22,
    link: "/catalog/Women",
  },
  {
    id: 3,
    // path: "https://ik.imagekit.io/zf3aj3qr3x/tr:w-400/hero-4.jpg?updatedAt=1706911112832 400,https://ik.imagekit.io/zf3aj3qr3x/tr:w-800/hero-4.jpg?updatedAt=1706911112832 800w,https://ik.imagekit.io/zf3aj3qr3x/tr:w-1200/hero-4.jpg?updatedAt=1706911112832 1200w",
    path: img3,
    path2: img33,
    link: "/catalog/Electronics",
  },
  {
    id: 4,
    // path: "https://ik.imagekit.io/zf3aj3qr3x/tr:w-400/hero-6.jpg?updatedAt=1706911111003 400,https://ik.imagekit.io/zf3aj3qr3x/tr:w-800/hero-6.jpg?updatedAt=1706911111003 800w,https://ik.imagekit.io/zf3aj3qr3x/tr:w-1200/hero-6.jpg?updatedAt=1706911111003 1200w",
    path: img4,
    path2: img44,
    link: "/catalog/All",
  },
];
export const collectionImages = [
  {
    id: 1,
    path: anons,
    link: "/catalog/Anons",
    name: "Anons",
  },
  {
    id: 1,
    path: turtlez,
    link: "/catalog/Turtlez",
    name: "Turtlez",
   
  },
  {
    id: 3,
    path:merch,
    link: "/catalog/Merch 3.0",
    name: "Merch 3.0",
  },
  {
    id: 4,
    path: quosha,
    link: "/catalog/Quosha",
    name: "Quosha",
  },
  
  {
    id: 7,
    
    path: exclusive,
    link: "/catalog/Quolabs",
    name: "QUOLABS",
  },
];
