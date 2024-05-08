import {appendExistingFile} from "~/server/utils/appendExistingFile";
import {exportStimuli} from "~/server/utils/exportStimuli";

export default defineEventHandler(async (event) => {

    const body = await readBody(event)
    const simulationID = JSON.parse(body).simulationID

    const scenario = await Scenario.findOne({simulationID: simulationID})

    const monitoringData = scenario!.environment!.monitoringData

    const formData = new FormData();

    for (const monitoringFile of monitoringData) {
        const monitoringName = Object.keys(monitoringFile)[0]
        await appendExistingFile(formData, "monitoring_data", monitoringName, "./uploaded/")
    }

    await exportStimuli(formData, "mtls", scenario)

    formData.append("simulation_id", simulationID)
    const config = useRuntimeConfig(event)
    const moSimResponse = await fetch("http://" + config.public.moSimDomain + ":" + config.public.moSimPort + "/search/upload", {
        method: "POST",
        body: formData
    });

    const resText = await moSimResponse.text()
    return {
        "simulationID": simulationID,
        "status": resText,
    };
})