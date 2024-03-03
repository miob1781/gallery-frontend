import React, { ChangeEventHandler, Dispatch, FormEventHandler, SetStateAction, useState } from 'react';
import { AdvancedImage } from '@cloudinary/react';
import { Cloudinary, CloudinaryImage } from '@cloudinary/url-gen';
import { fill } from '@cloudinary/url-gen/actions/resize';
import { Image } from '../types/types';
import { addOrEditTitle, addTag, deleteImage } from '../requests/requests.ts';
import { getDatalist } from '../utils/get-datalist.tsx';
import { Button } from '../components/styles/Button.tsx';
import Tag from '../components/ui/Tag.tsx';
import styled from 'styled-components';
import { Title } from '../components/styles/Title.tsx';
import { Input } from '../components/styles/Input.tsx';

interface Props {
    cloudinaryId: string;
    setCloudinaryId: Dispatch<SetStateAction<string>>;
    images: Image[];
    cld: Cloudinary;
}

export default function SingleImage({cloudinaryId, setCloudinaryId, images, cld}: Props) {
    const imageData = images.find(img => img.cloudinaryId === cloudinaryId)!;
    const image: CloudinaryImage = cld.image(cloudinaryId);
    image.resize(fill().width(400).height(400));
    
    const [title, setTitle] = useState<string>(imageData.title);
    const [titleInput, setTitleInput] = useState<string>(imageData.title);
    const [changingTitle, setChangingTitle] = useState<boolean>(false);
    const [tags, setTags] = useState<string[]>(imageData.tags);
    const [addingTag, setAddingTag] = useState<boolean>(false);
    const [newTag, setNewTag] = useState<string>('');
    const [displayDeleteConfirmation, setDisplayDeleteConfirmation] = useState<boolean>(false);

    const handleTitleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        const newTitle: string = e.target.value;
        setTitleInput(newTitle);
    }
    
    const handleTitleSubmission: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        await addOrEditTitle(cloudinaryId, titleInput);
        setTitle(titleInput);
        setChangingTitle(false);
    }

    const displayTags = () => {
        return tags.map(tag => {
            return <Tag
                key={tag}
                tag={tag}
                setTags={setTags}
                cloudinaryId={cloudinaryId}
            >{tag}</Tag>
        });
    }

    const handleTagInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        const tagInput: string = e.target.value;
        setNewTag(tagInput);
    }

    const handleTagSubmission: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        if (!newTag) return;
        const tagToLowerCase: string = newTag.toLowerCase();        
        setTags(prev => {
            if (prev.includes(tagToLowerCase)) return prev;
            return [...prev, tagToLowerCase];
        });
        await addTag(cloudinaryId, tagToLowerCase);
        setAddingTag(false);
    }

    const handleDeleteImage = async () => {
        await deleteImage(cloudinaryId);
        setCloudinaryId('');
    }

    return (<>
        <div>
            <Button type='button' onClick={() => setCloudinaryId('')}>Back to Gallery</Button>
        </div>
        <ImageContainer>
            <AdvancedImage cldImg={image} style={{width: '100%'}} />
        </ImageContainer>
        {title && !changingTitle
            ? <div>
                <Title>{title}</Title>
                <Button type='button' onClick={(() => setChangingTitle(true))}>Edit Title</Button>
            </div>
            : <form onSubmit={handleTitleSubmission}>
                <label htmlFor='title-input'>New Title:</label>
                <Input id='title-input' type='text' defaultValue={titleInput} maxLength={30} onChange={handleTitleChange} />
                <Button type='submit'>Submit</Button>
            </form>}
        <TagsContainer>
            {displayTags()}
            <Button type='button' onClick={() => setAddingTag(true)}>Add Tag</Button>
        </TagsContainer>
        {addingTag && <form onSubmit={handleTagSubmission}>
            <label htmlFor='tag-input'>New Tag:</label>
            <Input
                id='tag-input'
                type='text'
                list='add-tag-datalist'
                onChange={handleTagInputChange}
            />
            {getDatalist(images, newTag.toLowerCase(), 'add-tag-datalist')}
            <Button type='submit'>Add</Button>
        </form>}
        <div>
            <Button type='button' onClick={() => setDisplayDeleteConfirmation(true)}>Delete Image</Button>
        </div>
        {displayDeleteConfirmation && <div style={{marginTop: '10px'}}>
            <p>Do you really want to delete this image?</p>
            <div style={{marginTop: '10px'}}>
                <Button $danger type='button' onClick={handleDeleteImage}>Yes</Button>
                <Button type='button' onClick={() => setDisplayDeleteConfirmation(false)}>No</Button>
            </div>
        </div>}
    </>)
}

const ImageContainer = styled.div`
    margin: 15px auto;
    max-width: min(500px, 90vw);
`;

const TagsContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    width: clamp(min(400px, 95vw), 50vw, 600px);
    justify-content: center;
    margin: 15px auto;
`;