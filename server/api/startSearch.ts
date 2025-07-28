import {appendExistingFile} from "~/server/utils/appendExistingFile";
import {AnalysisType, exportStimuli} from "~/server/utils/exportStimuli";
import fs from "fs";
import {pushSearchNames} from "~/server/utils/pushSearchResult";

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

    await exportStimuli(formData, "mtls", scenario, AnalysisType.Monitoring)

    formData.append("simulation_id", simulationID)
    formData.append("search_window_size", scenario!.searchWindowSize!)
    const config = useRuntimeConfig(event)
    const moSimResponse = await fetch("http://" + config.public.moSimDomain + ":" + config.public.moSimPort + "/search/upload", {
        method: "POST",
        body: formData
    });

    // Update result names
    const searchResultFolder = 'data/search_results/' + simulationID;
    if (fs.existsSync(searchResultFolder)) {
        // metadata file
        const metadataFile = searchResultFolder + '/metadata.json';
        const metadataContent = JSON.parse(fs.readFileSync(metadataFile, 'utf-8'));
        await pushSearchNames(simulationID, metadataContent)
    }

    const resText = await moSimResponse.text()
    return {
        "simulationID": simulationID,
        "status": moSimResponse.ok,
        "text": resText,
    };
})