
export function useMediaUpload() {
    const uploadFile = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        return fetch('http://localhost:3000/media/upload', {
            method: 'POST',
            body: formData
        });
    }

    return { uploadFile };

}