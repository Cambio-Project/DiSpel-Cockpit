import fs from 'fs';

export default defineEventHandler(async (event) => {

    const body = await readBody(event)
    const simulationID = JSON.parse(body).simulationID

    const scenario = await Scenario.findOne({simulationID: simulationID})

    const architectureArray = scenario!.environment!.architecture;
    const experimentArray = scenario!.environment!.experiment;
    const loadArray = scenario!.environment!.load;

    const formData = new FormData();

    for (const architecture of architectureArray) {
        const architectureName = Object.keys(architecture)[0]
        const architectureContent = architecture[architectureName]
        await appendFile(formData, "architectures", architectureName, architectureContent)
    }

    for (const experiment of experimentArray) {
        const experimentName = Object.keys(experiment)[0]
        const experimentContent = experiment[experimentName]
        await appendFile(formData, "experiments", experimentName, experimentContent)
    }

    for (const load of loadArray) {
        const loadName = Object.keys(load)[0]
        const loadContent = load[loadName]
        await appendFile(formData, "loads", loadName, loadContent)
    }

    formData.append("simulation_id", simulationID)
    console.log(formData)

    const config = useRuntimeConfig(event)

    const miSimResponse = await fetch("http://" + config.public.miSimDomain + ":" + config.public.miSimPort + "/simulate/upload", {
        method: "POST",
        body: formData
    });

    const resText = await miSimResponse.text()
    console.log(resText)

    return {
        "simulationID": simulationID,
        "status": resText,
    };
})

async function appendFile(formData: FormData, type: string, fileName: string, fileContent: any) {
    if (fileName.split(".").pop() === "json") {
        await fs.promises.writeFile(fileName, JSON.stringify(fileContent));

        const file = await fs.promises.readFile("./" + fileName)
        const blob = new Blob([file], {type: 'application/octet-stream'});
        formData.append(type, blob, fileName)
        await fs.promises.unlink(fileName);


    } else {
        const file = await fs.promises.readFile("./uploaded/" + fileName)
        const blob = new Blob([file], {type: 'application/octet-stream'});
        formData.append(type, blob, fileName)
    }
}