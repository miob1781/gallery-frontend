import React, { ChangeEventHandler, Dispatch, FormEventHandler, SetStateAction, useEffect, useState } from "react";
import { Cloudinary } from "@cloudinary/url-gen";
import CloudinaryUploadWidget from '../components/widgets/CloudinaryUploadWidget.tsx';
import { getImages } from "../requests/requests.ts";
import { Image } from "../types/types.ts";
import { getDatalist } from "../utils/get-datalist.tsx";
import { Button } from "../components/styles/Button.tsx";
import { Input } from "../components/styles/Input.tsx";
import GalleryImage from "../components/ui/GalleryImage.tsx";
import styled from "styled-components";

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

    const displayGallery = () => {
        if (images.length === 0) {
            return <p>The gallery is empty.</p>
        }
        else if (filteredImages.length === 0) {
            return <p>There are no images with the tag: {searchTerm}.</p>
        }

        const gallery = filteredImages.map(imageData => {            
            return <GalleryImage imageData={imageData} cld={cld} setCloudinaryId={setCloudinaryId} />
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
        <FilterFormContainer>
            <form onSubmit={handleFilterSubmission}>
                <label htmlFor='filter-input'>Filter by tag:</label>
                <Input
                    id='filter-input'
                    type='text'
                    list='datalist-filter'
                    value={searchTermInput}
                    onChange={handleFilterInputChange}
                />
                {getDatalist(images, searchTermInput, 'datalist-filter')}
                <Button type='submit'>Search</Button>
            </form>
            <div style={{marginTop: '10px'}}>
                {searchTerm && <Button type='button' onClick={handleRemoveFilter}>Remove filter</Button>}
            </div>
            {searchTerm && filteredImages.length > 0 && <p style={{marginTop: '10px'}}>Images with tag: {searchTerm}</p>}
        </FilterFormContainer>
        <GalleryContainer>{displayGallery()}</GalleryContainer>
    </>);
}

const FilterFormContainer = styled.div`
    margin: 20px;
`;

const GalleryContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
`;