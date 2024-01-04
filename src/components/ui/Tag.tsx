import React, { Dispatch, PropsWithChildren, SetStateAction } from "react";
import styled from "styled-components"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { removeTag } from "../../requests/requests.ts";

interface Props {
    tag: string;
    setTags: Dispatch<SetStateAction<string[]>>;
    cloudinaryId: string;
}

export default function Tag({children, tag, setTags, cloudinaryId}: PropsWithChildren<Props>) {
    const handleRemoveTag = async (tagToRemove: string) => {
        setTags(prev => prev.filter(tag => tag !== tagToRemove));
        await removeTag(cloudinaryId, tagToRemove);
    }

    return (
        <Container>
            <Text>{children}</Text>
            <FontAwesomeIcon
                icon={faXmark}
                size='lg'
                style={{cursor: 'pointer'}}
                title='Remove Tag'
                onClick={() => handleRemoveTag(tag)}
            />
        </Container>
    );
}

const Container = styled.div`
    width: fit-content;
    background-color: lightyellow;
    margin: 5px;
    padding: 8px;
    border-radius: 12px;
    border: 1px solid darkgrey;
    box-shadow: 1px 2px 2px 1px darkgrey;
`;

const Text = styled.span`
    font-size: 0.9rem;
    margin-right: 6px;
`;