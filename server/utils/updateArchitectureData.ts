import {exportJsonAsFile} from "~/server/utils/appendJsonAsFile";
import {NitroRuntimeConfig} from "nitropack";


export const updateArchitectureData = async (simulationID: string, config: NitroRuntimeConfig) => {
    const scenario = await Scenario.findOne({simulationID: simulationID})
    const architectureArray = scenario!.environment!.architecture;

    const formData = new FormData();

    for (const architecture of architectureArray) {
        const architectureName = Object.keys(architecture)[0]
        const architectureContent = architecture[architectureName]
        await exportJsonAsFile(formData, "architectures", architectureName, architectureContent)
    }

    const miSimResponse = await fetch("http://" + config.public.miSimDomain + ":" + config.public.miSimPort + "/analyze/upload", {
        method: "POST",
        body: formData
    });

    scenario!.architectureData = await miSimResponse.json();
    await scenario!.save()
}

