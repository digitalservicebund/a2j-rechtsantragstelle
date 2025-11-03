# 26. Use RabbitMQ as Message Broker

Date: 2025-11-03

## Status

Proposed

## Context

To deliver applications to courts, our service needs a reliable way to process messages and retry in cases of failures or crashes.
We also want to decouple the message processing and sending from the creation of the application.

The core requirements for this system are:

1. High Reliability: Messages (jobs) must not be lost. We need a robust "at-least-once" delivery guarantee and a way to handle messages that repeatedly fail processing (i.e., "poison pills").

2. Team Experience: The development team has limited prior experience with message brokers or complex distributed systems. The chosen solution must have a manageable learning curve, good documentation, and strong out-of-the-box features that don't require extensive custom-builds for reliability.

3. Low Throughput (Currently): Our current needs are for low-to-moderate throughput (thousands of messages per day, not millions per second). Extreme scalability and raw speed are low priorities.

## Decision

We will adopt RabbitMQ as our primary message broker.

This decision is based on RabbitMQ's "smart broker, dumb consumer" model. It is a mature, feature-complete broker that shifts the burden of reliability from the application (the consumer) to the broker itself.

Key features that meet our requirements:

- Message Acknowledgments (ACK/NACK): The broker requires consumers to explicitly confirm a message has been successfully processed (ACK). If a consumer crashes or fails, the message is automatically requeued.

- Dead Letter Queues (DLQs): This is a critical, built-in feature. If a consumer rejects a message (NACK), the broker can be configured to automatically route this "poison pill" message to a separate queue (the DLQ) for inspection. This prevents a single bad message from halting the entire processing pipeline.

- Management UI: The built-in web-based management UI provides excellent visibility for a team learning the system. We can easily inspect queues, monitor message rates, and debug issues.

- Flexible Routing: RabbitMQ's model of exchanges and queues provides flexible and powerful routing logic that can adapt to our needs as they grow more complex.

## Consequences

### Positive

- High Reliability OOTB: We get robust ACK/NACK logic, message persistence, and dead-letter queue handling without writing any complex, custom client-side code. This directly addresses our primary concern.

- Faster Onboarding: The team can focus on writing business logic inside the consumer, not on the complex, error-prone plumbing of failure handling. The Management UI will significantly shorten debugging and learning cycles.

- Mature Ecosystem: RabbitMQ is well-established with stable client libraries for all major programming languages.

### Negative

- New Infrastructure: This adds a new, stateful service to our stack that must be deployed, monitored, and maintained (unlike Redis, which we already use for caching).

- Scalability Ceiling: RabbitMQ does not scale to the same extreme throughput levels as Kafka. If our system needs to process millions of messages per second in the future, we might face a difficult migration. This is an acceptable trade-off based on our current (low-throughput) requirements.

## Considered Alternatives

1. Kafka
   - Description: A distributed, high-throughput, persistent event streaming log.

   - Reason for Rejection:
     - Operational Complexity: Kafka is notoriously complex to set up, tune, and manage. This is a poor fit for a team with low experience.

     - "Dumb Broker, Smart Consumer": Kafka has no built-in "Dead Letter Queue" or NACK mechanism. All reliability logic (handling retries, "poison pills," etc.) must be custom-built into every consumer application. This would place a massive, high-risk development burden on our team and directly contradicts our primary goals.

     - Overkill: It is designed for massive-scale data streaming, which is not our use case.

2. Redis Streams
   - Description: A persistent, append-only log data structure built into Redis.

   - Reason for Rejection:
     - Same "Dumb Broker" Problem: While much simpler to operate than Kafka, Redis Streams shares the same "smart consumer" problem. It provides the primitives for reliability (XACK, XPENDING, XCLAIM) but does not provide an automated system for handling failed messages or poison pills.

     - Manual Failure Handling: Our team would be responsible for writing code that:
       - Periodically calls XPENDING to find "stalled" messages from crashed consumers.

       - Calls XCLAIM to take ownership of those messages.

       - Manually tracks a retry count for each message.

       - Manually moves a "poison pill" message to a different stream (a manual DLQ).

     - High Risk, Low Reward: This is a significant amount of boilerplate and a major source of potential bugs. The convenience of "just using Redis" is not worth the risk and development cost compared to the OOTB reliability that RabbitMQ provides.
