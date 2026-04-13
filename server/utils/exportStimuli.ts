import fs from 'fs';

export enum AnalysisType {
    Simulation,
    Monitoring
}

export async function exportStimuli(formData: FormData, type: string, scenario: any, analysisType: AnalysisType) {
    let fileContent = "";
    switch (analysisType) {
        case AnalysisType.Simulation:
            fileContent = getSimulationMTLs(scenario)
            break;
        case AnalysisType.Monitoring:
            fileContent = getMonitoringMTLs(scenario)
            break;
    }

    let fileName = scenario.simulationID!
    await fs.promises.writeFile(fileName, fileContent);

    const file = await fs.promises.readFile("./" + fileName)
    const blob = new Blob([file], {type: 'application/octet-stream'});
    formData.append(type, blob, fileName)
    await fs.promises.unlink(fileName);
}

function getSimulationMTLs(scenario: any): string {
    let fileContent = "";
    for (let stimulus of scenario.stimuli!) {
        if (stimulus.simulationChecked) {
            const formula = determineFormula(stimulus)
            fileContent = fileContent + formula + "\n"
        }
    }
    return fileContent
}

function getMonitoringMTLs(scenario: any): string {
    let fileContent = "";
    for (let stimulus of scenario.stimuli!) {
        if (stimulus.monitoringChecked) {
            const formula = determineFormula(stimulus)
            fileContent = fileContent + formula + "\n"
        }
    }
    return fileContent
}

function determineFormula(stimulus: any): string{
    if(stimulus.specification.selectedTimeBound == null){
        return stimulus.LTL
    }else{
        return stimulus.MTL
    }
}