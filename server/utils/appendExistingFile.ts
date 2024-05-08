import fs from 'fs';

export async function appendExistingFile(formData: FormData, type: string, fileName: string, directory: string) {
    const file = await fs.promises.readFile(directory + fileName)
    const blob = new Blob([file], {type: 'application/octet-stream'});
    formData.append(type, blob, fileName)
}