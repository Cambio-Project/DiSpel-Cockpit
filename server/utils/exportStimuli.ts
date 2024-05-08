import fs from 'fs';

export async function exportStimuli(formData: FormData, type: string, scenario: any) {
    let fileContent = "";
    for (let stimulus of scenario.stimuli!) {
        fileContent = fileContent + stimulus.MTL + "\n"
    }
    let fileName = scenario.simulationID!
    await fs.promises.writeFile(fileName, fileContent);

    const file = await fs.promises.readFile("./" + fileName)
    const blob = new Blob([file], {type: 'application/octet-stream'});
    formData.append(type, blob, fileName)
    await fs.promises.unlink(fileName);
}