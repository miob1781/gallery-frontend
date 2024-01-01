import React, { useState } from 'react';
import './App.css';
import { Cloudinary } from "@cloudinary/url-gen";
import {AdvancedImage} from '@cloudinary/react';
import {CloudinaryImage} from "@cloudinary/url-gen";
import {URLConfig} from "@cloudinary/url-gen";
import {CloudConfig} from "@cloudinary/url-gen";
import CloudinaryUploadWidget from './components/CloudinaryUploadWidget.tsx';

const CLOUD_NAME = 'dkkdyfrlb';
const UPLOAD_PRESET = 'wt90jp5p';

function App() {
  const [publicId, setPublicId] = useState('');

  const cld = new Cloudinary({
    cloud: {
      cloudName: CLOUD_NAME
    }
  });

  const myImage = cld.image(publicId);

  return (
    <div className="App">
      <h1>Photo Gallery</h1>
      <CloudinaryUploadWidget
        uwConfig={{
          cloudName: CLOUD_NAME,
          uploadPreset: UPLOAD_PRESET
        }}
        setPublicId={setPublicId}
      />
      <AdvancedImage cldImg={myImage} />
    </div>
  );
}

export default App;
