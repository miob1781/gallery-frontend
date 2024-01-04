import React, { ChangeEventHandler, Dispatch, FormEventHandler, SetStateAction, useState } from 'react';
import { AdvancedImage } from '@cloudinary/react';
import { Cloudinary, CloudinaryImage } from '@cloudinary/url-gen';
import { fill } from '@cloudinary/url-gen/actions/resize';
import { Image } from '../types/types';
import { addOrEditTitle, addTag } from '../requests/requests.ts';
import { getDatalist } from '../utils/get-datalist.tsx';
import { Button } from '../components/styles/Button.tsx';
import Tag from '../components/ui/Tag.tsx';
import styled from 'styled-components';
import { Title } from '../components/styles/Title.tsx';

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
    const [changingTitle, setChangingTitle] = useState<boolean>(false);
    const [tags, setTags] = useState<string[]>(imageData.tags);
    const [addingTag, setAddingTag] = useState<boolean>(false);
    const [newTag, setNewTag] = useState<string>('');

    const handleTitleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        const newTitle: string = e.target.value;
        setTitle(newTitle);
    }
    
    const handleTitleSubmission: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        await addOrEditTitle(cloudinaryId, title);
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

    return (<>
        <h2>Single Image</h2>
        <div>
            <Button type='button' onClick={() => setCloudinaryId('')}>Back</Button>
        </div>
        <AdvancedImage cldImg={image} />
        {title && !changingTitle
            ? <div>
                <Title>{title}</Title>
                <Button type='button' onClick={(() => setChangingTitle(true))}>Edit Title</Button>
            </div>
            : <form onSubmit={handleTitleSubmission}>
                <label htmlFor='title-input'>New Title:</label>
                <input id='title-input' type='text' defaultValue={title} maxLength={30} onChange={handleTitleChange} />
                <Button type='submit'>Submit</Button>
            </form>}
        <TagsContainer>
            {displayTags()}
            <Button type='button' onClick={() => setAddingTag(true)}>Add Tag</Button>
        </TagsContainer>
        {addingTag && <form onSubmit={handleTagSubmission}>
            <label htmlFor='tag-input'>New Tag:</label>
            <input
                id='tag-input'
                type='text'
                list='add-tag-datalist'
                onChange={handleTagInputChange}
            />
            {getDatalist(images, newTag.toLowerCase(), 'add-tag-datalist')}
            <Button type='submit'>Add</Button>
        </form>}
    </>)
}

const TagsContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    width: clamp(400px, 50vw, 600px);
    justify-content: center;
    margin: 15px auto;
`;