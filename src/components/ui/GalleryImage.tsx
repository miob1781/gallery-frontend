import React, { Dispatch, SetStateAction } from "react";
import { Image } from "../../types/types";
import { Cloudinary, CloudinaryImage } from "@cloudinary/url-gen";
import { AdvancedImage } from "@cloudinary/react";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { getTagsString} from "../../utils/get-tags-string.ts";
import { Title } from "../styles/Title.tsx";
import styled from "styled-components";

interface Props {
    imageData: Image;
    cld: Cloudinary;
    setCloudinaryId: Dispatch<SetStateAction<string>>;
}

export default function GalleryImage({imageData, cld, setCloudinaryId}: Props) {
    const image: CloudinaryImage = cld.image(imageData.cloudinaryId);
    image.resize(fill().width(180).height(180));

    return (
        <GalleryImageOuterContainer key={imageData.cloudinaryId}>
            <GalleryImageInnerContainer title={`Tags: ${getTagsString(imageData.tags)}`}>
                <AdvancedImage
                    cldImg={image}
                    style={{
                        padding: '5px',
                    }}
                    onClick={() => setCloudinaryId(imageData.cloudinaryId)}
                />
            </GalleryImageInnerContainer>
            <Title>{imageData.title}</Title>
        </GalleryImageOuterContainer>
    );
}

const GalleryImageOuterContainer = styled.div`
    margin: 10px;
`;

const GalleryImageInnerContainer = styled.div`
    width: fit-content;
    height: fit-content;
    margin: auto;
    cursor: pointer;
    box-sizing: content-box;
    :hover {
        border: 2px dotted mediumaquamarine;
    }
`;