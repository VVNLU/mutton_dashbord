export const readFileAsText = (file) => {
    return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = () => {
            const responseDate = reader.result
            resolve(responseDate)
        }
        reader.readAsText(file)
    })
}

export const fetchBlobData = (fileSrc, fileOption = null) => {
    return new Promise((resolve) => {
        fetch(fileSrc, fileOption)
            .then((res) => res.blob())
            .then((blob) => {
                resolve(readFileAsText(blob))
            })
    })
}