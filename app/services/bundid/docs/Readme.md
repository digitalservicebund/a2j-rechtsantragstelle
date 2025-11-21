## SAML sequence diagram

```Mermaid
sequenceDiagram

    participant User
    participant Service Provider (App)
    participant Identity Provider (BundID)

    Service Provider (App) ->> User: Render HTML form with SAMLRequest
    User->>Service Provider (App): Click "Submit"
    Service Provider (App) ->> Identity Provider (BundID): POST SAMLRequest (+ redirect) to id.bund.de
    Identity Provider (BundID) ->> User: BundId auth flow
    User->> Identity Provider (BundID): Credentials (Ausweis)
    Identity Provider (BundID) ->> Service Provider (App): POST SAMLResponse (+ redirect) to /success
    Service Provider (App) ->> Service Provider (App): Validate response, extract attributes
    Service Provider (App) ->> User: Show user info (vorname, nachname)
```
