import React, { ChangeEventHandler, Dispatch, FormEventHandler, SetStateAction, useEffect, useState } from "react";
import {Cloudinary, CloudinaryImage} from "@cloudinary/url-gen";
import {URLConfig} from "@cloudinary/url-gen";
import {CloudConfig} from "@cloudinary/url-gen";
import CloudinaryUploadWidget from '../components/CloudinaryUploadWidget.tsx';
import { getImages } from "../requests/requests.ts";
import { AdvancedImage } from "@cloudinary/react";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { Image } from "../types/types.ts";
import { getDatalist } from "../utils/get-datalist.tsx";

interface Props {
    images: Image[];
    setImages: Dispatch<SetStateAction<Image[]>>;
    setCloudinaryId: Dispatch<SetStateAction<string>>;
    cld: Cloudinary;
}

export default function Gallery({images, setImages, setCloudinaryId, cld}: Props) {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [searchTermInput, setSearchTermInput] = useState<string>('');

    const filteredImages: Image[] = !searchTerm ? images : images.filter(imgData => imgData.tags.includes(searchTerm));

    const handleFilterInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        const searchInput = e.target.value;
        setSearchTermInput(searchInput);
    }

    const getTagsString = (tags: string[]): string => {
        const tagsString: string = tags.reduce((resultString, tag, index) => {
            if (index === tags.length - 1) {
                return resultString + tag;
            } else {
                return resultString + tag + `, `;
            }
        }, '');
        return tagsString;
    }

    const displayGallery = () => {
        if (filteredImages.length === 0) {
            return <p>There are no images with the tag: {searchTerm}.</p>
        }

        const gallery = filteredImages.map(imageData => {
            const image: CloudinaryImage = cld.image(imageData.cloudinaryId);
            image.resize(fill().width(180).height(180));
            
            return <div
                key={imageData.cloudinaryId}
                title={`Tags: ${getTagsString(imageData.tags)}`}
            >
                <AdvancedImage
                    cldImg={image}
                    onClick={() => setCloudinaryId(imageData.cloudinaryId)}
                />;
                <p>{imageData.title}</p>
            </div>
        });
        return gallery;
    }

    const handleFilterSubmission: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        setSearchTerm(searchTermInput.toLowerCase());
        setSearchTermInput('');
    }

    const handleRemoveFilter = () => {
        setSearchTerm('');
        setSearchTermInput('');
    }

    useEffect(() => {
        getImages()
            .then(loadedImages => {
                setImages(loadedImages);
            });
    }, [setImages]);

    return (<>
        <CloudinaryUploadWidget setCloudinaryId={setCloudinaryId} setImages={setImages} />
        <form onSubmit={handleFilterSubmission}>
            <label htmlFor='filter-input'>Filter by tag:</label>
            <input
                id='filter-input'
                type='text'
                list='datalist-filter'
                value={searchTermInput}
                onChange={handleFilterInputChange}
            />
            {getDatalist(images, searchTermInput, 'datalist-filter')}
            <button type='submit'>Search</button>
        </form>
        {searchTerm && <button type='button' onClick={handleRemoveFilter}>Remove filter</button>}
        {searchTerm && filteredImages.length > 0 && <p>Images with tag: {searchTerm}</p>}
        {displayGallery()}
    </>);
}