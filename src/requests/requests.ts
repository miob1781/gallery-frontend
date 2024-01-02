import axios, { AxiosResponse } from "axios";
import { Image } from "../types/types";

const BACKEND_BASE_URL: string = process.env.REACT_APP_BACKEND_BASE_URL!;
const backendClient = axios.create({ baseURL: BACKEND_BASE_URL });

export const getImages = async (): Promise<Image[]> => {
    try {
        const response: AxiosResponse<Image[]> = await backendClient.get('/image');
        const images: Image[] = response.data;
        return images;
    } catch(err) {
        console.log('Error while fetching images: ', err);
        return [];
    }
}

export const postImage = async (cloudinaryId: string): Promise<any> => {
    try {
        await backendClient.post('/image', { cloudinaryId });
    } catch(err) {
        console.log(`Error while posting image with cloudinaryId ${cloudinaryId}: `, err);
        return err;
    }
}

export const deleteImage = async (cloudinaryId: string): Promise<any> => {
    try {
        await backendClient.delete(`/image/${cloudinaryId}`);
    } catch(err) {
        console.log(`Error while deleting image with cloudinaryId ${cloudinaryId}: `, err);
        return err;
    }
}

export const addOrEditTitle = async (cloudinaryId: string, title: string): Promise<any> => {
    try {
        await backendClient.patch(`/image/${cloudinaryId}/title`, { title });
    } catch(err) {
        console.log(`Error while adding or editing title of image with cloudinaryId ${cloudinaryId}: `, err);
        return err;
    }
}

export const addTag = async (cloudinaryId: string, tag: string): Promise<any> => {
    try {
        await backendClient.patch(`/image/${cloudinaryId}/add-tag`, { tag });
    } catch(err) {
        console.log(`Error while adding tag to image with cloudinaryId ${cloudinaryId}: `, err);
        return err;
    }
}

export const removeTag = async (cloudinaryId: string, tag: string): Promise<any> => {
    try {
        await backendClient.patch(`/image/${cloudinaryId}/remove-tag`, { tag });
    } catch(err) {
        console.log(`Error while removing tag of image with cloudinaryId ${cloudinaryId}: `, err);
        return err;
    }
}
