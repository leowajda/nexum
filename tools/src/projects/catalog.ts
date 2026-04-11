import { eurekaProjectDefinition } from "./eureka/index.js"
import { sourceNotesProjectDefinition } from "./source-notes/index.js"
import type { ProjectDefinition } from "./project.js"

export const projectDefinitions = [eurekaProjectDefinition, sourceNotesProjectDefinition] satisfies ReadonlyArray<ProjectDefinition>
