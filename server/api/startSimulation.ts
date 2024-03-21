import fs from 'fs';

// endpoint for starting the MiSim Simulation
export default defineEventHandler(async (event) => {

    const body = await readBody(event)
    const simulationID = JSON.parse(body).simulationID

    var res;
    // get the scenario from the MongoDB
    const scenario = await Scenario.findOne({simulationID: simulationID})

    const stimuliArray = scenario!.stimuli;

    //console.log(stimuliArray)
    const formData = new FormData();

    // fill the formData with necessary information
    for (const stimuli of stimuliArray) {
        const fileName = Object.keys(stimuli)[0]

        if (fileName.split(".").pop() === "json"){
            const fileContent = stimuli[fileName]

            await fs.promises.writeFile(fileName, JSON.stringify(fileContent));

            const file = await fs.promises.readFile("./"+fileName)
            const blob = new Blob([file], { type: 'application/octet-stream' });
            formData.append("files", blob, fileName)
            await fs.promises.unlink(fileName);


        } else {
            const file = await fs.promises.readFile("./uploaded/"+fileName)
            const blob = new Blob([file], { type: 'application/octet-stream' });
            formData.append("files", blob, fileName)
        }
    }

    formData.append("simulation_id", simulationID)
    console.log(formData)

    const config = useRuntimeConfig(event)

    // send the request to MiSim
    const miSimResponse = await fetch("http://"+config.public.miSimDomain+":"+config.public.miSimPort+"/simulate/upload", {
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