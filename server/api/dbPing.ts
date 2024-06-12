import mongoose from "mongoose";

export default defineEventHandler(async (event) => {

    const config = useRuntimeConfig(event)

    const endpointStatus = {
        pspWizard: {
            domain: "http://" + config.public.pspDomain + ":" + config.public.pspPort,
            status: "red"
        },
        miSim: {
            domain: "http://" + config.public.miSimDomain + ":" + config.public.miSimPort,
            status: "red"
        },
        moSim: {
            domain: "http://" + config.public.moSimDomain + ":" + config.public.moSimPort,
            status: "red"
        },
        tbVerifier: {
            domain: "http://" + config.public.tbVerifierDomain + ":" + config.public.tbVerifierPort,
            status: "red"
        },
        tqPropRefiner: {
            domain: "http://tqproprefiner:80",
            status: "red"
        },
        db: {
            domain: "",
            status: "red"
        }
    };

    var someRed = false
    var someGreen = false

    for (let endpoint in endpointStatus) {
        if (endpoint === "db") {
            if (mongoose.connection.readyState === 1) {
                endpointStatus.db.status = "green"
                someGreen = true
            } else {
                someRed = true
            }
        } else {
            try {
                // @ts-ignore
                await fetch(endpointStatus[endpoint].domain, {method: 'POST'});
                // @ts-ignore
                endpointStatus[endpoint].status = "green"
                someGreen = true
            } catch (error) {
                someRed = true
            }
        }
    }

    let allStatus = "red"
    if (someGreen) {
        if (someRed) {
            allStatus = "yellow"
        } else {
            allStatus = "green"
        }
    }

    // @ts-ignore
    endpointStatus["all"] = {
        domain: "",
        status: allStatus
    }

    return endpointStatus;
});