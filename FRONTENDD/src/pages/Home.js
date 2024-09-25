import Banner from '../components/Banner';
import Highlights from '../components/Highlights';
import FeaturedProducts from '../components/FeaturedProducts';

export default function Home() {
  const data = {
    title: "The Zuitt Shop",
    content: "Opportunities for everyone, everywhere",
    destination: "/products",
    buttonLabel: "Browse Products"
  };

  return (
    <>
      <Banner data={data} />
      <Highlights />
    </>
  );
}
