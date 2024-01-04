export const getTagsString = (tags: string[]): string => {
    const tagsString: string = tags.reduce((resultString, tag, index) => {
        if (index === tags.length - 1) {
            return resultString + tag;
        } else {
            return resultString + tag + `, `;
        }
    }, '');
    return tagsString;
}
