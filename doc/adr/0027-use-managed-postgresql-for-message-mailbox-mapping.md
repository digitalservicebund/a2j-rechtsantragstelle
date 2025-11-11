# 27. Use managed PostgreSQL for message / mailbox mapping

Date: 2025-11-01

## Status

Accepted

## Timeline

- 2025-11-03: Drafted
- 2025-11-11: Accepted

## Context

We have a new requirement to store a persistent, reliable mapping between ERV message IDs and BundID/ZBP mailbox handles. This mapping is critical for delivery of messages to the correct recipients. The system must be highly available and support durable data storage with reliable recovery mechanisms.

## Decision

We will use a new managed PostgreSQL service (e.g., OTC RDS PostgreSQL) as the data store for mapping message IDs to mailbox handles.

## Consequences

### Positive

- Reliability & Durability: Managed services provide automated, reliable backups and point-in-time recovery, fulfilling our core requirement for data safety.

- High Availability: These services offer built-in, easily configured read replicas and multi-AZ failover, significantly reducing downtime and operational complexity.

- Reduced Operational Overhead: All database management tasks (patching, backups, replication, monitoring) are handled by the cloud provider, freeing up engineering resources.

- Improved Security Posture: By creating a dedicated database for this specific function, we can tightly restrict network and application access. For example, our main web application pods will not require credentials to this database, reducing the overall attack surface.

- Data Integrity: PostgreSQL provides strong ACID (Atomicity, Consistency, Isolation, Durability) guarantees, which is ideal for a critical mapping table.

- Scalability: We can easily scale the database (storage and compute) vertically and, for read-heavy workloads, horizontally with replicas.

### Negative

- Cost: Introduces a new, dedicated cost center compared to leveraging an existing service.

- Latency: Will likely have slightly higher read/write latency compared to an in-memory solution like Redis. However, for this use case, durability and reliability are prioritized over microsecond-level performance.

## Considered Alternatives

1. Use Existing Redis Instance
   - Description: Leverage our current Redis instance (used for caching) to also store this mapping.

   - Pros:
     - No new infrastructure cost.

     - Very low latency for reads and writes.

   - Cons (Reasons for Rejection):
     - Backup & Recovery: Our current Redis setup is primarily for caching and lacks the robust, managed backup and disaster recovery processes required for this critical, persistent data.

     - Operational Overhead: Implementing and managing reliable persistence (e.g., RDB snapshots, AOF) and high-availability replicas for Redis would fall on our team, which is precisely the operational burden we want to avoid.

     - Data Guarantee Model: Redis's persistence models are not as iron-clad as PostgreSQL's. While good, they are not its primary design center. This data is not transient and must not be lost.

2. Self-hosted PostgreSQL on VM/Kubernetes
   - Description: Install and manage our own PostgreSQL instance.

   - Pros:
     - Full control over configuration and versioning.

     - Potentially lower direct cost than a managed service.

   - Cons (Reasons for Rejection):
     - High Operational Overhead: This would require our team to manage VM/container health, database installation, version upgrades, security patching, monitoring, and—most importantly—manually configuring and testing backups and replication. This is a significant, undifferentiated workload.

3. Other open source RDBMS (managed or self hosted)
   - Cons (Reasons for Rejection):
     - Inconsistent with the organisational "sensible default", `PostgreSQL`.
