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

export async function exportEndModes(formData: FormData, type: string, scenario: any) {
    let endModes: boolean[] = [];
    for (let stimulus of scenario.stimuli!) {
        if (stimulus.monitoringChecked) {
            endModes.push(determineEndMode(stimulus));
        }
    }
    formData.append(type, JSON.stringify(endModes));
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
            // replace $END with the actual end mode formula for MoSIM
            const formula = determineFormula(stimulus).replaceAll("$END", "(($b:end) == (true))")
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

function determineEndMode(stimulus: any): boolean{
    if(stimulus.specification.selectedTimeBound == null){
        return stimulus.LTL_requires_end_mode
    }
    else{
        return stimulus.MTL_requires_end_mode
    }
}