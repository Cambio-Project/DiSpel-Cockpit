import fs from 'fs';

export async function exportJsonAsFile(formData: FormData, type: string, fileName: string, fileContent: any) {
    await fs.promises.writeFile(fileName, JSON.stringify(fileContent));

    const file = await fs.promises.readFile("./" + fileName)
    const blob = new Blob([file], {type: 'application/octet-stream'});
    formData.append(type, blob, fileName)
    await fs.promises.unlink(fileName);
}