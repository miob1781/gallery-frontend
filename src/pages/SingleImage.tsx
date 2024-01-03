import React, { ChangeEventHandler, Dispatch, FormEventHandler, SetStateAction, useState } from 'react';
import { AdvancedImage } from '@cloudinary/react';
import { Cloudinary, CloudinaryImage } from '@cloudinary/url-gen';
import { fill } from '@cloudinary/url-gen/actions/resize';
import { Image } from '../types/types';
import { addOrEditTitle, addTag, removeTag } from '../requests/requests.ts';

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
            return <div key={tag}>
                <p>{tag}</p>
                <button type='button' onClick={() => handleRemoveTag(tag)}>Remove Tag</button>
            </div>
        });
    }

    const handleTagInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        const tagInput: string = e.target.value;
        setNewTag(tagInput);
    }

    const handleTagSubmission: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        if (!newTag) return;
        setTags(prev => {
            if (prev.includes(newTag)) return prev;
            return [...prev, newTag];
        });
        await addTag(cloudinaryId, newTag);
        setAddingTag(false);
    }

    const handleRemoveTag = async (tagToRemove: string) => {
        setTags(prev => prev.filter(tag => tag !== tagToRemove));
        await removeTag(cloudinaryId, tagToRemove);
    }

    return (<>
        <h2>Single Image</h2>
        <div>
            <button type='button' onClick={() => setCloudinaryId('')}>Back</button>
        </div>
        <AdvancedImage cldImg={image} />
        {title && !changingTitle
            ? <div>
                <p>{title}</p>
                <button type='button' onClick={(() => setChangingTitle(true))}>Change Title</button>
            </div>
            : <form onSubmit={handleTitleSubmission}>
                <label htmlFor='title-input'>New Title:</label>
                <input id='title-input' type='text' defaultValue={title} maxLength={30} onChange={handleTitleChange} />
                <button type='submit'>Submit</button>
            </form>}
        <div>
            {displayTags()}
            <button type='button' onClick={() => setAddingTag(true)}>Add Tag</button>
        </div>
        {addingTag && <form onSubmit={handleTagSubmission}>
            <label htmlFor='tag-input'>New Tag:</label>
            <input id='tag-input' type='text' onChange={handleTagInputChange} />
            <button type='submit'>Add</button>
        </form>}
    </>)
}