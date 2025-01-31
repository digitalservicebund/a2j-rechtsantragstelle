# 20. Single OTC Bucket Instance for RAST and ZOV

Date: 2025-01-28

## Status

Accepted

## Context

Initially, a bucket was created specifically for the Fluggastrechte (ZOV) to handle consent files. However, as the Rechtsantragstelle (RAST) also requires file upload capabilities, we need to decide whether to create separate buckets for each stream or use a single, shared bucket instance.

Having multiple buckets would mean:

- More infrastructure to maintain
- Separate configurations and permissions to manage
- Higher costs
- Potential inconsistencies in implementation

## Proposal

We propose using a single OTC S3 bucket instance shared between RAST and ZOV, with a unified access service layer that provides scoped interfaces for different use cases. The architecture would look like:

1. Single S3 Bucket

   - Shared storage infrastructure for both RAST and ZOV
   - Different retention policies based on prefix:
     - ZOV consent files: 365 days retention
     - RAST user files: 24 hours retention
   - Common access controls and other configurations

2. Unified S3 Access Service

   - Central service handling all S3 operations
   - Implements proper error handling and logging
   - Manages bucket lifecycle and configuration
   - Handles different retention periods through object metadata and lifecycle rules

3. Scoped Interfaces
   - `saveConsent()` - Specifically for ZOV consent files
   - `saveUserFile()` - For RAST user-uploaded documents
   - Additional methods can be added as needed
   - Each interface enforces its own validation and business rules

This approach provides several benefits:

- Simplified configuration and maintenance of a single infrastructure component
- Consistent implementation of file storage operations
- Easier migration path if we need to change storage solutions in the future
- Reduced operational costs compared to multiple buckets
- Single point of monitoring and logging

## Consequences

- The existing ZOV bucket will need to be renamed to reflect its shared nature
- Bucket configuration needs to be updated to:
  - Add lifecycle rules for different retention periods based on object prefixes
  - Adjust permissions to allow access from both RAST and ZOV services
- Documentation needs to be updated to reflect the new shared infrastructure
- Cost monitoring should be set up to track usage by different services
