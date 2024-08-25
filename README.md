# DiSpel Cockpit

1. [Description](#description)
1. [Installation](#install)
1. [Usage](#use)

## <a name="description" /> Description

The Dispel Cockpit is an all-in-one, multi-functional application. It's designed to allow software architects to
specify (testable) scenarios, collect data from different sources (simulation, monitoring), verify the scenarios against
the results, and refine the response specifications. The functionalities of the Cockpit include:

- **Scenario Creation**: Users can create scenarios by providing specifications of the stimuli and responses using the
  Property Specification Patterns. Additional information must be provided to allow for quantitative analyses, e.g.,
  architecture and experiment files in JSON format.
- **Data Collection**: Scenarios can be simulated and monitoring data can be searched for existing scenario occurrences
  based on the stimuli specifications.
- **Verification**: After data collection, the output can be verified. The response text color indicates whether the
  response passes validation and statistics are computed.
- **Refinement**: Finally, users can refine the responses using the built-in TQPropRefiner interface by investigating
  and adjusting parameters and timing specifications.
- **Configuration**: The Cockpit provides an overview of all required services, indicating their availability.

The DiSpel Cockpit can be set up either using Docker Compose (recommended) or manually.

## <a name="install" /> How to install

There are two ways to use the Cockpit.
The simplest is with the provided ``docker-compose.yml`` file which contains all required components.
The other is to build it locally, whereby you have to make sure that the respective connections of the components are
correct.

### Docker

**Requirements:** Docker

1. Copy the content (or the file itself) from the ``docker-compose.yml`` in an empty folder.
    - Docker will need write access in that directory
2. Copy the content (or the file itself) from the ``.env`` in the same folder.
3. Start Docker with the command ```docker compose up -d```
    - The flag ```-d``` starts the containers in the background
4. After all Container are started up, you can reach the Cockpit via your browser at ``http://localhost:8080``

### Manual setup

_(Not recommended)_

**Requirements:** Node

1. Clone or download this Repository.
2. Adjust the URL and Ports in the ```.env``` file in this repository to match your service setup.
3. Now you cloud either run the Cockpit in dev mode or in build mode
    1. **Development Mode**
        1. Make sure that you have all dependencies installed: ``npm install``
        2. Start the Cockpit with the command: ``npm run dev``
    2. **Build Mode**
        1. Run the command: ```npm run build```
        2. Go to your build file and start the endpoint with your Node environment.

Note: TQPropRefiner currently requires the Cockpit to run on port 8080, otherwise refinements can not be sent
back.

## <a name="use" /> How to use

### General Usage Workflow

1. **Startup:** You will find an overview of all required services on the 'Configuration' page, which is also the
   starting page. A green
   light signals that the
   service is available. If the service is red something is wrong with your setup. A yellow light signals that some
   services are not available. The status of dependencies is also visible in the menu bar on every page.
2. **Create a Scenario:** The next step is to go to the scenario overview where you can see and add scenarios. Click on
   add Scenario to start the process.
    - **Add Metadata:**  You can add a scenario name, description, and category.
    - **Add Environment:** For the data collection to work, it is required to upload MiSim architecture and experiment
      file in ``.json``
      format.
      Its also required that all dependent additional load files that MiSim needs to run those configuration are added
      in this
      step.
      For the search in monitoring data to work, the monitoring data has to be provided as ``.csv`` file and a search
      window size (in time units) has to be defined. Found occurrences will be of this size.
    - **Create Stimuli and Responses:** In the Stimuli and Response window you have access to all fields that are also
      available in the
      PSPWizard in order to select and specify a Property Specification Pattern.
    - **Create Commands, Listeners, Events:** For stimuli, you can create commands (currently service killing and load
      modification) and listeners (currently listening to a thrown event). For responses, you can create custom events
      that are persistent.
      Here you can define measurement sources which are basically metrics that have to be present in simulation data and
      monitoring data.
3. **Collect Data:** After the creation of a scenario you can find the scenario in the overview.
   From there you can start the simulation with MiSim or the search with MoSIM. You will be notified on this page when
   the data generation finished.
4. **Verify Scenario:** When the data collection finished, you can verify the data with the verify simulation button
   or the verify search button.
   The color of the response text on the `Scenario Details' page will indicate whether the response is satisfied for a
   specific run or not.
5. **Refine Scenario:** Finally you can start the response refinement on the 'Scenario Details' page. With the click of
   the button you will be
   redirected to the interface of the TQPropRefiner.
   Here you can use all the provided functionality and save the refined specification in the Cockpit.

### Video Showcase & Example Scenario

The example scenario *Service Instance Failure + Load Peak*, including all specifications and files, is provided as part
of this project in ``examples / failureLoadPeak``. This example is used in the following tool demonstration vide.

[![](https://markdown-videos.vercel.app/youtube/gP6USBfOuxY)](https://youtu.be/gP6USBfOuxY)

