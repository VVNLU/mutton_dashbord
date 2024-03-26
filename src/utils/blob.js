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