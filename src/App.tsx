import React, { useState } from 'react';
import './App.css';
import { Cloudinary } from "@cloudinary/url-gen";
import SingleImage from './pages/SingleImage.tsx';
import Gallery from './pages/Gallery.tsx';
import { Image } from './types/types.ts';
import styled from 'styled-components';

function App() {
  const [images, setImages] = useState<Image[]>([]);
  const [cloudinaryId, setCloudinaryId] = useState<string>('');

  const cld: Cloudinary = new Cloudinary({
    cloud: {
      cloudName: process.env.REACT_APP_CLOUD_NAME
    }
  });

  return (
    <div className="App">
      <H1>Photo Gallery</H1>
      {!cloudinaryId && <Gallery
        images={images}
        setImages={setImages}
        setCloudinaryId={setCloudinaryId}
        cld={cld}
      />}
      {cloudinaryId && <SingleImage
        cloudinaryId={cloudinaryId}
        setCloudinaryId={setCloudinaryId}
        images={images}
        cld={cld}
      />}
    </div>
  );
}

export default App;

const H1 = styled.h1`
  margin-bottom: 20px;
`;