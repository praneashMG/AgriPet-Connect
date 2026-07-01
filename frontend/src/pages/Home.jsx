import React from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Categories from '../components/Categories';
import FeaturedAnimals from '../components/FeaturedAnimals';
import FeaturedProducts from '../components/FeaturedProducts';

const Home = () => {
  return (
    <>
      <Hero />
      <Features />
      <Categories />
      <FeaturedAnimals />
      <FeaturedProducts />
    </>
  );
};

export default Home;
