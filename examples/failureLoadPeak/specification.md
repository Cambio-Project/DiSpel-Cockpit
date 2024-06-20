# Example: Instance Failure + Load Peak

## Description

Immediately after an instance failure caused by a software bug, the number of wage clerks using the system rises
exponentially. This happens during the payslip period at regular service hours.
The system is expected to perform within a guaranteed tolerance, meaning wage clerks always get correct answers within
1s (99% of all cases).
Our hypothesis is that the autoscaler, a key component of our system, plays a crucial role in mitigating the effects of
the stimulus. By dynamically adjusting the system's resources, it helps maintain the system's performance even during
peak usage, potentially mitigating the impact of the software bug.

## Environment

This example scenario requires the following files and parameters to be used in the environment.

| Field              | File                              |
|--------------------|-----------------------------------|
| Architecture       | architecture_tltea_scenario1.json |
| Experiment         | experiment_basic.json             |
| Load               | load_const20ArrivalRates.csv      |
| Monitoring Data    | monitoring_data_full_example.csv  |
| Search Window Size | 60                                |

## Stimuli

### Patterns

**1. Pattern**

Use the Existence Pattern with the Globally scope. Select the command *killExampleServiceInstance*. Select a time bound
between 20 and 20 time units. The result should look as follows:

> Globally, {killExampleServiceInstance} [holds] eventually between 20 and 20 time units.

**2. Pattern**

Use the Response Pattern with the Globally scope. Select the listener *InjectionOfFailure* and the command
*LoadPeakIncrease*. Select a time bound between 0 and 2 time units. The result should look as follows:

> Globally, if {InjectionOfFailure} [has occurred] then in response {LoadPeakIncrease} [eventually holds] between 0 and
> 2 time units.

**3. Pattern**

Use the Response Pattern with the Globally scope. Select the listener *InjectionOfFailure* and the command
*LoadPeakHold*. Select a time bound between 22 and 22 time units. The result should look as follows:

> Globally, if {InjectionOfFailure} [has occurred] then in response {LoadPeakHold} [eventually holds] between 22 and 22
> time units.

**4. Pattern**

Use the Response Pattern with the Globally scope. Select the listener *InjectionOfFailure* and the command
*LoadPeakDrop*. Select a time bound between 32 and 32 time units. The result should look as follows:

> Globally, if {InjectionOfFailure} [has occurred] then in response {LoadPeakDrop} [eventually holds] between 32 and 32
> time units.

### Commands

**killExampleService**

Create a kill command named *killExampleService* with the following content:
> kill[example-service,1]) & (event[injection-of-failure]

**LoadPeakIncrease**

Create a kill command named *LoadPeakIncrease* with the following content:
> load[0,20][x5:exponential:gateway.INTERNAL_DEP]

**LoadPeakHold**

Create a kill command named *LoadPeakHold* with the following content:
> load[0,10][x5:constant:gateway.INTERNAL_DEP]

**LoadPeakDrop**

Create a kill command named *LoadPeakDrop* with the following content:
> load[0,5][x5:linear-inverse:gateway.INTERNAL_DEP]

### Listeners

**InjectionOfFailure**

Create an event listener named *InjectionOfFailure* with the following content:
> event[injection-of-failure]

## Responses

### Patterns

**RT Check**

Use the Universality Pattern with the Globally scope. Select the event *ResponseTimeOK*. The result should look as
follows:

> Globally, it is always the case that {ResponseTimeOK} [holds].

### Events

**ResponseTimeOK**

Create an event named *ResponseTimeOK* with the following settings:

| Field              | File             |
|--------------------|------------------|
| Predicate Name     | ResponseTimeOK   |
| Predicate Logic    | smallerEqual     |
| Measurement Source | AllResponseTimes |
| Comparison Value:  | 1                |
