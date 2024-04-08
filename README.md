# Dispel Dashboard

## Description

The Dispel Dashboard is an all-in-one, multi-functional application. It's designed to allow users to create and simulate scenarios, verify the results of simulations, and refine responses. The functionalities of the dashboard include:
- **Setup**: The dashboard provides an overview of all required services, indicating their availability.
- **Scenario Creation**: Users can create scenarios by providing an architecture and experiment files in JSON format. It also allows adding scenario metadata (name, description, category), creating stimuli, defining responses, and persistent custom events which are used by the TbVerifier.
- **Simulation**: Scenarios can be simulated and users are notified upon completion of the simulation.
- **Validation**: After simulation, the output can be verified. The response text color indicates whether the response passes validation.
- **Refinement**: Finally, users can refine the responses using the built-in TqPropRefiner interface.

The dashboard can be set up either using Docker Compose (recommended) or manually.


## How to install 
There are two ways to use the dashboard. 
The simplest is with the provided ``docker-compose.yml`` file which contains all required components. 
The other is to build it locally, whereby you have to make sure that the respective connections of the components are correct.

### Docker 
**Requirements:** Docker

1. Copy the content (or the file itself) from the ``docker-compose.yml`` in an empty folder.
    - Docker will need write access in that directory
2. start Docker with the command ```docker compose up -d``` 
    - The flag ```-d``` starts the containers in the background
3. After all Container are startet up, you can reach the Dashboard via your browser at ``http://localhost:8080``

### Manual setup
_(Not recommended)_

**Requirements:** Node

1. Clone or download this Repository.
2. Adjust the URL and Ports in the ```.env``` file in this repository to match your service setup.
3. Now you cloud either run the Dashboard in dev mode or in build mode
    1. **Development Mode**
       1. Make sure that you have all dependencies installed: ``npm install``
       2. Start the Dashboard with the command: ``npm run dev``
    2. **Build Mode**
       1. Run the command: ```npm run build```
       2. Go to your build file and start the endpoint with your Node environment.

## How to use

1. **Startup:** On the Dashboard you will find an overview of all required services. A green light signals that the service is available. If the service is red something is wrong with your setup.
2. **Create a Scenario:** The next step is to go to the scenario overview where you can see and add scenarios. Click on add Scenario to start the process.
   - **Create a Stimuli:** For the stimuli it is required to upload MiSim architecture and experiment file in ``.json`` format. 
   Its also required that all dependent additional files that MiSim need to run those configuration are added in this step.
   Additionally, you can add a scenario name, description, and category.
   - **Create a Response:** In the Response window you have access to all fields that are also available in the PspWizard. Define here the response you want to test.
   - **Create Events:** You can create custom events that are persistent (in the installation of the dashboard).
   Here you can deine measurement scores which are later used by the TbVerifier. 
3. **Simulate Scenario:** After the create of a scenario you can find the scenario in the overview.
From there you can start the simulation with MiSim. You will be notified when the simulation finished.
4. **Validate Scenario:** When the simulation fished, you can verify the simulation with the verify simulation button. The color of the response text will indicate of the response validates or not.
5. **Refine Scenario:** Finally you can start the response refinement. With the click of the button you will be redirected to the interface of the TqPropRefiner. 
Here you can use all the provided functionality and save the results in the dashboard.
