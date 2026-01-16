# FormFlowPage - High Level Data Flow

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Browser
    participant ReactComponents as React Components
    participant FormFlowPage as FormFlowPage (Server)
    participant UserDataStorage@{"type": "database", "label": "UserDataStorage (Redis)"}
    participant Pruner
    participant FlowController
    participant PageSchemas
    participant CMS@{"type": "database", "label": "Content Service"}

    rect rgb(230, 245, 255)
        Note over User,CMS: GET Request - Loading a Form Page
        User ->> Browser: Navigate to /flowId/stepId
        Browser ->> FormFlowPage: GET /flowId/stepId
        activate FormFlowPage

        FormFlowPage ->> UserDataStorage: getSessionData(flowId, cookieHeader)
        activate UserDataStorage
        UserDataStorage -->> FormFlowPage: userData
        deactivate UserDataStorage

        FormFlowPage ->> Pruner: pruneIrrelevantData(userData, flowId)
        activate Pruner
        Pruner ->> FlowController: buildFlowController(userData)
        activate FlowController
        FlowController -->> Pruner: validFlowPaths
        deactivate FlowController
        Pruner ->> PageSchemas: getAllFieldsFromFlowId(flowId)
        activate PageSchemas
        PageSchemas -->> Pruner: validFormFields
        deactivate PageSchemas
        Pruner ->> Pruner: prune data
        Pruner -->> FormFlowPage: prunedData
        deactivate Pruner

        FormFlowPage ->> FlowController: buildFlowController(prunedData)
        activate FlowController
        FlowController -->> FormFlowPage: validate stepId
        deactivate FlowController

        alt step is not reachable
            FormFlowPage -->> Browser: redirectTo: flowController.getInitial()
            Browser -->> User: Navigate to initial step
        else step is reachable
            FormFlowPage ->> CMS: fetchFlowPage(flowId, stepId)
            activate CMS
            CMS ->> CMS: fetch contentEntry
            CMS ->> CMS: parse contentEntry
            CMS -->> FormFlowPage: cmsContent, formElements (validated)
            deactivate CMS

            FormFlowPage -->> ReactComponents: loaderData (userData, cmsContent, formElements, navigation)
            deactivate FormFlowPage
            ReactComponents -->> Browser: Render FormFlowPage
            Browser -->> User: Display page
        end
    end

    rect rgb(255, 243, 224)
        Note over User,CMS: POST Request - Submitting Form Data
        User ->> Browser: Submit form
        Browser ->> ReactComponents: Form submission event
        ReactComponents ->> FormFlowPage: POST /flowId/stepId (formData)
        activate FormFlowPage

        FormFlowPage ->> PageSchemas: getPageSchema(pathname)
        activate PageSchemas
        PageSchemas -->> FormFlowPage: pageSchema (Zod schema)
        deactivate PageSchemas
        FormFlowPage ->> FormFlowPage: validate formData

        alt Validation Error
            FormFlowPage -->> ReactComponents: validationError
            ReactComponents -->> Browser: Render errors
            Browser -->> User: Display form field errors
        else Validation Success
            FormFlowPage ->> UserDataStorage: getSession(cookieHeader)
            activate UserDataStorage
            UserDataStorage -->> FormFlowPage: flowSession
            deactivate UserDataStorage
            FormFlowPage ->> FormFlowPage: updateSession(flowSession, validFormData)

            FormFlowPage ->> Pruner: pruneIrrelevantData(updatedSessionData, flowId)
            activate Pruner
            Pruner ->> FlowController: buildFlowController(updatedSessionData)
            activate FlowController
            FlowController -->> Pruner: validFlowPaths
            deactivate FlowController
            Pruner ->> PageSchemas: getAllFieldsFromFlowId(flowId)
            activate PageSchemas
            PageSchemas -->> Pruner: validFormFields
            deactivate PageSchemas
            Pruner ->> Pruner: prune data
            Pruner -->> FormFlowPage: prunedData
            deactivate Pruner

            FormFlowPage ->> FlowController: flowDestination(pathname, prunedData)
            activate FlowController
            FlowController -->> FormFlowPage: nextStepId
            deactivate FlowController

            FormFlowPage ->> UserDataStorage: commitSession(flowSession)
            activate UserDataStorage
            UserDataStorage -->> FormFlowPage: Set-Cookie header
            deactivate UserDataStorage

            FormFlowPage -->> Browser: redirectDocument(nextStepId)
            deactivate FormFlowPage
            Browser -->> User: Navigate to next step
        end
    end
```
