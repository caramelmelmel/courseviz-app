declare module 'xoces';

type Entity = {
    id: string,
    type: string,
    [key: string]: any,
}

type EntityFunction = (entity: Entity) => void;

type Relationship = {
    type: string,
    directionality: "DIRECTED",
    sourceId: string,
    targetId: string,
}

type XocesConfig = {
    data: {
        entities: Entity[],
        relationships?: Relationship[],
    },
    hierarchy: string[],
    currentLevelEntity?: string,
    entityLabelKey: string,
    nodeLabelKey?: string,
    relationship: {
        parentType: string,
        sourceRef: string,
        targetRef: string,
    },
    width?: string,
    height?: number | string,
    colorScheme: "light" | "dark",
    onMouseOverDirection?: "outgoing",
    onMouseOverFinish?: EntityFunction,
    onMouseOutFinish?: EntityFunction,
    onClickFinish?: EntityFunction,
}

