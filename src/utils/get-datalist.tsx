import React from "react";
import { Image } from "../types/types.ts";

const filterTag = (searchTermInput: string, tag: string): boolean => {
    const tagPart = tag.slice(0, searchTermInput.length);
    return tagPart.includes(searchTermInput);
} 

export const getDatalist = (images: Image[], searchTermInput: string, id: string) => {
    const tagsList: string[] = images.reduce((list: string[], img: Image) => {
        const filteredTags: string[] = !searchTermInput
            ? img.tags
            : img.tags.filter(tag => filterTag(searchTermInput, tag));
        return [...list, ...filteredTags];
    }, []);

    const options = tagsList.map(tag => <option value={tag} />);
    const datalist = (
        <datalist id={id}>
            {options}
        </datalist>
    );
    return datalist;
}