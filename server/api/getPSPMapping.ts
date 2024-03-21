// endpoint for getting a PSPMapping from the PSPWizard
export default defineEventHandler(async (event) => {

    // read body
    const body = await readBody(event)

    const config = useRuntimeConfig(event)
    // endpoint of the PSPWizard
    const url = "http://"+config.public.pspDomain+":"+config.public.pspPort+"/transformPattern"

    console.log(url)

    // sending the request
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });

    // awaiting the response
    const pspResponse = await response.json()

    // returning the response
    return {
        result: pspResponse
    }
})