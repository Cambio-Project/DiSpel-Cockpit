import { User } from "~/server/models/user.model";
import mongoose from "mongoose";

// endpoint for pinging all other endpoints and checking their availability
export default defineEventHandler(async (event) => {

    const config = useRuntimeConfig(event)

    // start with setting every status to "red"
    const endpointStatus = {
        pspWizard: {
            domain: "http://"+config.public.pspDomain+":"+config.public.pspPort,
            status: "red"
        },
        miSim: {
            domain: "http://"+config.public.miSimDomain+":"+config.public.miSimPort,
            status: "red"
        },
        tbVerifier: {
            domain: "http://"+config.public.tbVerifierDomain+":"+config.public.tbVerifierPort,
            status: "red"
        },
        tqPropRefiner: {
            domain: "http://"+config.public.tqPropRefinerDomain+":"+config.public.tqPropRefinerPort,
            status: "red"
        },
        db: {
            domain: "",
            status: "red"
        }
    };

    // for every endpoint, check if it should be "green" instead
    for (let endpoint in endpointStatus) {
        if (endpoint === "db") {
            continue
        }
        try {
            // @ts-ignore
            const response = await fetch(endpointStatus[endpoint].domain, { method: 'POST' });
            console.log(response.status)
            // @ts-ignore
            endpointStatus[endpoint].status = "green"
        } catch (error) {}
    }

    if (mongoose.connection.readyState === 1){
        endpointStatus.db.status = "green"
    }

    return endpointStatus;
});