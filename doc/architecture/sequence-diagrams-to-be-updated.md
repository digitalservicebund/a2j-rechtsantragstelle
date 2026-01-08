# Application Data Flow - Sequence Diagrams

## 1. Initial Request Handling

```mermaid
sequenceDiagram
autonumber
actor Browser
participant Express as Express Server
participant RR as React Router
participant RouteConfig as routes.ts
participant RouteModule as formular.ts

    Browser->>Express: GET /beratungshilfe/antrag/start
    Express->>Express: Static file middleware (no match)
    Express->>RR: reactRouterHandler (catch-all)
    RR->>RouteConfig: Match URL to route
    RouteConfig-->>RR: routes/shared/formular.ts
    RR->>RouteModule: loader({ request, params })
    RouteModule-->>RR: { userData, cmsContent, ... }
    RR->>RouteModule: render default component
    RouteModule-->>RR: <FormFlowPage />
    RR-->>Express: HTML response
    Express-->>Browser: HTTP 200 + HTML

```

---

## 2. Formular Page - POST Request (Form Submission) - TO BE UPDATED

```mermaid
sequenceDiagram
    participant Client
    participant Action
    participant CSRFValidator
    participant MainSession
    participant SessionManager
    participant Redis@{"type": "database"}
    participant Validator
    participant PageSchemas
    participant FlowController
    participant Pruner
    participant AsyncActions
    participant S3@{"type": "database"}

    Client->>Action: POST formData + CSRF token

    Action->>CSRFValidator: validatedSession(request)
    CSRFValidator->>MainSession: getCSRFFromSession()
    MainSession-->>CSRFValidator: csrfTokens[]
    CSRFValidator->>CSRFValidator: validate(formToken, sessionTokens)
    CSRFValidator-->>Action: valid / 403 Forbidden

    alt File Upload/Delete Action
        Action->>S3: uploadUserFileToS3 / deleteUserFileFromS3
        S3-->>Action: fileKey
        Action->>SessionManager: updateSession(fileMetadata)
        SessionManager->>Redis: update userData
        Action-->>Client: return updated userData
    else Standard Form Submission
        Action->>Validator: validateFormUserData(formData, pathname)
        Validator->>PageSchemas: getPageSchema(pathname)
        PageSchemas-->>Validator: zodSchema
        Validator->>Validator: parseFormData(formData, schema)
        Validator-->>Action: validatedData or validationError

        alt Validation Failed
            Action-->>Client: validationError (with field errors)
        else Validation Passed
            Action->>SessionManager: getSession(flowId, cookie)
            SessionManager->>Redis: get current userData
            Redis-->>SessionManager: userData

            Action->>SessionManager: updateSession(validatedData)
            Note over Action: Merge new data into session

            Action->>Pruner: pruneIrrelevantData(mergedData, flowId)
            Pruner-->>Action: prunedData

            Action->>AsyncActions: postValidationFlowAction(stepId, prunedData)
            Note over AsyncActions: e.g., storeConsent to S3

            Action->>FlowController: flowDestination(pathname, prunedData)
            FlowController-->>Action: nextStepId

            Action->>SessionManager: commitSession()
            SessionManager->>Redis: persist userData

            Action-->>Client: redirectDocument(nextStep, Set-Cookie)
        end
    end
```

---

## 3. Vorabcheck Page - GET/POST Request - TO BE UPDATED

