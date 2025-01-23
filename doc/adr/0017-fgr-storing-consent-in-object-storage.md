# 17. FGR - Storing consent in OTC object storage (OBS)

Date: 2025-01-13

## Status

Accepted

## Context

As part of our compliance with German legal and GDPR requirements, we need
to temporarily store consent data. The data that needs to be stored is minimal:

- Unique Identifier
- Timestamp (human-readable date)
- Browser user agent (optional)

We evaluated different storage solutions including:

- Relational Databases (RDB)
- NoSQL Databases
- Object Storage

## Decision

We will use an Object Storage solution to store the temporary consent data. We will add a lifecycle rule that removes each file after 365 days from its creation.

### Technical Factors

- The S3 API is widely supported and allows easy migration to different providers if needed
- Simple data structure doesn't require complex querying capabilities
- No need for relationships or complex data modeling
- Implementation effort is minimal compared to setting up and maintaining a database

### Business Factors

- Temporary solution until "Erprobungsgesetz" is completed, bucket can be deleted 365 days after the last saved consent at the latest
- Cost-effective: approximately 1/3 of the cost compared to database solutions based on 1000 users per month
- No long-term commitment required
- Minimal operational overhead

### Risks

- Limited query capabilities (not relevant for our use case)

## Consequences

### Positive

- Quick implementation timeline
- Lower operational costs
- Easy to decommission when no longer needed
- Minimal maintenance required

### Negative

- Limited query capabilities if requirements change

## Notes

- Data format and structure specification not yet defined
- Monitor usage patterns and costs
- Document cleanup/decommissioning process when "Erprobungsgesetz" is completed
