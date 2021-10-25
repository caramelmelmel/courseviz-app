import React, { useEffect } from 'react';
import xoces from 'xoces';
import chroma from 'chroma-js';
import wrap from 'word-wrap';

const XocesWidget: React.FC<{ pillars: Pillar[], courses: Course[], mos: MO[], moLinks: MOLink[], key: any }> = ({
    pillars,
    courses,
    mos,
    moLinks,
    key,
}) => {
    const CONTAINER_ID = "xoces-widget-container";


    // set up entities
    const pillarEntities = pillars.map((p, idx) => ({
        id: "pillar_" + p.id,
        pid: p.id,
        idx: idx,
        name: p.name,
        type: "pillar"
    }));

    const courseEntities = courses.map((c) => ({
        id: "course_" + c.id_int,
        pid: c.pillar_id,
        cid: c.id_int,
        clabel: c.id,
        name: `${c.id} - ${c.name}`,
        type: "course"
    }));

    const moEntities = mos.map((m) => {
        const pillarIdx = pillarEntities.find((p) => p.pid == m.pillar_id).idx;
        const courseId = courseEntities.find((c) => c.cid == m.course_id).clabel;
        return {
            id: "mo_" + m.id_int,
            pillarEntityIdx: pillarIdx,
            name: `${courseId} ${m.id} - ${m.name}`,
            type: "mo"
        }
    });

    const entities: Entity[] = [
        { id: "sutd", name: "SUTD", type: "school" },
        ...pillarEntities,
        ...courseEntities,
        ...moEntities,
    ]

    // set up relationships
    const relationships: Relationship[] = [];

    // school -> pillar
    pillars.forEach((p) => {
        relationships.push({
            type: "HAS_PARENT_OF",
            directionality: "DIRECTED",
            sourceId: "pillar_" + p.id,
            targetId: "sutd",
        })
    })

    // pillar -> course
    courses.forEach((c) => {
        relationships.push({
            type: "HAS_PARENT_OF",
            directionality: "DIRECTED",
            sourceId: "course_" + c.id_int,
            targetId: "pillar_" + c.pillar_id,
        })
    })

    // mo -> pillar
    mos.forEach((mo) => {
        relationships.push({
            type: "HAS_PARENT_OF",
            directionality: "DIRECTED",
            sourceId: "mo_" + mo.id_int,
            targetId: "course_" + mo.course_id,
        })
    })

    // mo links
    moLinks.forEach((mol) => {
        // reverse the direction of arrows, since we want
        // prereq_mo -> mo instead of the opposite
        const src = mol.dst;
        const dst = mol.src;

        relationships.push({
            type: "HAS_PREREQUISITE_OF",
            directionality: "DIRECTED",
            sourceId: "mo_" + src,
            targetId: "mo_" + dst,
        })
    })

    const createSetMOEntityColor = (colorScheme: string) => {
        let fillRange = ['#2686BF', '#BCD693', '#AF7575'];
        if (colorScheme == "dark") {
            fillRange = ['#D58C47', '#355CBF', '#4A941E'];
        }

        const colorScale = chroma.scale(fillRange).domain([0, pillarEntities.length - 1]).mode('lch');

        return (moEntity) => colorScale(moEntity.pillarEntityIdx).hex();
    }

    const xocesConfig: XocesConfig = {
        hierarchy: ["school", "pillar", "course", "mo"],
        data: {
            entities,
            relationships,
        },
        entityLabelKey: "name",
        relationship: {
            parentType: "HAS_PARENT_OF",
            sourceRef: "sourceId",
            targetRef: "targetId",
        },
        width: "100%",
        height: "48rem",
        colorScheme: "light",
        nodeColor: createSetMOEntityColor("light"),
        nodeLabelKey: "name",
        onMouseOverDirection: "both",
    }

    useEffect(() => {
        console.log(xocesConfig);
        const w = xoces.widgets.XocesWidget.new(xocesConfig);
        w.render({ container: CONTAINER_ID + String(key) });
    }, []);

    return (
        <div id={CONTAINER_ID + String(key)}></div>
    )
}

export default XocesWidget;