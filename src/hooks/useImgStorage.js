import { ref, onUnmounted } from 'vue';
import { getStorage, ref as storageRef, getDownloadURL } from 'firebase/storage';
import { app as firebaseApp } from '@/firebase/index';

export default function useImgStorage() {
    const storage = getStorage(firebaseApp);
    const fileBaseUrl = ref('');

    const fetchFileBaseUrl = async () => {
        try {
            const bucketUrl = 'gs://mutton-dashboard.appspot.com';
            const url = await getDownloadURL(storageRef(storage, bucketUrl));
            fileBaseUrl.value = url;
        } catch (error) {
            console.error('Failed to fetch file base URL:', error);
        }
    };

    fetchFileBaseUrl();

    onUnmounted(() => {
        fileBaseUrl.value = '';
    });

    const getImageSrc = ({ filename, size = '100x' }) => {
        if (!filename) return '';
        return `${fileBaseUrl.value}/display/resize/${size}/${filename}`;
    };
    return {
        getImageSrc
    };
}
