import { createThumbnail } from "react-native-create-thumbnail";

export const generateVideoThumb = (url, setVideoThumb) => {
    createThumbnail({
        url
    })
        .then(res => {
            setVideoThumb(res);
        })
        .catch(err => {
            console.warn("Error while generating video preview ---->", err);
        })
}