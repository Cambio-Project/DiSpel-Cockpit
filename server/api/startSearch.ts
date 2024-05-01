import fs from 'fs';

export default defineEventHandler(async (event) => {

    const body = await readBody(event)
    const simulationID = JSON.parse(body).simulationID

    const scenario = await Scenario.findOne({simulationID: simulationID})

    const monitoringData = scenario!.environment!.monitoringData
    const mtlFiles = scenario!.environment!.mtlFiles

    const formData = new FormData();

    for (const monitoringFile of monitoringData) {
        const monitoringName = Object.keys(monitoringFile)[0]
        const monitoringContent = monitoringData[monitoringName]
        await appendFile(formData, "monitoring_data", monitoringName, monitoringContent)
    }

    for (const mtlFile of mtlFiles) {
        const mtlName = Object.keys(mtlFile)[0]
        const mtlContent = mtlFiles[mtlName]
        await appendFile(formData, "mtls", mtlName, mtlContent)
    }

    formData.append("simulation_id", simulationID)
    console.log(formData)

    const config = useRuntimeConfig(event)

    const moSimResponse = await fetch("http://" + config.public.moSimDomain + ":" + config.public.moSimPort + "/search/upload", {
        method: "POST",
        body: formData
    });

    const resText = await moSimResponse.text()
    console.log(resText)

    return {
        "simulationID": simulationID,
        "status": resText,
    };
})

async function appendFile(formData: FormData, type: string, fileName: string, fileContent: any) {
    const file = await fs.promises.readFile("./uploaded/" + fileName)
    const blob = new Blob([file], {type: 'application/octet-stream'});
    formData.append(type, blob, fileName)
}