```mermaid
sequenceDiagram
    participant Client
    participant Loader
    participant SessionManager
    participant Redis@{"type": "database"}
    participant FlowConfig
    participant FlowController
    participant Pruner
    participant CMS@{"type": "database"}
    participant Validator
    participant PageSchemas

    Note over Client,PageSchemas: GET Request (similar to Formular)

    Client->>Loader: GET /flowId/vorabcheck/stepId

    Loader->>SessionManager: getSessionData(flowId, cookie)
    SessionManager->>Redis: get userData
    Redis-->>Loader: userData

    Loader->>FlowConfig: getFlow(flowId)
    Loader->>Pruner: pruneIrrelevantData(userData, flowId)
    Pruner->>FlowController: buildFlowController(config, userData, guards)
    FlowController-->>Loader: validate stepId reachable

    par
        Loader->>CMS: fetchFlowPage("vorab-check-pages", flowId, stepId)
        CMS-->>Loader: pageContent, formElements
    and
        Loader->>PageSchemas: getPageSchema(pathname)
        PageSchemas-->>Loader: fieldNames for stepData
    end

    Loader-->>Client: SSR page with stepData

    Note over Client,PageSchemas: POST Request

    Client->>Loader: POST formData

    Loader->>Validator: validateFormData(pathname, formData)
    Validator->>PageSchemas: getPageSchema / schemaForFieldNames
    PageSchemas-->>Validator: zodSchema
    Validator-->>Loader: validatedData or error

    Loader->>SessionManager: updateSession(validatedData)
    SessionManager->>Redis: persist

    Loader->>FlowController: flowDestination(pathname, userData)
    FlowController-->>Loader: nextStepId

    Loader-->>Client: redirect to nextStep
```

---

## 4. Result Page - GET Request - TO BE UPDATED

```mermaid
sequenceDiagram
    participant Client
    participant Loader
    participant SessionManager
    participant Redis@{"type": "database"}
    participant FlowController
    participant CMS@{"type": "database"}
    participant StringReplacements

    Client->>Loader: GET /flowId/ergebnis/resultType

    Loader->>SessionManager: getSessionData(flowId, cookie)
    SessionManager->>Redis: get userData
    Redis-->>Loader: userData

    Loader->>FlowController: validate stepId reachable

    Loader->>CMS: fetchFlowPage("result-pages", flowId, resultType)
    CMS-->>Loader: resultPageContent

    Loader->>StringReplacements: applyStringReplacement(content, userData)
    StringReplacements-->>Loader: personalizedContent

    Loader->>FlowController: getPrevious(stepId)
    FlowController-->>Loader: backDestination

    Loader-->>Client: SSR result page
```

---

## 5. PDF Download - TO BE UPDATED

```mermaid
sequenceDiagram
    participant Client
    participant Loader
    participant SessionManager
    participant Redis@{"type": "database"}
    participant Pruner
    participant PDFService
    participant S3@{"type": "database"}
    participant CMS

    Client->>Loader: GET /flowId/.pdf

    Loader->>SessionManager: getSessionData(flowId, cookie)
    SessionManager->>Redis: get userData
    Redis-->>Loader: userData

    Loader->>Pruner: pruneIrrelevantData(userData, flowId)
    Pruner-->>Loader: prunedData

    Loader->>CMS: fetchTranslations(flowId)
    CMS-->>Loader: translations

    Loader->>PDFService: pdfFromUserdata(prunedData, sessionId, translations)

    opt User uploaded files
        PDFService->>S3: getUserFilesFromS3(sessionId, flowId)
        S3-->>PDFService: file buffers
    end

    PDFService-->>Loader: PDF Uint8Array

    Loader-->>Client: Response(PDF, content-disposition: attachment)
```

---

## 6. BundID Authentication Flow - TO BE UPDATED

```mermaid
sequenceDiagram
    participant Client
    participant BundIDRoute
    participant SAMLService
    participant BundIDProvider
    participant SessionManager

    Client->>BundIDRoute: GET /bundid

    BundIDRoute->>SAMLService: generateSamlRequest(backUrl)
    SAMLService-->>BundIDRoute: {url, samlRequest}

    BundIDRoute-->>Client: HTML form with SAMLRequest

    Client->>BundIDProvider: POST SAMLRequest (user redirected)

    Note over BundIDProvider: User authenticates

    BundIDProvider-->>Client: POST SAMLResponse to callback

    Client->>BundIDRoute: POST /bundid/success (SAMLResponse)

    BundIDRoute->>SAMLService: validateSamlResponse(response)
    SAMLService-->>BundIDRoute: validated user attributes

    BundIDRoute->>SessionManager: store user data in session

    BundIDRoute-->>Client: redirect to flow
```
